import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type Periodo = { from: string; to: string };

const num = (v: unknown) => Number(v ?? 0);

export function defaultPeriodo(): Periodo {
  const to = new Date();
  const from = new Date(to.getTime() - 29 * 86400000);
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
}

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

/* ---------------- VENDAS ---------------- */

export async function fetchVendas(p: Periodo) {
  const { data: orders, error } = await supabaseAdmin
    .from("shopify_orders")
    .select("*")
    .gte("created_at", `${p.from}T00:00:00Z`)
    .lte("created_at", `${p.to}T23:59:59Z`)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);

  const { data: cupons } = await supabaseAdmin.from("cupons_influencers").select("*");
  const mapaCupom = new Map((cupons ?? []).map((c) => [c.discount_code.toUpperCase(), c]));

  // Apenas pedidos PAGOS entram no faturamento.
  const pagos = (orders ?? []).filter((o) => o.status === "paid");

  const faturamento = pagos.reduce((s, o) => s + num(o.valor) - num(o.refund_total), 0);
  const pedidos = pagos.length;
  const ticketMedio = pedidos ? faturamento / pedidos : 0;

  const serieMap = new Map<string, { dia: string; valor: number; pedidos: number }>();
  for (const o of pagos) {
    const k = dayKey(o.created_at);
    const cur = serieMap.get(k) ?? { dia: k, valor: 0, pedidos: 0 };
    cur.valor += num(o.valor) - num(o.refund_total);
    cur.pedidos += 1;
    serieMap.set(k, cur);
  }
  const serie = [...serieMap.values()].sort((a, b) => a.dia.localeCompare(b.dia));

  // Canais de tráfego: mutuamente exclusivos (somam 100%)
  const canalMap = new Map<string, { canal: string; valor: number; pedidos: number }>();
  for (const o of pagos) {
    const canal = (o.utm_source || "direto").toLowerCase();
    const cur = canalMap.get(canal) ?? { canal, valor: 0, pedidos: 0 };
    cur.valor += num(o.valor) - num(o.refund_total);
    cur.pedidos += 1;
    canalMap.set(canal, cur);
  }
  const canais = [...canalMap.values()]
    .map((c) => ({ ...c, pct: faturamento ? (c.valor / faturamento) * 100 : 0 }))
    .sort((a, b) => b.valor - a.valor);

  // Cupons: camada transversal, não entra no somatório de canais
  const cupomMap = new Map<
    string,
    { code: string; influencer: string | null; excluido: boolean; valor: number; pedidos: number }
  >();
  for (const o of pagos) {
    if (!o.discount_code) continue;
    const code = o.discount_code.toUpperCase();
    const meta = mapaCupom.get(code);
    const cur =
      cupomMap.get(code) ??
      {
        code,
        influencer: meta?.influencer ?? null,
        excluido: meta?.excluido_atribuicao ?? false,
        valor: 0,
        pedidos: 0,
      };
    cur.valor += num(o.valor) - num(o.refund_total);
    cur.pedidos += 1;
    cupomMap.set(code, cur);
  }
  const camadaCupons = [...cupomMap.values()].sort((a, b) => b.valor - a.valor);

  const influencerMap = new Map<string, { influencer: string; valor: number; pedidos: number }>();
  for (const c of camadaCupons) {
    if (c.excluido || !c.influencer) continue;
    const cur = influencerMap.get(c.influencer) ?? { influencer: c.influencer, valor: 0, pedidos: 0 };
    cur.valor += c.valor;
    cur.pedidos += c.pedidos;
    influencerMap.set(c.influencer, cur);
  }

  return {
    periodo: p,
    faturamento,
    pedidos,
    ticketMedio,
    totalRegistros: (orders ?? []).length,
    cancelados: (orders ?? []).filter((o) => o.status === "cancelled").length,
    reembolsos: (orders ?? []).reduce((s, o) => s + num(o.refund_total), 0),
    serie,
    canais,
    camadaCupons,
    influencers: [...influencerMap.values()].sort((a, b) => b.valor - a.valor),
  };
}

/* ---------------- ESTOQUE ---------------- */

export async function fetchEstoque() {
  const { data: produtos, error } = await supabaseAdmin
    .from("produtos_estoque")
    .select("*")
    .order("sku");
  if (error) throw new Error(error.message);

  const { data: log } = await supabaseAdmin
    .from("sync_log")
    .select("*")
    .eq("fonte", "shopify_estoque")
    .order("executado_em", { ascending: false })
    .limit(5);

  return { produtos: produtos ?? [], log: log ?? [] };
}

