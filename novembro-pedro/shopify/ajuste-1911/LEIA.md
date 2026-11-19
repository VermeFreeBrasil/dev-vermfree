# Ajustes de 19/11 (ok do Pedro: "pode tirar, trocar pro protocolo e corrigir o carrinho")

Achados do teste completo de 18/11 (temas 2, 3, 4 e ★).

| # | O quê | Onde | Arquivo | md5 no ar |
|---|---|---|---|---|
| 1 | Tirado o selo "Melhor preço do ano" e o "−34%" do kit de 5 (fora da ficha). Fica "5 unidades, pague 4 · 18% OFF + o 5º grátis" | Tema 3 · Verme Friday (169018949851) | snippets/vf-1111-kits.liquid (base: ajuste-protocolo-1711, 2dc3f5fe) | 8269cc0f |
| 2 | Legendas dos vídeos de clientes: "Jessika abre o protocolo Adulto", "Juliana abre o protocolo", "Chegou em casa: Dr. Diogo abre o protocolo" | Metaobjetos "Depoimento" (valem para TODOS os temas, inclusive o que está no ar) | — | — |
| 3 | Aviso do carrinho da Verme Week passa a contar todos os itens (antes excluía Óleo e Kit Família; a Shopify conta todos no mínimo de quantidade) | Tema 2 · Verme Week (168791179483) | snippets/vf-kits-desconto-aviso.liquid (base c90f991f) | b8a0990d |

- Free Monday não precisou: o carrinho dele (vf-1111-cart) já usa cart.item_count.
- Free Monday mantém o selo "Maior desconto do dia" no kit de 5 (15% é o maior desconto daquele dia; não mexido).
- Subida: staged upload → fileCreate → themeFilesUpsert por URL; md5 conferido.
