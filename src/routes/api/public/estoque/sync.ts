import { createFileRoute } from "@tanstack/react-router";

async function sincronizar() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.rpc("sync_shopify_estoque");
  if (error) return { ok: false, error: error.message };
  return data;
}

async function listar() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("produtos_estoque")
    .select("sku, nome, estoque_atual, estoque_base, atualizado_em")
    .order("sku");
  if (error) return { ok: false, error: error.message };
  return { ok: true, produtos: data ?? [] };
}

export const Route = createFileRoute("/api/public/estoque/sync")({
  server: {
    handlers: {
      GET: async () => Response.json(await listar()),
      POST: async () => Response.json(await sincronizar()),
    },
  },
});