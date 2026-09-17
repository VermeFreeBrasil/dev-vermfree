// Reconstrói o carrossel da home com o CSS e os DOIS scripts reais da seção.
// Gera duas páginas: home.html (compravel) e home-fora.html (fora da home,
// para provar que o guard template.name == 'index' segura).
const fs = require('fs');
const path = require('path');

const SECAO = '/home/user/dev-vermfree/shopify-theme/sections/vf-ugc-carrossel.liquid';
const VIEWER = '/home/user/dev-vermfree/shopify-theme/snippets/vf-stories-viewer.liquid';
const SID = 'ugc_teste';

const semComentario = (t) => t.replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '');

const secao = fs.readFileSync(SECAO, 'utf8');
const css = secao.match(/\{% stylesheet %\}([\s\S]*?)\{% endstylesheet %\}/)[1];
const scripts = [...secao.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
if (scripts.length !== 2) throw new Error('esperava 2 scripts, achei ' + scripts.length);

const viewer = semComentario(fs.readFileSync(VIEWER, 'utf8'))
  .replace(/\{\{\s*routes\.cart_url\s*\}\}/g, '/cart');

const produtoA = {
  title: 'Protocolo de Desparasitação Natural | VermeFree Adulto',
  url: '/products/protocolo-desparasitacao-adulto-vermefree',
  image: '/media/thumb.png', price: 'R$ 347,00', variants: 1, vid: '48772143415515', available: true
};
const produtoB = {
  title: 'Antiparasitário Infantil Natural | VermeFree Kids 2 a 4 anos',
  url: '/products/antiparasitario-infantil-natural-vermefree-kids-2-a-4-anos',
  image: '/media/thumb.png', price: 'R$ 270,00', variants: 1, vid: '48772145250523', available: true
};

// 3 fotos e 3 vídeos intercalados; o terceiro vídeo sem produto.
const CARDS = [
  { tipo: 'foto' },
  { tipo: 'video', clipe: 'clip1', legenda: 'Julia', produto: produtoA },
  { tipo: 'foto' },
  { tipo: 'video', clipe: 'clip2', legenda: 'Ítalo', produto: produtoB },
  { tipo: 'foto' },
  { tipo: 'video', clipe: 'clip3', legenda: 'Sem produto', produto: null },
];

function pagina(compravel, arquivo) {
  let iv = 0;
  const slides = CARDS.map((c) => {
    if (c.tipo === 'foto') {
      return `<div class="vf-ugc__slide"><div class="vf-ugc__placeholder">foto</div></div>`;
    }
    const tap = compravel
      ? `<button type="button" class="vf-ugc__tap" data-vfu-open="${iv}" aria-label="${c.legenda}"></button>`
      : '';
    const html = `<div class="vf-ugc__slide vf-ugc__slide--video">
        <video class="vf-ugc__vid" data-vfu-video muted loop playsinline preload="none" tabindex="-1" aria-hidden="true">
          <source src="/media/${c.clipe}.webm" type="video/webm">
        </video>
        <span class="vf-ugc__play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>
        ${tap}
        <span class="vf-ugc__caption">${c.legenda}</span>
      </div>`;
    iv++;
    return html;
  }).join('\n');

  const itens = CARDS.filter((c) => c.tipo === 'video').map((c) => ({
    sources: [{ src: '/media/' + c.clipe + '.webm', type: 'video/webm' }],
    eyebrow: c.produto ? 'MAIS VENDIDO' : '', offer: '', badge: '',
    cta: 'Adicionar ao carrinho', mode: 'home', product: c.produto
  }));

  const payload = compravel
    ? `<script type="application/json" data-vfu-data="${SID}">${JSON.stringify(itens)}</script>`
    : '';

  const meus = scripts.map((s) =>
    s.replace(/\{\{\s*section\.id\s*\}\}/g, SID)
     .replace(/\{\{\s*compravel \| json\s*\}\}/g, String(compravel))
  );
  meus.forEach((s) => { if (/\{[{%]/.test(s)) throw new Error('sobrou Liquid num script'); });

  const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>Harness — carrossel da home</title>
<style>
  :root { --vf-green: #5EBC43; --vf-green-dark: #1B5E20; --vf-bg: #FAF7F0; --vf-text: #1A1A1A; }
  body { margin: 0; font-family: sans-serif; }
  .antes { height: 60px; }
  .depois { height: 2200px; }
${css}
</style>
</head><body>
<div class="antes">topo</div>
<header><span class="vf-header__cart-count" data-vf-cart-count hidden>0</span></header>

<section class="vf-ugc" data-vf-ugc data-vf-ugc-id="${SID}">
  <div class="vf-container"><header class="vf-ugc__head"><h2 class="vf-ugc__title">O protocolo nº 1</h2></header></div>
  <div class="vf-ugc__wrap">
    <button type="button" class="vf-ugc__arrow vf-ugc__arrow--prev" data-vf-ugc-prev aria-label="Anterior">‹</button>
    <div class="vf-ugc__track" data-vf-ugc-track>
${slides}
    </div>
    <button type="button" class="vf-ugc__arrow vf-ugc__arrow--next" data-vf-ugc-next aria-label="Próximo">›</button>
  </div>
</section>

${compravel ? viewer : ''}
${payload}

<div class="depois">conteúdo abaixo</div>
<script>${meus[0]}</script>
<script>${meus[1]}</script>
</body></html>
`;
  fs.writeFileSync(path.join(__dirname, arquivo), html);
}

pagina(true, 'home.html');
pagina(false, 'home-fora.html');
console.log('home.html e home-fora.html gerados com o CSS e os scripts reais da seção');
