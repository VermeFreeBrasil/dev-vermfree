import { createFileRoute } from "@tanstack/react-router";

// As métricas reais do Meta Ads já chegam em public.meta_ads via um pipeline
// externo (n8n). Este endpoint fica inerte por padrão — só registra a chamada —
// pra não manter uma segunda cópia divergente da mesma tabela. Se um dia
// precisar de um sync próprio, implemente aqui usando META_ACCESS_TOKEN e
// META_AD_ACCOUNT_ID e escreva em public.meta_ads com o mesmo formato de linha
// (level=campaign, colunas actions/action_values como JSON stringificado).
async function sync() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("sync_log").insert({
    fonte: "meta_ads",
    status: "ok",
    mensagem: "endpoint inerte — dados já vêm via pipeline externo (public.meta_ads)",
  });
  return { ok: true, note: "sync externo já cobre meta_ads; nenhuma ação executada" };
}

export const Route = createFileRoute("/api/public/cron/meta-sync")({
  server: {
    handlers: {
      GET: async () => Response.json(await sync()),
      POST: async () => Response.json(await sync()),
    },
  },
});
