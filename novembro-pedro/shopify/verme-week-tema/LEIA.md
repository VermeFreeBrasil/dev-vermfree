# Tema Verme Week (20–26/11) · montado em 09/11

Tema: "🟢 Verme Week (20–26/11) · EM EDIÇÃO" (gid://shopify/OnlineStoreTheme/168791179483), cópia do tema Verme November (168590672091). **Não publicado.**
Preview: https://vermefree.com.br/?preview_theme_id=168791179483&vf_vn=on&vf_trava=off

## O que mudou em relação ao Verme November (patch-vw.py, 9 arquivos)
- Escada 10/12/15% → **12/15/17%** (1, 3 e 5 unidades) na faixa, home, montador, PDP da campanha, bloco de compra padrão (1/3/5), cartões escondidos, JS da PDP, aviso do carrinho, pop-up do carrinho e menu do topo.
- Datas 12–19/11 → **20/11 00h a 26/11 23h59**; "dia X de 8" → "de 7"; bolinhas dos dias 20 a 26.
- Nome: Verme November → **Verme Week** ("a Verme Week").
- Fechamento: "o desconto de 15% só no ano que vem" → "Depois disso, os preços voltam ao normal." (a Verme Friday vem depois).
- Frete grátis ≥ R$ 299 e brinde kit adulto > R$ 1.000: iguais.
- templates/index.json (preço do banner e tiers do montador antigo) **não subiu**: o envio de JSON por URL falha sem aviso. Não aparece para o cliente: de 20 a 26/11 a home padrão fica escondida e entra a home da campanha.
- O parâmetro de preview continua `vf_vn=on` e os arquivos mantêm os nomes vf-verme-november*.

## Conferido no preview (simulando as datas)
- 19/11 23h30 desligada · 20/11 00h30 ligada · 26/11 23h30 ligada · 27/11 00h30 desligada.
- 21/11: faixa "dia 2 de 7 · até 17% OFF", escada 12/15/17, dias 20–26 com o 21 marcado, FAQ e fechamento certos.
- Menu: Adulto R$ 305,36 · 12% OFF · até 17% levando 5.
- PDP Adulto: 1 = R$ 305,36 · 3 = R$ 884,85 · 5 = R$ 1.440,05 (347 × 0,88 / 0,85 / 0,83).
- Montador com 4 Adultos: 15% = R$ 1.179,80 e "kit adulto garantido".
- Prints: prints/vw-home.png, prints/vw-pdp.png.
