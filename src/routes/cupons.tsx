import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import { Shell } from "@/components/dash/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getCupons, removerCupom, salvarCupom } from "@/lib/app.functions";

type Cupom = {
  discount_code: string;
  influencer: string;
  categoria: string | null;
  excluido_atribuicao: boolean;
};

export const Route = createFileRoute("/cupons")({
  loader: () => getCupons(),
  head: () => ({
    meta: [
      { title: "Cupons e influencers — VermFree Analytics" },
      {
        name: "description",
        content:
          "Mapeie cupons de desconto para influencers e marque cupons de campanha como excluídos da atribuição.",
      },
      { property: "og:title", content: "Cupons e influencers — VermFree Analytics" },
      { property: "og:description", content: "Atribuição de pedidos por cupom e UTM." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Cupons,
});

function Cupons() {
  const cupons = Route.useLoaderData() as Cupom[];
  const router = useRouter();
  const salvar = useServerFn(salvarCupom);
  const remover = useServerFn(removerCupom);
  const [salvando, setSalvando] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setSalvando(true);
    await salvar({
      data: {
        discount_code: String(fd.get("discount_code") ?? ""),
        influencer: String(fd.get("influencer") ?? ""),
        categoria: String(fd.get("categoria") ?? "") || null,
        excluido_atribuicao: fd.get("excluido") === "on",
      },
    });
    setSalvando(false);
    form.reset();
    router.invalidate();
  }

  return (
    <Shell
      titulo="Cupons & Influencers"
      descricao="A atribuição usa o primeiro cupom do pedido somado às UTMs do landing_site. Cupons de campanha podem ser excluídos."
    >
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form
          onSubmit={onSubmit}
          className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
        >
          <h2 className="text-sm font-medium text-deep">Novo mapeamento</h2>
          <div className="space-y-1.5">
            <Label htmlFor="discount_code">Cupom</Label>
            <Input id="discount_code" name="discount_code" placeholder="VERM10" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="influencer">Influencer</Label>
            <Input id="influencer" name="influencer" placeholder="@nome" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="categoria">Categoria / setor</Label>
            <Input id="categoria" name="categoria" placeholder="pets, humanos..." />
          </div>
          <label className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2.5 text-sm">
            <span>Cupom de campanha (excluir da atribuição)</span>
            <Switch name="excluido" />
          </label>
          <Button type="submit" className="w-full" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar cupom"}
          </Button>
        </form>

        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Cupom</th>
                <th className="px-4 py-3">Influencer</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Atribuição</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {cupons.length ? (
                cupons.map((c) => (
                  <tr key={c.discount_code} className="border-t border-border/70">
                    <td className="px-4 py-3 font-medium text-deep">{c.discount_code}</td>
                    <td className="px-4 py-3">{c.influencer}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.categoria ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs ${
                          c.excluido_atribuicao
                            ? "bg-muted text-muted-foreground"
                            : "bg-accent text-accent-foreground"
                        }`}
                      >
                        {c.excluido_atribuicao ? "excluído" : "atribui"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          await remover({ data: { discount_code: c.discount_code } });
                          router.invalidate();
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    Nenhum cupom mapeado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </Shell>
  );
}