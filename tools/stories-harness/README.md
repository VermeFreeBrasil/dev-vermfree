# Harness do visualizador de stories

Dirige `shopify-theme/snippets/vf-stories-viewer.liquid` num Chromium real,
fora da Shopify. A página de teste é **gerada a partir do arquivo .liquid de
verdade** (`build-page.js` renderiza as poucas saídas Liquid que ele usa), então
o teste nunca valida uma cópia que envelheceu.

## Rodar

```bash
npm install
npm run clips   # gera os vídeos de teste (só na primeira vez)
npm test        # 51 checagens
npm run shot    # capturas em celular e desktop
```

Se o Chromium do ambiente não estiver em `/opt/pw-browsers/chromium`, ajuste o
`executablePath` nos scripts.

## Sobre os vídeos de teste

A CDN da Shopify não é alcançável do ambiente de desenvolvimento, então os
clipes são gerados localmente. O ffmpeg que vem com o Playwright é enxuto — só
decodifica MJPEG e só codifica VP8/WebM — então os quadros JPEG são desenhados
pelo próprio Chromium e remuxados. Os clipes começam quase pretos de propósito,
imitando o fade in dos vídeos reais.

Um blob de `MediaRecorder` seria mais simples, mas vem com `duration: Infinity`,
e aí a barra de progresso não teria como ser testada.

## O que é coberto

Abrir e fechar (X, Esc, arrastar para baixo, clique no fundo), barras de
progresso, avançar/voltar, avanço automático, passar do último, som, trava de
rolagem, cartão de compra em todas as combinações (com e sem produto, esgotado,
multivariante na PDP e na home), o payload do `/cart/add.js`, os dois contadores
de carrinho do tema, o botão não coberto pelas zonas de toque, story sem fonte
sendo pulado, e o cenário de `play()` recusado pelo navegador — provando que
todos os stories tocam, não só o primeiro.

## Teste de responsividade da PDP

`npm run test:pdp` reconstrói a coluna de compra com o **CSS real da seção**
(mesmo grid, mesmas classes, mesma folha de estilo) e mede overflow horizontal
em 320, 360, 390, 414, 768 e 1280px.

Ele existe porque a primeira versão da régua quebrava o mobile: a coluna é uma
faixa de grid `1fr`, cujo tamanho mínimo é o conteúdo. Seis círculos de 76px
fixos somam 530px, então num aparelho de 390px a página inteira virava 554px —
o cabeçalho ficava mais estreito que o conteúdo e a régua nem rolava, porque a
coluna havia crescido para caber nela.

A régua se protege com `width: 0; min-width: 100%`: zera o que ela reivindica de
largura no cálculo intrínseco e volta ao tamanho da coluna depois que ela já foi
resolvida. `max-width: 100%` sozinho não resolve — porcentagem é ignorada no
cálculo de tamanho intrínseco.

## Carrossel da home

`npm run test:home` reconstrói o carrossel com o CSS e os **dois scripts reais**
da seção e gera duas páginas: uma como home (compráveis) e outra fora da home.
Cobre overflow em seis larguras, tocar só o card visível, o autoplay do
carrossel não arrancar um vídeo que está tocando, cada vídeo abrir com o **seu
próprio produto**, vídeo sem produto abrir sem cartão, o payload do
`/cart/add.js` e o guard de template — num template que não é `index` nem
`product` nenhum card é clicável e o visualizador nem é renderizado.

## Carrossel na PDP (régua + carrossel na mesma página)

`npm run test:pdp-carrossel` monta uma PDP com as **duas** superfícies de
stories: a régua de círculos dentro do `main` e o carrossel UGC logo abaixo.
Cada uma renderiza `vf-stories-viewer`, então a página nasce com dois
`[data-vfst-root]`.

É o teste que existe por causa disso: confere que sobra **um só** visualizador
no DOM, que o root que sobrou é o que a API usa, e que as duas superfícies
conseguem abrir na mesma página — a régua trazendo o produto da página e o
carrossel trazendo o produto daquele vídeo (venda cruzada). Fecha checando o
`/cart/add.js` e o contador do header, mais overflow em seis larguras com as
duas seções empilhadas.

## Seletor de kits

`npm run test:kits` reconstrói o seletor com o CSS e o **JS reais da seção**
(as duas condicionais Liquid são renderizadas para o handle do Adulto) e dirige
a escolha: ordem na tela, qual card vem ativo, a quantidade que vai no form e
na barra fixa, a legenda, a barra de vantagem e as mensagens.

Existe porque a ordem dos kits é conversão pura. A lógica em JS é agnóstica à
ordem — lê o card com `.is-active` e o `data-qty`, nunca a posição —, então
inverter a escada é mexer só nos dados do Liquid. Este teste é o que prova que
continua sendo verdade.
