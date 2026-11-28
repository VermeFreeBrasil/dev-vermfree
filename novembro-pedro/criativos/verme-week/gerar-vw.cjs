// Verme Week (20 a 26/11) · 10 estáticos de venda (17/11, pedido do Pedro após pedido do Otávio). Ficha v3:
// 12% (1 un) · 15% (3+) · 17% (5+), frete grátis ≥ R$ 299, 1 kit adulto de brinde > R$ 1.000.
// Layout novo: foto real em tela cheia (Higgsfield com as fotos reais, cenas/) e cartão branco embaixo com o texto
// (preto e vermelho). 4:5 + 9:16, texto fora dos 14% de cima e dos 20% de baixo no 9:16.
// Uso: node gerar-vw.cjs [peças] → png/vf-verme-week-NN-<slug>-9x16.png e -4x5.png
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const ART = path.join(__dirname, 'cenas');
const OUT = path.join(__dirname, 'png');
fs.mkdirSync(OUT, { recursive: true });
const brl = c => 'R$ ' + (c / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const d = (c, p) => Math.round(c * (100 - p) / 100);
const P = { adulto: 34700, k24: 27000, k59: 38900, fam: 115000 };
const pecas = [
  { n: 1, slug: 'escada', h: 'Quanto mais, <em>maior o desconto.</em>', s: '12% em 1 · 15% levando 3 · 17% levando 5', z: 1.25, cx: .5, cy: .22 },
  { n: 2, slug: 'adulto', h: 'Adulto por <em>' + brl(d(P.adulto, 12)) + '</em>', s: 'de ' + brl(P.adulto) + ' · levando 5, ' + brl(d(P.adulto, 17)) + ' cada' },
  { n: 3, slug: 'kids-2a4', h: 'Kids 2 a 4 por <em>' + brl(d(P.k24, 12)) + '</em>', s: 'de ' + brl(P.k24) + ' · até 17% OFF levando 5' },
  { n: 4, slug: 'kids-5a9', h: 'Kids 5 a 9 por <em>' + brl(d(P.k59, 12)) + '</em>', s: 'de ' + brl(P.k59) + ' · até 17% OFF levando 5' },
  { n: 5, slug: 'kit-familia', h: 'Kit Família por <em>' + brl(d(P.fam, 12)) + '</em>', s: 'a casa toda + 1 kit adulto de brinde' },
  { n: 6, slug: 'frete-gratis', h: '<em>Frete grátis</em> acima de R$ 299.', s: '1 Adulto já passa: ' + brl(d(P.adulto, 12)) },
  { n: 7, slug: 'brinde', h: 'Acima de R$ 1.000, <em>1 kit adulto de presente.</em>', s: 'vale para qualquer combinação de protocolos', z: 1.0, cx: .5, cy: .28 },
  { n: 8, slug: '7-dias', h: 'São só <em>7 dias.</em>', s: 'de 20 a 26/11 · acaba 26/11 às 23h59' },
  { n: 9, slug: 'leve-5', h: 'Levando 5, <em>17% OFF em tudo.</em>', s: '5 Adultos por ' + brl(5 * d(P.adulto, 17)) + ' + 1 kit adulto de brinde' },
  { n: 10, slug: 'pode-misturar', h: 'Pode misturar: <em>conta o total do carrinho.</em>', s: 'Adulto + Kids juntos: 3 itens, 15% · 5 itens, 17%' },
];
const css = (W, H, v, p) => {
  const z = p.z || 1, base = v ? 1 : .8, s = base * z, imW = W * s, imH = imW * 1344 / 752;
  const cx = p.cx || .5, cy = p.cy || .3;
  const left = W / 2 - cx * imW, top = (v ? 590 : 330) - cy * imH;
  const T = v ? { lab: 290, card: 1150, h: 66, s: 29 } : { lab: 36, card: 880, h: 58, s: 26 };
  return `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
body{font-family:'Inter Display',Inter,Arial,sans-serif;position:relative}
.sc{position:absolute;left:${left}px;top:${top}px;width:${imW}px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)}
.sc img{width:100%;display:block}
.lab{position:absolute;left:48px;top:${T.lab}px;background:#e01e26;color:#fff;font:800 ${v ? 26 : 23}px Inter,Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;padding:11px 18px;border-radius:8px}
.lab b{font-weight:800;opacity:.85;margin-left:8px}
.card{position:absolute;left:48px;right:48px;top:${T.card}px;background:#fff;border-radius:28px;padding:${v ? 40 : 32}px ${v ? 42 : 36}px;box-shadow:0 20px 60px #000c}
h1{color:#0b0b0b;font-weight:700;font-size:${T.h}px;line-height:1.04;letter-spacing:-.035em}
h1 em{font-style:normal;color:#e01e26}
p{margin-top:14px;color:#3a3a3a;font-size:${T.s}px;line-height:1.3}
.ft{margin-top:20px;padding-top:16px;border-top:2px solid #eee;font:700 ${v ? 21 : 19}px Inter,Arial,sans-serif;color:#7a7a7a}
.ft b{color:#e01e26}
`;
};
const html = (p, W, H, v) => `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H, v, p)}</style></head><body>
<div class="sc"><img src="file://${path.join(ART, 'c' + p.n + '.jpg')}"></div>
<div class="lab">Verme Week<b>· 20 a 26/11</b></div>
<div class="card"><h1>${p.h}</h1><p>${p.s}</p><div class="ft"><b>até 17% OFF</b> · frete grátis acima de R$ 299 · <b>kit adulto de brinde</b> acima de R$ 1.000</div></div>
</body></html>`;
(async () => {
  const b = await chromium.launch();
  const so = process.argv[2] ? process.argv[2].split(',').map(Number) : null;
  for (const [W, H, tag, v] of [[1080, 1920, '9x16', 1], [1080, 1350, '4x5', 0]]) {
    const pg = await b.newPage({ viewport: { width: W, height: H } });
    for (const p of pecas) {
      if (so && !so.includes(p.n)) continue;
      const hf = path.join(ART, `_p${p.n}-${tag}.html`); fs.writeFileSync(hf, html(p, W, H, v));
      await pg.goto('file://' + hf, { waitUntil: 'load' }); await pg.waitForTimeout(200);
      const f = path.join(OUT, `vf-verme-week-${String(p.n).padStart(2, '0')}-${p.slug}-${tag}.png`);
      await pg.screenshot({ path: f }); fs.unlinkSync(hf);
    }
  }
  await b.close();
})();
