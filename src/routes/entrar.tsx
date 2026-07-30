import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Leaf } from "lucide-react";
import { useState } from "react";

import { unlockSite } from "@/lib/app.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar — VermFree Analytics" },
      {
        name: "description",
        content: "Acesso restrito ao painel interno de analytics da VermFree.",
      },
      { property: "og:title", content: "Entrar — VermFree Analytics" },
      { property: "og:description", content: "Acesso restrito ao painel interno da VermFree." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Entrar,
});

function Entrar() {
  const router = useRouter();
  const unlock = useServerFn(unlockSite);
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCarregando(true);
    setErro(false);
    const password = new FormData(e.currentTarget).get("password") as string;
    const { ok } = await unlock({ data: { password } });
    setCarregando(false);
    if (ok) await router.navigate({ to: "/" });
    else setErro(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Leaf className="size-6" />
        </span>
        <h1 className="mt-5 text-xl font-semibold tracking-tight text-deep">VermFree Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Painel interno. Informe a senha de acesso para continuar.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          {erro ? <p className="text-sm text-destructive">Senha incorreta.</p> : null}
          <Button type="submit" className="w-full" disabled={carregando}>
            {carregando ? "Verificando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}