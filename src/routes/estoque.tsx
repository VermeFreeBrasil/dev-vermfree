import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

import { Kpi, Shell, numero } from "@/components/dash/Shell";
import { Button } from "@/components/ui/button";
import { getEstoque, sincronizarEstoque } from "@/lib/app.functions";

type Produto = {
  sku: string;
  nome: string | null;
  estoque_atual: number;
  estoque_base: number;
  inventory_item_id: string | null;
  atualizado_em: string;
  base_atualizado_em: string | null;
};
type Log = { id: string; status: string; mensagem: string | null; registros: number; executado_em: string };

export const Route = createFileRoute("/estoque")({
  loader: () => getEstoque(),
  head: () => ({
    meta: [
      { title: "Estoque — VermFree Analytics" },
      {
        name: "description",
        content: "Estoque ao vivo por SKU sincronizado com a Shopify a cada 15 minutos.",
      },
      { property: "og:title", content: "Estoque — VermFree Analytics" },
      { property: "og:description", content: "Estoque ao vivo por SKU da VermFree." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Estoque,
});

function quando(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR");
}

function Estoque() {
  const dados = Route.useLoaderData();
  const produtos = dados.produtos as Produto[];
  const log = dados.log as Log[];
  const router = useRouter();
  const sync = useServerFn(sincronizarEstoque);
  const [rodando, setRodando] = useState(false);

  const total = produtos.reduce((s, p) => s + p.estoque_atual, 0);
  const zerados = produtos.filter((p) => p.estoque_atual <= 0).length;
  const ultima = log[0]?.executado_em ?? produtos[0]?.atualizado_em ?? null;

  return (
    <Shell
      titulo="Estoque"
      descricao="Sincronização automática com a Shopify Admin API (GraphQL) a cada 15 minutos."
      acoes={
        <Button
          variant="secondary"
          disabled={rodando}
          onClick={async () => {
            setRodando(true);
            await sync({});
            setRodando(false);
            router.invalidate();
          }}
        >
          <RefreshCw className={`size-4 ${rodando ? "animate-spin" : ""}`} />
          Sincronizar agora
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="SKUs monitorados" valor={numero(produtos.length)} />
        <Kpi label="Unidades em estoque" valor={numero(total)} destaque />
        <Kpi label="Última sincronização" valor={quando(ultima)} hint={`${zerados} SKUs zerados`} />
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3 text-right">Estoque atual</th>
              <th className="px-4 py-3 text-right">Estoque base</th>
              <th className="px-4 py-3">Atualizado em</th>
            </tr>
          </thead>
          <tbody>
            {produtos.length ? (
              produtos.map((p) => (
                <tr key={p.sku} className="border-t border-border/70">
                  <td className="px-4 py-3 font-medium text-deep">{p.sku}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.nome ?? "—"}</td>
                  <td
                    className={`px-4 py-3 text-right font-medium ${
                      p.estoque_atual <= 0 ? "text-destructive" : "text-foreground"
                    }`}
                  >
                    {numero(p.estoque_atual)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {numero(p.estoque_base)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{quando(p.atualizado_em)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  Nenhum SKU sincronizado ainda. Configure as credenciais da Shopify e rode a
                  sincronização.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
        <h2 className="text-sm font-medium text-deep">Histórico de sincronizações</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {log.length ? (
            log.map((l) => (
              <li key={l.id} className="flex flex-wrap justify-between gap-2 text-muted-foreground">
                <span>
                  <span
                    className={
                      l.status === "ok" ? "font-medium text-primary" : "font-medium text-destructive"
                    }
                  >
                    {l.status}
                  </span>{" "}
                  · {l.mensagem ?? "—"}
                </span>
                <span>
                  {l.registros} SKUs · {quando(l.executado_em)}
                </span>
              </li>
            ))
          ) : (
            <li className="text-muted-foreground">Sem sincronizações registradas.</li>
          )}
        </ul>
      </section>
    </Shell>
  );
}