import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Kpi, PeriodoTabs, Shell, brl, numero } from "@/components/dash/Shell";
import { getCampanhas } from "@/lib/app.functions";
import { diaCurto, periodoDeDias } from "@/lib/periodo";

type Campanha = {
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
  roasMeta: number;
  roasReal: number;
  vendasReais: number;
};
type Pos = {
  platform_position: string;
  spend: number;
  impressions: number;
  clicks: number;
  purchases: number;
};

export const Route = createFileRoute("/campanhas")({
  validateSearch: (s: Record<string, unknown>) => ({ dias: Number(s.dias ?? 30) || 30 }),
  loaderDeps: ({ search }) => ({ dias: search.dias }),
  loader: ({ deps }) => getCampanhas({ data: periodoDeDias(deps.dias) }),
  head: () => ({
    meta: [
      { title: "Campanhas e ROAS — VermFree Analytics" },
      {
        name: "description",
        content: "ROAS Meta e ROAS Real lado a lado, por campanha e posicionamento no Meta Ads.",
      },
      { property: "og:title", content: "Campanhas e ROAS — VermFree Analytics" },
      { property: "og:description", content: "ROAS Meta x ROAS Real das campanhas VermFree." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Campanhas,
});

function Campanhas() {
  const dados = Route.useLoaderData();
  const campanhas = dados.campanhas as Campanha[];
  const posicionamentos = dados.posicionamentos as Pos[];
  const total = dados.total as {
    spend: number;
    impressions: number;
    clicks: number;
    purchases: number;
    purchase_value: number;
    vendasReais: number;
    roasMeta: number;
    roasReal: number;
  };
  const serie = (dados.serie as Array<{ dia: string; spend: number; purchase_value: number }>).map(
    (s) => ({ ...s, label: diaCurto(s.dia) }),
  );
  const { dias } = Route.useSearch();
  const navigate = useNavigate();

  return (
    <Shell
      titulo="Campanhas & ROAS"
      descricao="Compras no agregado contam SOMENTE omni_purchase. Breakdown por platform_position."
      acoes={
        <PeriodoTabs
          dias={dias}
          onChange={(d) => navigate({ to: "/campanhas", search: { dias: d } })}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Investimento" valor={brl(total.spend)} />
        <Kpi label="Compras (omni_purchase)" valor={numero(total.purchases)} />
        <Kpi
          label="ROAS Meta"
          valor={total.roasMeta.toFixed(2)}
          hint={`${brl(total.purchase_value)} em action_values`}
        />
        <Kpi
          label="ROAS Real"
          valor={total.roasReal.toFixed(2)}
          hint={`${brl(total.vendasReais)} em vendas Shopify por UTM`}
          destaque
        />
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
        <h2 className="text-sm font-medium text-deep">Gasto x receita atribuída (Meta)</h2>
        <div className="mt-4 h-64">
          {serie.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={serie}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={70} />
                <Tooltip formatter={(v: number) => brl(Number(v))} />
                <Legend />
                <Line name="Gasto" type="monotone" dataKey="spend" stroke="var(--color-chart-4)" strokeWidth={2} dot={false} />
                <Line name="Receita Meta" type="monotone" dataKey="purchase_value" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Sem dados de campanha no período.
            </p>
          )}
        </div>
      </section>

      <section className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Campanha</th>
              <th className="px-4 py-3">Objetivo</th>
              <th className="px-4 py-3">Conversão contada</th>
              <th className="px-4 py-3 text-right">Gasto</th>
              <th className="px-4 py-3 text-right">Conversões</th>
              <th className="px-4 py-3 text-right">ROAS Meta</th>
              <th className="px-4 py-3 text-right">ROAS Real</th>
            </tr>
          </thead>
          <tbody>
            {campanhas.length ? (
              campanhas.map((c) => (
                <tr key={c.campaign_id} className="border-t border-border/70">
                  <td className="px-4 py-3 font-medium text-deep">{c.campaign_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.objective}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.conversion_type}</td>
                  <td className="px-4 py-3 text-right">{brl(c.spend)}</td>
                  <td className="px-4 py-3 text-right">{numero(c.conversions)}</td>
                  <td className="px-4 py-3 text-right">{c.roasMeta.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-medium text-primary">
                    {c.roasReal.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  Nenhuma campanha sincronizada. Configure o token do Meta e rode /api/public/cron/meta-sync.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
        <h2 className="text-sm font-medium text-deep">Posicionamento (platform_position)</h2>
        <div className="mt-4 h-64">
          {posicionamentos.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={posicionamentos}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="platform_position" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={70} />
                <Tooltip formatter={(v: number) => brl(Number(v))} />
                <Bar dataKey="spend" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Sem breakdown de posicionamento no período.
            </p>
          )}
        </div>
      </section>
    </Shell>
  );
}