export async function runSyncEstoque() {
  const { data, error } = await supabaseAdmin.rpc("sync_shopify_estoque" as never);
  if (error) throw new Error(error.message);
  return data as unknown;
}

/* ---------------- CAMPANHAS / ROAS ---------------- */

export const OBJETIVO_CONVERSAO: Record<string, string> = {
  OUTCOME_SALES: "omni_purchase",
  LEADS: "lead",
  ENGAGEMENT: "messaging_conversation_started_7d",
  TRAFFIC: "link_click",
  AWARENESS: "reach",
};

export async function fetchCampanhas(p: Periodo) {
  const { data: rows, error } = await supabaseAdmin
    .from("meta_campanhas_diario")
    .select("*")
    .gte("dia", p.from)
    .lte("dia", p.to);
  if (error) throw new Error(error.message);

  const { data: orders } = await supabaseAdmin
    .from("shopify_orders")
    .select("valor, refund_total, status, utm_campaign, utm_source, created_at")
    .eq("status", "paid")
    .gte("created_at", `${p.from}T00:00:00Z`)
    .lte("created_at", `${p.to}T23:59:59Z`);

  const vendasPorCampanha = new Map<string, number>();
  for (const o of orders ?? []) {
    if (!o.utm_campaign) continue;
    const k = o.utm_campaign.toLowerCase();
    vendasPorCampanha.set(k, (vendasPorCampanha.get(k) ?? 0) + num(o.valor) - num(o.refund_total));
  }

  type Agg = {
    campaign_id: string;
    campaign_name: string;
    objective: string;
    conversion_type: string;
    spend: number;
    impressions: number;
    clicks: number;
    link_clicks: number;
    reach: number;
    conversions: number;
    purchases: number;
    purchase_value: number;
  };
  const agg = new Map<string, Agg>();
  const totalGeral = { spend: 0, impressions: 0, clicks: 0, purchases: 0, purchase_value: 0 };
  const posMap = new Map<string, { platform_position: string; spend: number; impressions: number; clicks: number; purchases: number }>();
  const serieMap = new Map<string, { dia: string; spend: number; purchase_value: number }>();

  for (const r of rows ?? []) {
    const key = r.campaign_id;
    const cur: Agg =
      agg.get(key) ??
      {
        campaign_id: r.campaign_id,
        campaign_name: r.campaign_name ?? r.campaign_id,
        objective: r.objective ?? "—",
        conversion_type: r.conversion_type ?? OBJETIVO_CONVERSAO[r.objective ?? ""] ?? "—",
        spend: 0,
        impressions: 0,
        clicks: 0,
        link_clicks: 0,
        reach: 0,
        conversions: 0,
        purchases: 0,
        purchase_value: 0,
      };
    cur.spend += num(r.spend);
    cur.impressions += num(r.impressions);
    cur.clicks += num(r.clicks);
    cur.link_clicks += num(r.link_clicks);
    cur.reach += num(r.reach);
    cur.conversions += num(r.conversions);
    // No agregado, apenas omni_purchase conta como compra.
    cur.purchases += num(r.purchases);
    cur.purchase_value += num(r.purchase_value);
    agg.set(key, cur);

    totalGeral.spend += num(r.spend);
    totalGeral.impressions += num(r.impressions);
    totalGeral.clicks += num(r.clicks);
    totalGeral.purchases += num(r.purchases);
    totalGeral.purchase_value += num(r.purchase_value);

    const pos = r.platform_position ?? "all";
    const pcur = posMap.get(pos) ?? { platform_position: pos, spend: 0, impressions: 0, clicks: 0, purchases: 0 };
    pcur.spend += num(r.spend);
    pcur.impressions += num(r.impressions);
    pcur.clicks += num(r.clicks);
    pcur.purchases += num(r.purchases);
    posMap.set(pos, pcur);

    const scur = serieMap.get(r.dia) ?? { dia: r.dia, spend: 0, purchase_value: 0 };
    scur.spend += num(r.spend);
    scur.purchase_value += num(r.purchase_value);
    serieMap.set(r.dia, scur);
  }

  const campanhas = [...agg.values()].map((c) => {
    const vendasReais =
      (vendasPorCampanha.get(c.campaign_id.toLowerCase()) ?? 0) +
      (vendasPorCampanha.get(c.campaign_name.toLowerCase()) ?? 0);
    return {
      ...c,
      roasMeta: c.spend ? c.purchase_value / c.spend : 0,
      roasReal: c.spend ? vendasReais / c.spend : 0,
      vendasReais,
    };
  });

  const vendasReaisTotal = campanhas.reduce((s, c) => s + c.vendasReais, 0);

  return {
    periodo: p,
    campanhas: campanhas.sort((a, b) => b.spend - a.spend),
    posicionamentos: [...posMap.values()].sort((a, b) => b.spend - a.spend),
    serie: [...serieMap.values()].sort((a, b) => a.dia.localeCompare(b.dia)),
    total: {
      ...totalGeral,
      vendasReais: vendasReaisTotal,
      roasMeta: totalGeral.spend ? totalGeral.purchase_value / totalGeral.spend : 0,
      roasReal: totalGeral.spend ? vendasReaisTotal / totalGeral.spend : 0,
    },
  };
}

