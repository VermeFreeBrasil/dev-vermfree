// Verme Week (20 a 26/11) · 10 estáticos v3 (17/11): produto herói (cenas Higgsfield com os produtos reais em cenas3/),
// layout mínimo: título forte no topo (branco + uma linha vermelha), linha de apoio curta, selo da campanha.
// Ficha v3: 12% (1) · 15% (3+) · 17% (5+), frete grátis ≥ R$ 299, 1 kit adulto de brinde > R$ 1.000.
// Uso: node gerar-vw3.cjs [peças] → png3/NN-slug-4x5.png e -9x16.png (9:16 com texto entre 270 e 1536 px)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const F = f => 'file://' + path.join(__dirname, f);
const OUT = path.join(__dirname, 'png3');
fs.mkdirSync(OUT, { recursive: true });
const pecas = [
  { n: 1, slug: 'enche-a-cesta', c: 1, a: 'Começou.', b: 'Enche a cesta.', s: '12% em 1 · 15% levando 3 · <em>17% levando 5</em>' },
  { n: 2, slug: 'quanto-mais', c: 2, a: 'Quanto mais leva,', b: 'maior o desconto.', s: 'Até <em>17% OFF</em> no site todo, de 20 a 26/11' },
  { n: 3, slug: 'adulto', c: 3, a: 'Protocolo Adulto', b: '3x de R$ 101,79', s: 'sem juros · <em>12% OFF</em> · até 17% levando 5' },
  { n: 4, slug: 'kids', c: 4, a: 'VermeFree Kids', b: 'com 12% OFF.', s: 'a partir de <em>3x de R$ 79,20</em> sem juros · até 17% levando 5' },
  { n: 5, slug: 'kit-familia', c: 5, a: 'Kit Família', b: 'ganha brinde.', s: '<em>12% OFF</em> + 1 protocolo adulto de presente' },
  { n: 6, slug: 'frete-gratis', c: 6, a: 'Frete grátis', b: 'acima de R$ 299.', s: '1 Protocolo Adulto já garante o <em>frete grátis</em>' },
  { n: 7, slug: 'brinde', c: 7, a: 'Ganhe um protocolo', b: 'adulto grátis.', s: 'Só na <em>Verme Week</em> · de 20 a 26/11' },
  { n: 8, slug: '7-dias', c: 8, a: '7 dias.', b: 'Só até 26/11.', s: 'Até <em>17% OFF</em> · acaba 26/11 às 23h59' },
  { n: 9, slug: 'leve-5', c: 9, a: 'Levando 5,', b: '17% OFF.', s: '<em>17% OFF</em> em cada um + brinde' },
  { n: 10, slug: 'pode-misturar', c: 10, a: 'Pode misturar', b: 'Adulto + Kids.', s: '3 itens <em>15%</em> · 5 itens <em>17%</em> na mesma compra' },
];
// v: 9:16. Cena 752x1344 (topo ~20% vazio, preto). Bordas da cena se fundem no preto (máscara).
const css = (W, H, v) => {
  const sw = v ? 960 : 700, st = v ? 400 : 240; // largura e topo da cena
  const tt = v ? 290 : 52; // topo do bloco de texto
  return `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#050505}
body{font-family:Inter,Arial,sans-serif;color:#fff;position:relative}
.glow{position:absolute;left:50%;top:${st + sw * 1.787 * 0.55}px;width:${sw * 1.3}px;height:${sw * 1.1}px;transform:translate(-50%,-50%);background:radial-gradient(closest-side,#e01e2633,transparent)}
.sc{position:absolute;left:50%;top:${st}px;width:${sw}px;transform:translateX(-50%);
  -webkit-mask-image:linear-gradient(to right,transparent 0,#000 9%,#000 91%,transparent 100%),linear-gradient(to bottom,transparent 0,#000 12%,#000 100%);
  -webkit-mask-composite:source-in;mask-composite:intersect}
.tx{position:absolute;left:${v ? 70 : 64}px;right:${v ? 70 : 64}px;top:${tt}px;z-index:3}
.row{display:flex;justify-content:space-between;align-items:center}
.logo{height:${v ? 66 : 58}px;filter:brightness(0) invert(1)}
.sel{border:2px solid #e01e26;color:#fff;font-weight:800;font-size:${v ? 22 : 20}px;letter-spacing:.14em;text-transform:uppercase;padding:9px 18px;border-radius:40px}
.sel b{color:#ff4a52}
h1{margin-top:${v ? 34 : 26}px;font-weight:900;font-size:${v ? 100 : 86}px;line-height:.98;letter-spacing:-.045em}
h1 span{display:block;color:#ff2b33}
.s{margin-top:${v ? 22 : 16}px;font-size:${v ? 33 : 28}px;font-weight:500;line-height:1.3;color:#d9d9d9;max-width:${v ? 900 : 860}px}
.s em{font-style:normal;font-weight:800;color:#fff}
.url{position:absolute;right:${v ? 70 : 64}px;bottom:${v ? 400 : 44}px;z-index:3;font-weight:800;font-size:${v ? 24 : 22}px;letter-spacing:.04em;background:#e01e26;padding:12px 24px;border-radius:40px;box-shadow:0 10px 30px #000a}
`;
};
const html = (p, W, H, v) => `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H, v)}</style></head><body>
<div class="glow"></div><img class="sc" src="${F('cenas3/c' + p.c + '.png')}">
<div class="tx"><div class="row"><img class="logo" src="${F('assets/logo-shopify-medium.png')}"><div class="sel">Verme Week · <b>20 a 26/11</b></div></div>
<h1>${p.a}<span>${p.b}</span></h1><p class="s">${p.s}</p></div>
</body></html>`;
(async () => {
  const only = process.argv.slice(2).map(Number);
  const br = await chromium.launch();
  for (const p of pecas) {
    if (only.length && !only.includes(p.n)) continue;
    for (const [W, H, v, suf] of [[1080, 1350, 0, '4x5'], [1080, 1920, 1, '9x16']]) {
      const pg = await br.newPage({ viewport: { width: W, height: H } });
      const hf = path.join(__dirname, `_p${p.n}-${suf}.html`); fs.writeFileSync(hf, html(p, W, H, v));
      await pg.goto('file://' + hf, { waitUntil: 'load' }); await pg.waitForTimeout(250); fs.unlinkSync(hf);
      await pg.screenshot({ path: path.join(OUT, `vf-verme-week-${String(p.n).padStart(2, '0')}-${p.slug}-${suf}.png`) });
      await pg.close();
    }
  }
  await br.close();
})();
