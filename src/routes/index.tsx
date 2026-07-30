import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Kpi, PeriodoTabs, Shell, brl, numero } from "@/components/dash/Shell";
import { getVendas } from "@/lib/app.functions";
import { diaCurto, periodoDeDias } from "@/lib/periodo";

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>) => ({ dias: Number(s.dias ?? 30) || 30 }),
  loaderDeps: ({ search }) => ({ dias: search.dias }),
  loader: ({ deps }) => getVendas({ data: periodoDeDias(deps.dias) }),
  head: () => ({
    meta: [
      { title: "Vendas — VermFree Analytics" },
      {
        name: "description",
        content:
          "Faturamento, pedidos pagos, ticket médio e canais de tráfego da VermFree em um só painel.",
      },
      { property: "og:title", content: "Vendas — VermFree Analytics" },
      {
        property: "og:description",
        content: "Faturamento, pedidos pagos e ticket médio da VermFree.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Vendas,
});

function Vendas() {
  const dados = Route.useLoaderData();
  const { dias } = Route.useSearch();
  const navigate = useNavigate();

  const serie = (dados.serie as Array<{ dia: string; valor: number; pedidos: number }>).map((s) => ({
    ...s,
    label: diaCurto(s.dia),
  }));

  return (
    <Shell
      titulo="Vendas"
      descricao="Somente pedidos pagos entram no faturamento — cancelados e reembolsos aparecem à parte."
      acoes={
        <PeriodoTabs dias={dias} onChange={(d) => navigate({ to: "/", search: { dias: d } })} />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Faturamento (pago)" valor={brl(dados.faturamento)} destaque />
        <Kpi label="Pedidos pagos" valor={numero(dados.pedidos)} hint={`${dados.totalRegistros} registros no período`} />
        <Kpi label="Ticket médio" valor={brl(dados.ticketMedio)} />
        <Kpi
          label="Reembolsos"
          valor={brl(dados.reembolsos)}
          hint={`${dados.cancelados} pedidos cancelados`}
        />
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
        <h2 className="text-sm font-medium text-deep">Faturamento por dia</h2>
        <div className="mt-4 h-72">
          {serie.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={serie}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={70} />
                <Tooltip formatter={(v: number) => brl(Number(v))} />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="var(--color-primary)"
                  fill="url(#grad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <Vazio texto="Nenhum pedido pago no período." />
          )}
        </div>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-sm font-medium text-deep">Canais de tráfego</h2>
          <p className="text-xs text-muted-foreground">Mutuamente exclusivos — somam 100%.</p>
          <ul className="mt-4 space-y-3">
            {dados.canais.length ? (
              (dados.canais as Array<{ canal: string; valor: number; pct: number }>).map((c) => (
                <li key={c.canal}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize text-foreground">{c.canal}</span>
                    <span className="text-muted-foreground">
                      {brl(c.valor)} · {c.pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${Math.min(100, c.pct)}%` }}
                    />
                  </div>
                </li>
              ))
            ) : (
              <Vazio texto="Sem dados de canal." />
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-sm font-medium text-deep">Cupons (camada transversal)</h2>
          <p className="text-xs text-muted-foreground">
            Não entram no somatório dos canais — atravessam todos eles.
          </p>
          <div className="mt-4 space-y-2">
            {dados.camadaCupons.length ? (
              (
                dados.camadaCupons as Array<{
                  code: string;
                  influencer: string | null;
                  excluido: boolean;
                  valor: number;
                  pedidos: number;
                }>
              ).map((c) => (
                <div
                  key={c.code}
                  className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2 text-sm"
                >
                  <div>
                    <span className="font-medium text-deep">{c.code}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {c.excluido ? "campanha (excluído)" : (c.influencer ?? "sem influencer")}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {brl(c.valor)} · {c.pedidos} ped.
                  </span>
                </div>
              ))
            ) : (
              <Vazio texto="Nenhum cupom usado no período." />
            )}
          </div>
        </section>
      </div>
    </Shell>
  );
}

function Vazio({ texto }: { texto: string }) {
  return (
    <p className="flex h-full items-center justify-center py-6 text-sm text-muted-foreground">
      {texto}
    </p>
  );
}
