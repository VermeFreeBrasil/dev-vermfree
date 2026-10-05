# Tema Shopify — edições versionadas

Arquivos editados no tema **"Cópia de VermeFree — TEMA OFICIAL (judge.me)"**
(`gid://shopify/OnlineStoreTheme/167377207515`). Não fazem parte do app Lovable.

- `original/` — cópia exata dos arquivos antes da edição (checksum conferido), pra restaurar se precisar.
- `theme/` — versão editada, enviada ao Shopify via `themeFilesUpsert`.

## Avaliações Judge.me (out/2026)
- `snippets/vf-stars.liquid` (novo): estrelas com preenchimento proporcional à nota.
- `sections/vf-pdp-main.liquid`: estrelas do topo e da barra sticky com nota real do Judge.me
  (opção "manual" no editor) e link com rolagem suave até `#avaliacoes`.
- `sections/vf-judgeme-reviews.liquid`: topo com nota, distribuição 5★→1★ e botão de avaliar;
  lista do widget oficial do Judge.me abaixo, com visual da marca.
- `templates/product*.json`: bloco do app Judge.me trocado pela seção `vf-judgeme-reviews`, mesma posição.
