import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";

function parseUtms(landingSite: string | null | undefined) {
  const out: Record<string, string | null> = {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    utm_term: null,
  };
  if (!landingSite) return out;
  try {
    const url = new URL(landingSite, "https://shop.local");
    for (const key of Object.keys(out)) out[key] = url.searchParams.get(key);
  } catch {
    /* landing_site inválido — mantém nulos */
  }
  return out;
}

function verify(rawBody: string, header: string | null, secret: string) {
  if (!header) return false;
  const digest = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  const a = Buffer.from(digest);
  const b = Buffer.from(header);
  return a.length === b.length && timingSafeEqual(a, b);
}

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
        const payload = JSON.parse(raw) as Record<string, any>;
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        if (topic === "refunds/create") {
          const orderId = String(payload.order_id ?? "");
          if (!orderId) return new Response("sem order_id", { status: 400 });
          const total = (payload.transactions ?? []).reduce(
            (s: number, t: any) => s + Number(t.amount ?? 0),
            0,
          );
          const { data: atual } = await supabaseAdmin
            .from("shopify_orders")
            .select("refund_total")
            .eq("id", orderId)
            .maybeSingle();
          await supabaseAdmin
            .from("shopify_orders")
            .update({
              refund_total: Number(atual?.refund_total ?? 0) + total,
              status: "refunded",
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId);
          return Response.json({ ok: true, topic });
        }

        const id = String(payload.id ?? "");
        if (!id) return new Response("sem id", { status: 400 });

        const landing = payload.landing_site ?? null;
        const utms = parseUtms(landing);
        const primeiroCupom =
          Array.isArray(payload.discount_codes) && payload.discount_codes.length
            ? String(payload.discount_codes[0].code ?? "").toUpperCase()
            : null;

        const status =
          topic === "orders/cancelled"
            ? "cancelled"
            : payload.financial_status === "paid"
              ? "paid"
              : (payload.financial_status ?? "pending");

        const { error } = await supabaseAdmin.from("shopify_orders").upsert(
          {
            id,
            order_number: String(payload.order_number ?? payload.name ?? ""),
            valor: Number(payload.total_price ?? 0),
            currency: payload.currency ?? "BRL",
            status,
            financial_status: payload.financial_status ?? null,
            discount_code: primeiroCupom,
            landing_site: landing,
            ...utms,
            created_at: payload.created_at ?? new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" },
        );
        if (error) return new Response(error.message, { status: 500 });

        return Response.json({ ok: true, topic, id });
      },
    },
  },
});