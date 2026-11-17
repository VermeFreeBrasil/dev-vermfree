// Verme Friday · mais 10 estáticos (16/11) na 2ª referência do Pedro: bloco preto em cima com título grande,
// palavra-chave em vermelho e número em branco; embaixo foto de estúdio (parede vermelha, mesa branca, produto real
// e planta), com fitas brancas "VERME FRIDAY · 18% OFF" cruzando a divisa. Sem copiar a referência: cenas próprias
// (Higgsfield com as fotos reais, cenas7/), só preto, vermelho e branco, uma cena diferente por peça.
// Uso: node gerar7-sale.cjs [peças]   → png7/vf-verme-friday-sale-NN-<slug>-9x16.png e -4x5.png
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const ART = path.join(__dirname, 'cenas7');
const OUT = path.join(__dirname, 'png7');
fs.mkdirSync(OUT, { recursive: true });
const img = f => 'file://' + path.join(ART, f);
const brl = c => 'R$ ' + (c / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const off = c => c - Math.floor(c * 18 / 100);
const p3 = c => brl(Math.floor(c / 3)); // igual ao site (arredonda para baixo)
const P = { adulto: 34700, k24: 27000, k59: 38900, fam: 115000 };
const cinco = 4 * off(P.adulto);
// topo do produto em cada cena (fração da altura)
const TOPO = { 1: .41, 2: .33, 3: .2, 4: .14, 5: .37, 6: .32, 7: .14, 8: .3, 9: .33, 10: .23 };

const pecas = [
  { n: 1, slug: '18-off', r: 'Oferta', w: '18% OFF', s: 'no site todo · só 27 e 28/11' },
  { n: 2, slug: 'leve5-pague4', r: 'Leve 5', w: 'pague 4', s: 'e ainda 18% OFF em tudo' },
  { n: 3, slug: 'kids-2a4', r: 'Kids 2 a 4', w: '3x ' + p3(off(P.k24)), s: 'sem juros · 18% OFF + 5º grátis levando 5' },
  { n: 4, slug: 'kids-5a9', r: 'Kids 5 a 9', w: '3x ' + p3(off(P.k59)), s: 'sem juros · 18% OFF + 5º grátis levando 5' },
  { n: 5, slug: 'kit-familia', r: 'Kit Família', w: '18% OFF', s: 'a casa toda · frete grátis' },
  { n: 6, slug: 'frete-gratis', r: 'Frete', w: 'grátis', s: 'sem valor mínimo · até em 1 protocolo' },
  { n: 7, slug: 'adulto', r: 'Adulto', w: '3x ' + p3(off(P.adulto)), s: 'sem juros · 18% OFF + 5º grátis levando 5' },
  { n: 8, slug: 'so-48h', r: 'Só 48h', w: '27 e 28/11', s: 'acaba 28/11 às 23h59' },
  { n: 9, slug: '5-adultos', r: '5 Adultos', w: 'Pague 4', s: '+ 18% OFF em cada um' },
  { n: 10, slug: 'sorteio', r: 'Ganhe um', w: 'Protocolo', s: 'sorteio entre os 300 primeiros pedidos' },
];

const css = (W, H, v, p) => {
  const L = v ? { t: 300, blk: 1000, fit: 1050, fita: 900 } : { t: 30, blk: 590, fit: 625, fita: 548 };
  const sc = Math.max(H - W, L.fit - TOPO[p.n] * W);
  const big = p.w.length > 8 ? (v ? 150 : 128) : (v ? 190 : 160);
  const red = p.r.length > 8 ? (v ? 150 : 128) : (v ? 190 : 160);
  return `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
body{font-family:Inter,Arial,sans-serif;color:#fff;position:relative}
.sc{position:absolute;left:0;top:${sc}px;width:${W}px}.sc img{width:100%;display:block}
.blk{position:absolute;left:0;right:0;top:0;height:${L.blk}px;background:#0b0b0b}
.tx{position:absolute;left:0;right:0;top:${L.t}px;text-align:center;text-transform:uppercase}
.h{font-weight:800;font-size:${v ? 104 : 92}px;letter-spacing:-.02em;line-height:1}
.r{font-weight:900;font-size:${red}px;letter-spacing:-.04em;line-height:.95;color:#e3141d;margin-top:${v ? 10 : 6}px}
.w{font-weight:900;font-size:${big}px;letter-spacing:-.04em;line-height:.95;margin-top:${v ? 4 : 2}px}
.s{font-weight:400;font-size:${v ? 34 : 29}px;letter-spacing:.14em;margin-top:${v ? 26 : 16}px}
.fita{position:absolute;left:-120px;width:${W + 240}px;height:${v ? 64 : 54}px;background:#fff;color:#e3141d;display:flex;align-items:center;
  white-space:nowrap;overflow:hidden;font-weight:900;font-size:${v ? 30 : 26}px;letter-spacing:.06em;text-transform:uppercase;box-shadow:0 8px 24px #0006}
.f1{top:${L.fita}px;transform:rotate(-7deg)}.f2{top:${L.fita + (v ? 70 : 60)}px;transform:rotate(5deg)}
`;
};
const fita = '<span>' + Array(12).fill('Verme Friday · 18% OFF · 5º grátis · ').join('') + '</span>';
const html = (p, W, H, v) => `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H, v, p)}</style></head><body>
<div class="sc"><img src="${img('c' + p.n + '.jpg')}"></div><div class="blk"></div>
<div class="tx"><div class="h">Verme Friday</div><div class="r">${p.r}</div><div class="w">${p.w}</div><div class="s">${p.s}</div></div>
<div class="fita f1">${fita}</div><div class="fita f2" style="padding-left:200px">${fita}</div>
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
      const f = path.join(OUT, `vf-verme-friday-sale-${String(p.n).padStart(2, '0')}-${p.slug}-${tag}.png`);
      await pg.screenshot({ path: f }); fs.unlinkSync(hf); console.log(path.basename(f));
    }
  }
  await b.close();
})();
