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