/* ---------------- CUPONS ---------------- */

export async function fetchCupons() {
  const { data, error } = await supabaseAdmin
    .from("cupons_influencers")
    .select("*")
    .order("influencer");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function upsertCupom(input: {
  discount_code: string;
  influencer: string;
  categoria?: string | null;
  excluido_atribuicao?: boolean;
}) {
  const { error } = await supabaseAdmin.from("cupons_influencers").upsert(
    {
      discount_code: input.discount_code.toUpperCase(),
      influencer: input.influencer,
      categoria: input.categoria ?? null,
      excluido_atribuicao: input.excluido_atribuicao ?? false,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "discount_code" },
  );
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function deleteCupom(code: string) {
  const { error } = await supabaseAdmin.from("cupons_influencers").delete().eq("discount_code", code);
  if (error) throw new Error(error.message);
  return { ok: true };
}

/* ---------------- METAS ---------------- */

export async function fetchMetas() {
  const { data: metas, error } = await supabaseAdmin
    .from("metas")
    .select("*")
    .order("slot")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  const ids = (metas ?? []).map((m) => m.id);
  const { data: dias } = ids.length
    ? await supabaseAdmin.from("metas_dias").select("*").in("meta_id", ids).order("dia")
    : { data: [] as never[] };

  const ativa = (metas ?? []).find((m) => m.ativa && !m.arquivada) ?? null;

  let progresso = { faturamento: 0, pedidos: 0 };
  if (ativa) {
    const { data: orders } = await supabaseAdmin
      .from("shopify_orders")
      .select("valor, refund_total")
      .eq("status", "paid")
      .gte("created_at", `${ativa.periodo_inicio}T00:00:00Z`)
      .lte("created_at", `${ativa.periodo_fim}T23:59:59Z`);
    progresso = {
      faturamento: (orders ?? []).reduce((s, o) => s + num(o.valor) - num(o.refund_total), 0),
      pedidos: (orders ?? []).length,
    };
  }

  return { metas: metas ?? [], dias: dias ?? [], ativaId: ativa?.id ?? null, progresso };
}

export async function upsertMeta(input: {
  id?: string | null;
  slot: number;
  nome: string;
  setor?: string | null;
  valor_alvo: number;
  pedidos_alvo: number;
  periodo_inicio: string;
  periodo_fim: string;
}) {
  const payload = {
    slot: input.slot,
    nome: input.nome,
    setor: input.setor || null,
    valor_alvo: input.valor_alvo,
    pedidos_alvo: input.pedidos_alvo,
    periodo_inicio: input.periodo_inicio,
    periodo_fim: input.periodo_fim,
    updated_at: new Date().toISOString(),
  };
  if (input.id) {
    const { error } = await supabaseAdmin.from("metas").update(payload).eq("id", input.id);
    if (error) throw new Error(error.message);
    return { ok: true, id: input.id };
  }
  const { data, error } = await supabaseAdmin.from("metas").insert(payload).select("id").single();
  if (error) throw new Error(error.message);
  return { ok: true, id: data.id };
}

export async function setMetaAtiva(id: string) {
  const off = await supabaseAdmin.from("metas").update({ ativa: false }).neq("id", id);
  if (off.error) throw new Error(off.error.message);
  const on = await supabaseAdmin.from("metas").update({ ativa: true, arquivada: false }).eq("id", id);
  if (on.error) throw new Error(on.error.message);
  return { ok: true };
}

export async function arquivarMeta(id: string) {
  const { error } = await supabaseAdmin
    .from("metas")
    .update({ arquivada: true, ativa: false })
    .eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function setPesoDia(input: {
  meta_id: string;
  dia: string;
  peso: number;
  tipo_dia: string;
}) {
  const { error } = await supabaseAdmin
    .from("metas_dias")
    .upsert({ ...input }, { onConflict: "meta_id,dia" });
  if (error) throw new Error(error.message);
  return { ok: true };
}