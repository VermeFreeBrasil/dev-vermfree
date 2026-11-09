// Estáticos universais · 3º lote (25–32) · versão "produto + mão" (pedido do Pedro em 09/11: sem UGC, no máximo mão).
// 3 fotos reais de produto (kit no mármore, Kids, Óleo) em "cartão" + 5 fotos de mão segurando o produto, geradas a partir das fotos reais.
// Fundo preto, título branco com palavra em tarja vermelha, selo vermelho "o maior desconto da história". Sem data/porcentagem/campanha.
// Uso: node gerar-lote3-maos.cjs <pasta-das-fotos> <pasta-das-imagens(logo)> [saida]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const FOT = process.argv[2], ART = process.argv[3];
const OUT = process.argv[4] || path.join(__dirname, 'png-lote3-maos');
fs.mkdirSync(OUT, { recursive: true });
const f = n => 'file://' + path.join(FOT, 'full-' + n);
const img = n => 'file://' + path.join(ART, n);

const pecas = [
  { n: 25, slug: 'a-maior-black', m: 'card', foto: 'IMG_4384-scaled.jpg', pos: '50% 62%', h: 'A maior Black da história da <b>VermeFree.</b>', s: 'O kit completo pelo menor preço que a gente já fez.' },
  { n: 26, slug: 'segura-essa', m: 'hand', foto: 'h1.png', h: 'Segura<br>essa <b>Black.</b>', s: 'O maior desconto da história da VermeFree.' },
  { n: 27, slug: 'na-palma', m: 'hand', foto: 'h2.png', h: 'Na palma<br>da <b>mão.</b>', s: 'O maior desconto da história, só no site.' },
  { n: 28, slug: 'kids', m: 'hand', foto: 'h3.png', h: 'Pros pequenos<br><b>também.</b>', s: 'VermeFree Kids, a partir de 2 anos, no maior desconto da história.' },
  { n: 29, slug: 'casa-toda', m: 'hand', foto: 'h5.png', h: 'A casa toda,<br>junto <b>na Black.</b>', s: 'Adultos e crianças pelo menor preço da história.' },
  { n: 30, slug: 'menor-preco', m: 'card', foto: 'pdp-adulto-01-oregano-frontal_4ca010ec-4d8e-4631-a011-f41c81e3672a.jpg', pos: '50% 50%', h: 'O menor preço que a VermeFree já <b>fez.</b>', s: 'É Black. E é só no site.' },
  { n: 31, slug: 'cuide-de-dentro', m: 'hand', foto: 'h4.png', h: 'Cuide<br>de <b>dentro.</b>', s: 'Com o maior desconto da história da VermeFree.' },
  { n: 32, slug: 'corre-pro-site', m: 'card', foto: 'IMG_4386-scaled.jpg', pos: '50% 50%', h: 'Corre pro site. <b>É Black.</b>', s: 'O maior desconto da história da VermeFree chegou.' },
];

const css = (W, H, p) => {
  const T = H > 1500, R = '#e01e26', top = T ? 250 : 50;
  const card = p.m === 'card';
  return `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
body{font-family:Inter,Arial,sans-serif;color:#fff;position:relative;${card ? 'background:radial-gradient(ellipse 80% 55% at 50% 58%,#202020,#000)' : ''}}
.ph{position:absolute;${card
    ? `left:110px;top:${T ? 640 : 390}px;width:860px;height:${T ? 840 : 660}px;object-fit:cover;object-position:${p.pos};border-radius:24px;box-shadow:0 30px 60px #000;transform:rotate(-2deg);border:10px solid #fff`
    : `left:0;top:${T ? 270 : 0}px;width:1080px;height:1350px;object-fit:cover;-webkit-mask-image:linear-gradient(180deg,#000 82%,transparent);mask-image:linear-gradient(180deg,#000 82%,transparent)`}}
.tag{position:absolute;top:${top}px;left:56px;display:flex;align-items:center;gap:12px;font-weight:900;font-size:24px;letter-spacing:3px;text-transform:uppercase}
.tag i{width:12px;height:12px;border-radius:50%;background:${R};box-shadow:0 0 10px ${R}}
.tag img{height:32px;filter:brightness(0) invert(1)}
.tx{position:absolute;left:56px;right:${card ? 56 : 250}px;top:${top + 70}px;${card ? 'text-align:center' : ''}}
h1{font-size:${card ? (T ? 74 : 64) : (T ? 112 : 104)}px;font-weight:900;letter-spacing:-.045em;line-height:.98}
h1 b{background:${R};padding:0 .12em;border-radius:10px}
.s{margin-top:16px;font-size:${T ? 31 : 28}px;line-height:1.3;opacity:.9;${card ? 'margin-left:auto;margin-right:auto;' : ''}max-width:${card ? 880 : 620}px}
.cta{display:inline-block;margin-top:24px;background:#fff;color:#000;font-weight:900;font-size:${T ? 28 : 26}px;padding:16px 32px;border-radius:999px;text-transform:uppercase;letter-spacing:.5px}
.st{position:absolute;${card ? `right:70px;top:${T ? 590 : 340}px` : `right:56px;top:${top + 70}px`};width:${T ? 200 : 180}px;height:${T ? 200 : 180}px;border-radius:50%;background:${R};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;
  transform:rotate(-10deg);box-shadow:0 12px 30px #000c;border:4px solid #fff;text-transform:uppercase;font-weight:900;line-height:1.02;z-index:3}
.st small{font-size:${T ? 17 : 15}px;letter-spacing:1px}.st b{font-size:${T ? 30 : 27}px}
`;
};

const html = (p, W, H) => `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H, p)}</style></head><body>
<img class="ph" src="${f(p.foto)}">
<div class="tag"><i></i><img src="${img('logo-shopify-medium.png')}">Black</div>
<div class="tx"><h1>${p.h}</h1><p class="s">${p.s}</p><span class="cta">Garantir no site →</span></div>
<div class="st"><small>O maior</small><b>desconto</b><small>da história</small></div>
</body></html>`;

(async () => {
  const b = await chromium.launch();
  for (const [W, H, tag] of [[1080, 1350, '4x5'], [1080, 1920, '9x16']]) {
    const pg = await b.newPage({ viewport: { width: W, height: H } });
    for (const p of pecas) {
      const hf = path.join(FOT, `lm-${p.n}-${tag}.html`); fs.writeFileSync(hf, html(p, W, H));
      await pg.goto('file://' + hf, { waitUntil: 'load' }); await pg.waitForTimeout(150);
      const o = path.join(OUT, `vf-black-universal-${p.n}-${p.slug}-${tag}.png`);
      await pg.screenshot({ path: o }); console.log(o);
    }
    await pg.close();
  }
  await b.close();
})();
