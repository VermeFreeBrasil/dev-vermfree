import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const periodoSchema = z.object({ from: z.string(), to: z.string() });

export const unlockSite = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => z.object({ password: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const { getGateSession, passwordMatches } = await import("./session.server");
    const expected = process.env.SITE_PASSWORD;
    if (!expected) throw new Error("SITE_PASSWORD não configurado");
    if (!passwordMatches(data.password, expected)) return { ok: false as const };
    const session = await getGateSession();
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const lockSite = createServerFn({ method: "POST" }).handler(async () => {
  const { getGateSession } = await import("./session.server");
  const session = await getGateSession();
  await session.clear();
  return { ok: true as const };
});

export const getSessionState = createServerFn({ method: "GET" }).handler(async () => {
  const { isUnlocked } = await import("./session.server");
  return { unlocked: await isUnlocked() };
});

export const getVendas = createServerFn({ method: "GET" })
  .inputValidator((d: { from: string; to: string }) => periodoSchema.parse(d))
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./session.server");
    await requireUnlocked();
    const { fetchVendas } = await import("./queries.server");
    return fetchVendas(data);
  });

export const getEstoque = createServerFn({ method: "GET" }).handler(async () => {
  const { requireUnlocked } = await import("./session.server");
  await requireUnlocked();
  const { fetchEstoque } = await import("./queries.server");
  return fetchEstoque();
});

export const sincronizarEstoque = createServerFn({ method: "POST" }).handler(async () => {
  const { requireUnlocked } = await import("./session.server");
  await requireUnlocked();
  const { runSyncEstoque } = await import("./queries.server");
  return { resultado: JSON.stringify(await runSyncEstoque()) };
});

export const getCampanhas = createServerFn({ method: "GET" })
  .inputValidator((d: { from: string; to: string }) => periodoSchema.parse(d))
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./session.server");
    await requireUnlocked();
    const { fetchCampanhas } = await import("./queries.server");
    return fetchCampanhas(data);
  });

export const getCupons = createServerFn({ method: "GET" }).handler(async () => {
  const { requireUnlocked } = await import("./session.server");
  await requireUnlocked();
  const { fetchCupons } = await import("./queries.server");
  return fetchCupons();
});

export const salvarCupom = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        discount_code: z.string().min(1).max(80),
        influencer: z.string().min(1).max(120),
        categoria: z.string().max(80).nullable().optional(),
        excluido_atribuicao: z.boolean().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./session.server");
    await requireUnlocked();
    const { upsertCupom } = await import("./queries.server");
    return upsertCupom(data);
  });

export const removerCupom = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ discount_code: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./session.server");
    await requireUnlocked();
    const { deleteCupom } = await import("./queries.server");
    return deleteCupom(data.discount_code);
  });

export const getMetas = createServerFn({ method: "GET" }).handler(async () => {
  const { requireUnlocked } = await import("./session.server");
  await requireUnlocked();
  const { fetchMetas } = await import("./queries.server");
  return fetchMetas();
});

export const salvarMeta = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid().nullable().optional(),
        slot: z.number().int().min(1).max(3),
        nome: z.string().min(1).max(120),
        setor: z.string().max(80).nullable().optional(),
        valor_alvo: z.number().min(0),
        pedidos_alvo: z.number().int().min(0),
        periodo_inicio: z.string(),
        periodo_fim: z.string(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./session.server");
    await requireUnlocked();
    const { upsertMeta } = await import("./queries.server");
    return upsertMeta(data);
  });

export const ativarMeta = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./session.server");
    await requireUnlocked();
    const { setMetaAtiva } = await import("./queries.server");
    return setMetaAtiva(data.id);
  });

export const arquivarMetaFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./session.server");
    await requireUnlocked();
    const { arquivarMeta } = await import("./queries.server");
    return arquivarMeta(data.id);
  });

export const salvarPesoDia = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        meta_id: z.string().uuid(),
        dia: z.string(),
        peso: z.number().min(0).max(20),
        tipo_dia: z.string().max(40).default("normal"),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./session.server");
    await requireUnlocked();
    const { setPesoDia } = await import("./queries.server");
    return setPesoDia(data);
  });