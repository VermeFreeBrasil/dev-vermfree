// PDP com as DUAS superfícies de stories na mesma página: a régua de
// círculos (dentro do main) e o carrossel UGC logo abaixo. Cada uma renderiza
// o snippet do visualizador, então a página tem dois [data-vfst-root]. O que
// esta página prova é que só um sobrevive e que as duas conseguem abrir.
const fs = require('fs');
const path = require('path');

const RAIL = '/home/user/dev-vermfree/shopify-theme/snippets/vf-stories-rail.liquid';
const VIEWER = '/home/user/dev-vermfree/shopify-theme/snippets/vf-stories-viewer.liquid';
const SECAO = '/home/user/dev-vermfree/shopify-theme/sections/vf-ugc-carrossel.liquid';
const UID = 'railpdp';
const SID = 'ugcpdp';

const semComentario = (t) => t.replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '');

const rail = semComentario(fs.readFileSync(RAIL, 'utf8')).replace(/\{\{\s*uid\s*\}\}/g, UID);
const estiloRail = rail.match(/<style>([\s\S]*?)<\/style>/)[1];
const scriptRail = rail.match(/<script>([\s\S]*?)<\/script>/)[1];

const secao = fs.readFileSync(SECAO, 'utf8');
const cssUgc = secao.match(/\{% stylesheet %\}([\s\S]*?)\{% endstylesheet %\}/)[1];
const scriptsUgc = [...secao.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
if (scriptsUgc.length !== 2) throw new Error('esperava 2 scripts na seção, achei ' + scriptsUgc.length);

const viewer = semComentario(fs.readFileSync(VIEWER, 'utf8'))
  .replace(/\{\{\s*routes\.cart_url\s*\}\}/g, '/cart');

const adulto = {
  title: 'Protocolo de Desparasitação Natural | VermeFree Adulto',
  url: '/products/protocolo-desparasitacao-adulto-vermefree',
  image: '/media/thumb.png', price: 'R$ 347,00', variants: 1, vid: '48772143415515', available: true
};
const kids = {
  title: 'Antiparasitário Infantil Natural | VermeFree Kids 2 a 4 anos',
  url: '/products/antiparasitario-infantil-natural-vermefree-kids-2-a-4-anos',
  image: '/media/thumb.png', price: 'R$ 270,00', variants: 1, vid: '48772145250523', available: true
};

// Régua: 3 círculos, sempre o produto da página, modo pdp.
const clipesRail = ['clip1', 'clip2', 'clip3'];
const circulos = clipesRail.map((c, i) => `
  <button type="button" class="vfsr__item" data-vfsr-open="${i}">
    <span class="vfsr__ring"><span class="vfsr__avatar">
      <video class="vfsr__thumb" data-vfsr-thumb muted loop playsinline preload="none" tabindex="-1" aria-hidden="true">
        <source src="/media/${c}.webm" type="video/webm">
      </video>
    </span></span>
    <span class="vfsr__label">Destaque ${i + 1}</span>
  </button>`).join('');
const dadosRail = clipesRail.map((c) => ({
  sources: [{ src: '/media/' + c + '.webm', type: 'video/webm' }],
  eyebrow: '', offer: '', badge: '', cta: 'Adicionar ao carrinho', mode: 'pdp', product: adulto
}));

// Carrossel: o primeiro card é o produto da própria página (modo pdp, como o
// Liquid decide), o segundo é outro produto (modo home = venda cruzada).
const CARDS = [
  { clipe: 'clip2', legenda: 'Depoimento', produto: adulto, modo: 'pdp' },
  { clipe: 'clip3', legenda: '3 sinais', produto: kids, modo: 'home' },
  { clipe: 'clip1', legenda: 'Sem produto', produto: null, modo: 'home' },
];
const slides = CARDS.map((c, i) => `<div class="vf-ugc__slide vf-ugc__slide--video">
    <video class="vf-ugc__vid" data-vfu-video muted loop playsinline preload="none" tabindex="-1" aria-hidden="true">
      <source src="/media/${c.clipe}.webm" type="video/webm">
    </video>
    <span class="vf-ugc__play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>
    <button type="button" class="vf-ugc__tap" data-vfu-open="${i}" aria-label="${c.legenda}"></button>
    <span class="vf-ugc__caption">${c.legenda}</span>
  </div>`).join('');
const dadosUgc = CARDS.map((c) => ({
  sources: [{ src: '/media/' + c.clipe + '.webm', type: 'video/webm' }],
  eyebrow: '', offer: '', badge: '', cta: 'Adicionar ao carrinho',
  mode: c.modo, product: c.produto
}));

const meusUgc = scriptsUgc.map((s) =>
  s.replace(/\{\{\s*section\.id\s*\}\}/g, SID)
   .replace(/\{\{\s*compravel \| json\s*\}\}/g, 'true')
);
meusUgc.forEach((s) => { if (/\{[{%]/.test(s)) throw new Error('sobrou Liquid num script da seção'); });
if (/\{[{%]/.test(scriptRail)) throw new Error('sobrou Liquid no script da régua');
if (/\{[{%]/.test(viewer)) throw new Error('sobrou Liquid no visualizador');

const page = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Harness — PDP com régua + carrossel</title>
<style>
  body { margin: 0; font-family: sans-serif; }
  .vf-pdp { padding: 24px 16px; }
  .espaco { height: 900px; }
  header .conta { position: fixed; top: 4px; right: 8px; }
  ${estiloRail}
  ${cssUgc}
</style>
</head><body>
<header><span class="conta" data-vf-cart-count>0</span></header>

<main class="vf-pdp">
  <h1>Protocolo Adulto</h1>

  <div class="vfsr" data-vfsr="${UID}">
    <h3 class="vfsr__heading">Tire suas dúvidas</h3>
    <div class="vfsr__row">${circulos}</div>
    <script type="application/json" data-vfsr-data>${JSON.stringify(dadosRail)}</script>
  </div>

  ${viewer}
  <script>${scriptRail}</script>
</main>

<section class="vf-ugc" data-vf-ugc data-vf-ugc-id="${SID}">
  <div class="vf-ugc__wrap">
    <button type="button" class="vf-ugc__arrow vf-ugc__arrow--prev" data-vf-ugc-prev aria-label="Anterior">&lt;</button>
    <div class="vf-ugc__track" data-vf-ugc-track>${slides}</div>
    <button type="button" class="vf-ugc__arrow vf-ugc__arrow--next" data-vf-ugc-next aria-label="Próximo">&gt;</button>
  </div>
</section>

${viewer}
<script type="application/json" data-vfu-data="${SID}">${JSON.stringify(dadosUgc)}</script>

<div class="espaco">conteúdo abaixo</div>

<script>${meusUgc[0]}</script>
<script>${meusUgc[1]}</script>
</body></html>
`;

const destino = path.join(__dirname, 'pdp-carrossel.html');
fs.writeFileSync(destino, page);
console.log('pdp-carrossel.html gerado (régua + carrossel, visualizador renderizado 2x)');
