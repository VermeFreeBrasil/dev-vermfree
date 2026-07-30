
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============ config (credenciais das integrações) ============
CREATE TABLE public.app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.app_config TO service_role;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

INSERT INTO public.app_config (key, value) VALUES
  ('shopify_shop_domain', 'vermfree.myshopify.com'),
  ('shopify_client_id', 'placeholder-shopify-client-id'),
  ('shopify_client_secret', 'placeholder-shopify-client-secret'),
  ('shopify_api_version', '2024-10');

-- ============ pedidos ============
CREATE TABLE public.shopify_orders (
  id TEXT PRIMARY KEY,
  order_number TEXT,
  valor NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'BRL',
  status TEXT NOT NULL DEFAULT 'paid',
  financial_status TEXT,
  discount_code TEXT,
  landing_site TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  refund_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX shopify_orders_created_at_idx ON public.shopify_orders (created_at DESC);
CREATE INDEX shopify_orders_status_idx ON public.shopify_orders (status);
CREATE INDEX shopify_orders_discount_idx ON public.shopify_orders (discount_code);
GRANT ALL ON public.shopify_orders TO service_role;
ALTER TABLE public.shopify_orders ENABLE ROW LEVEL SECURITY;

-- ============ estoque ============
CREATE TABLE public.produtos_estoque (
  sku TEXT PRIMARY KEY,
  nome TEXT,
  estoque_atual INTEGER NOT NULL DEFAULT 0,
  estoque_base INTEGER NOT NULL DEFAULT 0,
  inventory_item_id TEXT,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  base_atualizado_em TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.produtos_estoque TO service_role;
ALTER TABLE public.produtos_estoque ENABLE ROW LEVEL SECURITY;

-- ============ meta ads ============
CREATE TABLE public.meta_campanhas_diario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id TEXT NOT NULL,
  campaign_name TEXT,
  objective TEXT,
  dia DATE NOT NULL,
  platform_position TEXT NOT NULL DEFAULT 'all',
  spend NUMERIC(12,2) NOT NULL DEFAULT 0,
  impressions BIGINT NOT NULL DEFAULT 0,
  clicks BIGINT NOT NULL DEFAULT 0,
  link_clicks BIGINT NOT NULL DEFAULT 0,
  reach BIGINT NOT NULL DEFAULT 0,
  conversion_type TEXT,
  conversions NUMERIC(12,2) NOT NULL DEFAULT 0,
  purchases NUMERIC(12,2) NOT NULL DEFAULT 0,
  purchase_value NUMERIC(12,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (campaign_id, dia, platform_position)
);
CREATE INDEX meta_campanhas_dia_idx ON public.meta_campanhas_diario (dia DESC);
GRANT ALL ON public.meta_campanhas_diario TO service_role;
ALTER TABLE public.meta_campanhas_diario ENABLE ROW LEVEL SECURITY;

-- ============ cupons / influencers ============
CREATE TABLE public.cupons_influencers (
  discount_code TEXT PRIMARY KEY,
  influencer TEXT NOT NULL,
  categoria TEXT,
  excluido_atribuicao BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.cupons_influencers TO service_role;
ALTER TABLE public.cupons_influencers ENABLE ROW LEVEL SECURITY;

-- ============ metas ============
CREATE TABLE public.metas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot INTEGER NOT NULL CHECK (slot BETWEEN 1 AND 3),
  nome TEXT NOT NULL,
  setor TEXT,
  valor_alvo NUMERIC(12,2) NOT NULL DEFAULT 0,
  pedidos_alvo INTEGER NOT NULL DEFAULT 0,
  periodo_inicio DATE NOT NULL,
  periodo_fim DATE NOT NULL,
  ativa BOOLEAN NOT NULL DEFAULT false,
  arquivada BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.metas TO service_role;
ALTER TABLE public.metas ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.metas_dias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meta_id UUID NOT NULL REFERENCES public.metas(id) ON DELETE CASCADE,
  dia DATE NOT NULL,
  peso NUMERIC(6,2) NOT NULL DEFAULT 1,
  tipo_dia TEXT NOT NULL DEFAULT 'normal',
  observacao TEXT,
  UNIQUE (meta_id, dia)
);
GRANT ALL ON public.metas_dias TO service_role;
ALTER TABLE public.metas_dias ENABLE ROW LEVEL SECURITY;

-- ============ log de sincronização ============
CREATE TABLE public.sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fonte TEXT NOT NULL,
  status TEXT NOT NULL,
  mensagem TEXT,
  registros INTEGER NOT NULL DEFAULT 0,
  executado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX sync_log_fonte_idx ON public.sync_log (fonte, executado_em DESC);
GRANT ALL ON public.sync_log TO service_role;
ALTER TABLE public.sync_log ENABLE ROW LEVEL SECURITY;

-- ============ helper: espera resposta pg_net ============
CREATE OR REPLACE FUNCTION public._http_wait(req_id BIGINT, tentativas INTEGER DEFAULT 40)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, net, extensions
AS $$
DECLARE
  i INTEGER := 0;
  resposta RECORD;
BEGIN
  WHILE i < tentativas LOOP
    SELECT status_code, content INTO resposta
    FROM net._http_response WHERE id = req_id;
    IF FOUND AND resposta.status_code IS NOT NULL THEN
      RETURN jsonb_build_object('status', resposta.status_code, 'body', resposta.content);
    END IF;
    PERFORM pg_sleep(0.5);
    i := i + 1;
  END LOOP;
  RETURN jsonb_build_object('status', 0, 'body', 'timeout');
END;
$$;

-- ============ sincronização de estoque Shopify (OAuth client credentials + GraphQL) ============
CREATE OR REPLACE FUNCTION public.sync_shopify_estoque()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, net, extensions
AS $$
DECLARE
  shop TEXT;
  client_id TEXT;
  client_secret TEXT;
  api_version TEXT;
  req BIGINT;
  resp JSONB;
  token TEXT;
  gql JSONB;
  node JSONB;
  total INTEGER := 0;
BEGIN
  SELECT value INTO shop FROM public.app_config WHERE key = 'shopify_shop_domain';
  SELECT value INTO client_id FROM public.app_config WHERE key = 'shopify_client_id';
  SELECT value INTO client_secret FROM public.app_config WHERE key = 'shopify_client_secret';
  SELECT value INTO api_version FROM public.app_config WHERE key = 'shopify_api_version';

  IF shop IS NULL OR client_id IS NULL OR client_secret IS NULL THEN
    INSERT INTO public.sync_log (fonte, status, mensagem) VALUES ('shopify_estoque', 'erro', 'credenciais ausentes em app_config');
    RETURN jsonb_build_object('ok', false, 'error', 'missing_config');
  END IF;

  -- 1) OAuth client credentials
  SELECT net.http_post(
    url := 'https://' || shop || '/admin/oauth/access_token',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'client_id', client_id,
      'client_secret', client_secret,
      'grant_type', 'client_credentials'
    )
  ) INTO req;

  resp := public._http_wait(req);
  IF (resp->>'status')::int <> 200 THEN
    INSERT INTO public.sync_log (fonte, status, mensagem) VALUES ('shopify_estoque', 'erro', 'oauth: ' || coalesce(resp->>'body', ''));
    RETURN jsonb_build_object('ok', false, 'step', 'oauth', 'resp', resp);
  END IF;
  token := (resp->>'body')::jsonb ->> 'access_token';

  -- 2) GraphQL productVariants
  SELECT net.http_post(
    url := 'https://' || shop || '/admin/api/' || coalesce(api_version, '2024-10') || '/graphql.json',
    headers := jsonb_build_object('Content-Type', 'application/json', 'X-Shopify-Access-Token', token),
    body := jsonb_build_object(
      'query',
      'query { productVariants(first: 250) { edges { node { sku inventoryQuantity displayName inventoryItem { id } } } } }'
    )
  ) INTO req;

  resp := public._http_wait(req);
  IF (resp->>'status')::int <> 200 THEN
    INSERT INTO public.sync_log (fonte, status, mensagem) VALUES ('shopify_estoque', 'erro', 'graphql: ' || coalesce(resp->>'body', ''));
    RETURN jsonb_build_object('ok', false, 'step', 'graphql', 'resp', resp);
  END IF;

  gql := (resp->>'body')::jsonb;

  FOR node IN SELECT jsonb_array_elements(gql #> '{data,productVariants,edges}') -> 'node'
  LOOP
    IF coalesce(node->>'sku', '') = '' THEN CONTINUE; END IF;
    INSERT INTO public.produtos_estoque (sku, nome, estoque_atual, inventory_item_id, atualizado_em, updated_at)
    VALUES (
      node->>'sku',
      node->>'displayName',
      coalesce((node->>'inventoryQuantity')::int, 0),
      node #>> '{inventoryItem,id}',
      now(), now()
    )
    ON CONFLICT (sku) DO UPDATE SET
      nome = COALESCE(EXCLUDED.nome, public.produtos_estoque.nome),
      estoque_atual = EXCLUDED.estoque_atual,
      inventory_item_id = COALESCE(EXCLUDED.inventory_item_id, public.produtos_estoque.inventory_item_id),
      atualizado_em = now(),
      updated_at = now();
    total := total + 1;
  END LOOP;

  INSERT INTO public.sync_log (fonte, status, mensagem, registros)
  VALUES ('shopify_estoque', 'ok', 'sincronizado via Admin API GraphQL', total);

  RETURN jsonb_build_object('ok', true, 'registros', total);
END;
$$;

-- ============ cron a cada 15 minutos ============
SELECT cron.schedule('sync-shopify-estoque', '*/15 * * * *', $$SELECT public.sync_shopify_estoque();$$);
