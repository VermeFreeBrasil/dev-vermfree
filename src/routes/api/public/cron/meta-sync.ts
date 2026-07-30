import { createFileRoute } from "@tanstack/react-router";

const OBJETIVO_CONVERSAO: Record<string, string> = {
  OUTCOME_SALES: "omni_purchase",
  LEADS: "lead",
  ENGAGEMENT: "messaging_conversation_started_7d",
  TRAFFIC: "link_click",
  AWARENESS: "reach",
};

function actionValue(actions: any[] | undefined, type: string) {
  if (!Array.isArray(actions)) return 0;
  const found = actions.find((a) => a.action_type === type);
  return found ? Number(found.value ?? 0) : 0;
}

async function sync(dias: number) {
  const token = process.env.META_ACCESS_TOKEN;
  const account = process.env.META_AD_ACCOUNT_ID;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  if (!token || !account) {
    await supabaseAdmin
      .from("sync_log")
      .insert({ fonte: "meta_ads", status: "erro", mensagem: "credenciais Meta ausentes" });
    return { ok: false, error: "missing_credentials" };
  }

  const until = new Date();
  const since = new Date(until.getTime() - dias * 86400000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const params = new URLSearchParams({
    access_token: token,
    level: "campaign",
    time_increment: "1",
    breakdowns: "publisher_platform,platform_position",
    time_range: JSON.stringify({ since: fmt(since), until: fmt(until) }),
    fields:
      "campaign_id,campaign_name,objective,spend,impressions,clicks,reach,actions,action_values,date_start",
    limit: "500",
  });

  const res = await fetch(`https://graph.facebook.com/v21.0/${account}/insights?${params}`);
  const json = (await res.json()) as any;

  if (!res.ok || json.error) {
    await supabaseAdmin.from("sync_log").insert({
      fonte: "meta_ads",
      status: "erro",
      mensagem: JSON.stringify(json.error ?? json).slice(0, 500),
    });
    return { ok: false, error: json.error ?? "meta_api_error" };
  }

  const linhas = (json.data ?? []).map((r: any) => {
    const objetivo = r.objective ?? "";
    const tipoConversao = OBJETIVO_CONVERSAO[objetivo] ?? "omni_purchase";
    const linkClicks = actionValue(r.actions, "link_click");
    const conversoes =
      tipoConversao === "link_click"
        ? linkClicks
        : tipoConversao === "reach"
          ? Number(r.reach ?? 0)
          : actionValue(r.actions, tipoConversao);
    return {
      campaign_id: String(r.campaign_id),
      campaign_name: r.campaign_name ?? null,
      objective: objetivo || null,
      dia: r.date_start,
      platform_position: r.platform_position ?? "all",
      spend: Number(r.spend ?? 0),
      impressions: Number(r.impressions ?? 0),
      clicks: Number(r.clicks ?? 0),
      link_clicks: linkClicks,
      reach: Number(r.reach ?? 0),
      conversion_type: tipoConversao,
      conversions: conversoes,
      // Agregado de compras usa SOMENTE omni_purchase.
      purchases: actionValue(r.actions, "omni_purchase"),
      purchase_value: actionValue(r.action_values, "omni_purchase"),
      updated_at: new Date().toISOString(),
    };
  });

  if (linhas.length) {
    const { error } = await supabaseAdmin
      .from("meta_campanhas_diario")
      .upsert(linhas, { onConflict: "campaign_id,dia,platform_position" });
    if (error) {
      await supabaseAdmin
        .from("sync_log")
        .insert({ fonte: "meta_ads", status: "erro", mensagem: error.message });
      return { ok: false, error: error.message };
    }
  }

  await supabaseAdmin.from("sync_log").insert({
    fonte: "meta_ads",
    status: "ok",
    mensagem: `janela de ${dias} dias`,
    registros: linhas.length,
  });
  return { ok: true, registros: linhas.length };
}

export const Route = createFileRoute("/api/public/cron/meta-sync")({
  server: {
    handlers: {
      GET: async () => Response.json(await sync(7)),
      POST: async ({ request }) => {
        let dias = 7;
        try {
          const body = (await request.json()) as { dias?: number };
          if (typeof body?.dias === "number" && body.dias > 0 && body.dias <= 90) dias = body.dias;
        } catch {
          /* corpo vazio */
        }
        return Response.json(await sync(dias));
      },
    },
  },
});