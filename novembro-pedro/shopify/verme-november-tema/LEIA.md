# Tema Verme November (12–19/11) · editado em 04/11

Tema: "🌑 Verme November (12–19/11) · EM EDIÇÃO" (gid://shopify/OnlineStoreTheme/168590672091), cópia do tema no ar de 04/11, que libera o Google na trava. **Não publicado.**
Preview: https://vermefree.com.br/?preview_theme_id=168590672091&vf_vn=on&vf_trava=off
(`vf_vn=on` mostra a faixa e o banner da campanha antes de 12/11; `vf_trava=off` passa pela trava da captação.)

## v3 (04/11, pedido do Pedro): escolha de kit mais clara na PDP
- A PDP saiu de vf-verme-november e foi para snippets/vf-verme-november-pdp.liquid, porque o arquivo passaria de 50 mil caracteres. O layout renderiza os dois.
- Escolha de kit em cartões (1 / 3 mais escolhido / 5 melhor preço), cada um com o preço cheio, o total com desconto e o preço por unidade. Embaixo, um ajuste de quantidade de 1 a 10.
- Barra de progresso de benefícios: 10% OFF → frete grátis (calculado pelo preço do produto) → 12% → 15%, com a mensagem "Mais X unidades e você libera ...".
- Linha do tempo da entrega: pedido hoje → despachado (2 dias úteis) → chega (de 3 a 8 dias úteis depois do envio). É a mesma regra do bloco de compra atual do site.
- Prints: prints/vn-v3-*.jpg

## v2 (04/11 à tarde): campanha completa, no nível do Eclipse
- snippets/vf-verme-november.liquid reescrito (46 mil caracteres; o limite é 50 mil). Partes 'barra', 'home' e 'pdp'; layout renderiza a pdp nas páginas de produto.
- Barra ao vivo: "dia X de 8" e contagem regressiva com segundos.
- Home inteira trocada no período:
  - hero com a escada 10/12/15 e os 8 dias (12 a 19);
  - seletor "Monte o pedido da casa" com degrau ativo, frete e economia ao vivo;
  - trilho, depoimentos, médicos, FAQ e fechamento.
- PDPs:
  - bloco de compra próprio (escada de 1 a 5, preço por unidade e total ao vivo, frete);
  - resto da página em verde-escuro;
  - barra fixa no celular.
- Conferido (simulando 13/11):
  - Adulto: 1 = R$ 312,30; 3 = R$ 916,08; 5 = R$ 1.474,75.
  - Home com 3 itens mistos: 12% (R$ 885,28); com 5: 15% (R$ 1.445,00).
- Prints: prints/vn-v2-*.jpg

## O que mudou na v1 (15 arquivos; cópias em arquivos/; as mudanças são aplicadas por patch.py)
- **Faixa e banner da campanha** (snippets/vf-verme-november.liquid, novo):
  - faixa escura no topo de todas as páginas: "VERME NOVEMBER · até 15% OFF + frete grátis acima de R$ 299 · termina em Xd";
  - banner na home com a lua, a escada 10% / 12% / 15%, o frete, o botão "Montar meu pedido" e a contagem até 19/11 23h59;
  - aparece sozinho de 12/11 00h a 19/11 23h59.
- **Escada nova em todo o site** (1 kit 10% · 3+ 12% · 5+ 15%) e **frete grátis acima de R$ 299**:
  - bloco de compra das páginas de produto (opções 1, 3 e 5 kits, com preço e parcelas);
  - cartões escondidos de quantidade e o JS de preço e da barra de kits;
  - faixa do topo e aviso do carrinho;
  - barra de frete e pop-up do carrinho;
  - montador da home (tiers "1:10,3:12,5:15", frete R$ 299);
  - selos e FAQ (R$ 399 → R$ 299);
  - preço do banner principal (3x de R$ 81,00 · 10% OFF);
  - página do óleo.
- **Cupom de 1ª compra (5OFF) escondido** da faixa, porque está pausado em novembro.

## Conferido no preview (simulando 13/11)
- Adulto: 1 kit 3x R$ 104,10 (−10%) · 3 kits 3x R$ 305,36 (−12%) · 5 kits 3x R$ 491,58 (−15%). Bate com 347 × 0,90 / 0,88 / 0,85.
- A faixa e o banner aparecem no computador e no celular.

## Falta
- Brinde do kit adulto acima de R$ 1.000 (tarefa de brindes, P10).
- Publicar em **12/11 às 00h**, logo depois do 11/11. O Eclipse fica no ar no dia 11.
