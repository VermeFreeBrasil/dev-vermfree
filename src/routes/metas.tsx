import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { Kpi, Shell, brl, numero } from "@/components/dash/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { arquivarMetaFn, ativarMeta, getMetas, salvarMeta, salvarPesoDia } from "@/lib/app.functions";

type Meta = {
  id: string;
  slot: number;
  nome: string;
  setor: string | null;
  valor_alvo: number;
  pedidos_alvo: number;
  periodo_inicio: string;
  periodo_fim: string;
  ativa: boolean;
  arquivada: boolean;
};
type Dia = { id: string; meta_id: string; dia: string; peso: number; tipo_dia: string };

export const Route = createFileRoute("/metas")({
  loader: () => getMetas(),
  head: () => ({
    meta: [
      { title: "Metas e calendário — VermFree Analytics" },
      {
        name: "description",
        content:
          "Três metas editáveis, seletor de meta ativa, histórico e metas diárias ponderadas por dia de campanha.",
      },
      { property: "og:title", content: "Metas e calendário — VermFree Analytics" },
      { property: "og:description", content: "Metas editáveis e ponderadas por dia da VermFree." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Metas,
});

function diasEntre(inicio: string, fim: string) {
  const out: string[] = [];
  const d = new Date(`${inicio}T00:00:00Z`);
  const end = new Date(`${fim}T00:00:00Z`);
  while (d <= end && out.length < 180) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

function Metas() {
  const dados = Route.useLoaderData();
  const metas = dados.metas as Meta[];
  const dias = dados.dias as Dia[];
  const progresso = dados.progresso as { faturamento: number; pedidos: number };
  const router = useRouter();

  const salvar = useServerFn(salvarMeta);
  const ativar = useServerFn(ativarMeta);
  const arquivar = useServerFn(arquivarMetaFn);
  const setPeso = useServerFn(salvarPesoDia);

  const ativas = metas.filter((m) => !m.arquivada);
  const historico = metas.filter((m) => m.arquivada);
  const ativa = ativas.find((m) => m.ativa) ?? null;
  const [slotEdicao, setSlotEdicao] = useState<number>(ativa?.slot ?? 1);
  const emEdicao = ativas.find((m) => m.slot === slotEdicao) ?? null;

  const pesos = ativa ? dias.filter((d) => d.meta_id === ativa.id) : [];
  const calendario = ativa ? diasEntre(ativa.periodo_inicio, ativa.periodo_fim) : [];
  const pesoDe = (dia: string) => pesos.find((p) => p.dia === dia)?.peso ?? 1;
  const somaPesos = calendario.reduce((s, d) => s + pesoDe(d), 0) || 1;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await salvar({
      data: {
        id: emEdicao?.id ?? null,
        slot: slotEdicao,
        nome: String(fd.get("nome") ?? ""),
        setor: String(fd.get("setor") ?? "") || null,
        valor_alvo: Number(fd.get("valor_alvo") ?? 0),
        pedidos_alvo: Number(fd.get("pedidos_alvo") ?? 0),
        periodo_inicio: String(fd.get("periodo_inicio") ?? ""),
        periodo_fim: String(fd.get("periodo_fim") ?? ""),
      },
    });
    router.invalidate();
  }

  const pct = ativa && ativa.valor_alvo ? (progresso.faturamento / ativa.valor_alvo) * 100 : 0;

  return (
    <Shell
      titulo="Metas & Calendário"
      descricao="Três metas configuráveis, com seletor da meta ativa, visão por setor e pesos diários para dias de campanha."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Meta ativa" valor={ativa ? ativa.nome : "—"} hint={ativa?.setor ?? "agregado geral"} />
        <Kpi
          label="Progresso"
          valor={ativa ? `${pct.toFixed(1)}%` : "—"}
          hint={ativa ? `${brl(progresso.faturamento)} de ${brl(ativa.valor_alvo)}` : undefined}
          destaque
        />
        <Kpi
          label="Pedidos"
          valor={numero(progresso.pedidos)}
          hint={ativa ? `alvo ${numero(ativa.pedidos_alvo)}` : undefined}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <section className="h-fit rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="flex gap-1 rounded-full border border-border p-1">
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                onClick={() => setSlotEdicao(s)}
                className={`flex-1 rounded-full px-3 py-1.5 text-sm transition-colors ${
                  slotEdicao === s
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Meta {s}
              </button>
            ))}
          </div>

          <form key={emEdicao?.id ?? `novo-${slotEdicao}`} onSubmit={onSubmit} className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" defaultValue={emEdicao?.nome ?? ""} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="setor">Setor / categoria (opcional)</Label>
              <Input id="setor" name="setor" defaultValue={emEdicao?.setor ?? ""} placeholder="agregado geral" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="valor_alvo">Faturamento alvo</Label>
                <Input
                  id="valor_alvo"
                  name="valor_alvo"
                  type="number"
                  step="0.01"
                  defaultValue={emEdicao?.valor_alvo ?? 0}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pedidos_alvo">Pedidos alvo</Label>
                <Input
                  id="pedidos_alvo"
                  name="pedidos_alvo"
                  type="number"
                  defaultValue={emEdicao?.pedidos_alvo ?? 0}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="periodo_inicio">Início</Label>
                <Input
                  id="periodo_inicio"
                  name="periodo_inicio"
                  type="date"
                  defaultValue={emEdicao?.periodo_inicio ?? ""}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="periodo_fim">Fim</Label>
                <Input
                  id="periodo_fim"
                  name="periodo_fim"
                  type="date"
                  defaultValue={emEdicao?.periodo_fim ?? ""}
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Salvar Meta {slotEdicao}
              </Button>
              {emEdicao && !emEdicao.ativa ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={async () => {
                    await ativar({ data: { id: emEdicao.id } });
                    router.invalidate();
                  }}
                >
                  Ativar
                </Button>
              ) : null}
              {emEdicao ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={async () => {
                    await arquivar({ data: { id: emEdicao.id } });
                    router.invalidate();
                  }}
                >
                  Arquivar
                </Button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-sm font-medium text-deep">Calendário ponderado da meta ativa</h2>
          <p className="text-xs text-muted-foreground">
            Peso maior = dia de campanha/lançamento. A meta do dia é proporcional ao peso.
          </p>
          {ativa ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {calendario.map((dia) => {
                const peso = pesoDe(dia);
                const metaDia = (ativa.valor_alvo * peso) / somaPesos;
                return (
                  <div
                    key={dia}
                    className="flex items-center justify-between gap-2 rounded-xl bg-secondary/50 px-3 py-2"
                  >
                    <div className="text-sm">
                      <p className="font-medium text-deep">{dia.split("-").reverse().join("/")}</p>
                      <p className="text-xs text-muted-foreground">{brl(metaDia)}</p>
                    </div>
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      className="h-8 w-20"
                      defaultValue={peso}
                      onBlur={async (e) => {
                        const novo = Number(e.currentTarget.value);
                        if (novo === peso) return;
                        await setPeso({
                          data: {
                            meta_id: ativa.id,
                            dia,
                            peso: novo,
                            tipo_dia: novo > 1 ? "campanha" : "normal",
                          },
                        });
                        router.invalidate();
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">
              Nenhuma meta ativa. Crie uma meta e clique em “Ativar”.
            </p>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
        <h2 className="text-sm font-medium text-deep">Histórico de metas</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {historico.length ? (
            historico.map((m) => (
              <li key={m.id} className="flex flex-wrap justify-between gap-2 text-muted-foreground">
                <span>
                  <span className="font-medium text-deep">{m.nome}</span> · Meta {m.slot} ·{" "}
                  {m.setor ?? "agregado geral"}
                </span>
                <span>
                  {brl(m.valor_alvo)} · {m.periodo_inicio} → {m.periodo_fim}
                </span>
              </li>
            ))
          ) : (
            <li className="text-muted-foreground">Nenhuma meta arquivada ainda.</li>
          )}
        </ul>
      </section>
    </Shell>
  );
}