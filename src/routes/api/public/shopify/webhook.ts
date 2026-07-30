import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";

function verify(rawBody: string, header: string | null, secret: string) {
  if (!header) return false;
  const digest = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  const a = Buffer.from(digest);
  const b = Buffer.from(header);
  return a.length === b.length && timingSafeEqual(a, b);
}

// As vendas reais da VermFree já chegam em public.compra_aprovada via um pipeline
// externo (n8n). Este endpoint só valida a assinatura e registra o recebimento —
// ele não grava pedidos, pra não manter uma segunda cópia divergente dos dados.
export const Route = createFileRoute("/api/public/shopify/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
        if (!secret) return new Response("Webhook não configurado", { status: 500 });

        const raw = await request.text();
        if (!verify(raw, request.headers.get("x-shopify-hmac-sha256"), secret)) {
          return new Response("Assinatura inválida", { status: 401 });
        }

        const topic = request.headers.get("x-shopify-topic") ?? "";
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await supabaseAdmin
          .from("sync_log")
          .insert({ fonte: "shopify_webhook", status: "ok", mensagem: `recebido: ${topic}` });

        return Response.json({ ok: true, topic });
      },
    },
  },
});
