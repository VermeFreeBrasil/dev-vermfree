// Verme November · mais 10 estáticos de venda (16/11, pedido do Pedro). Conceitos novos (não repetem os 10 de 11/11):
// texto alinhado à esquerda embaixo, barra vermelha, selo "Verme November · 12 a 19/11" no alto; cenas do Higgsfield
// com as fotos reais (cenas2/). Oferta: 10% (1) · 12% (3+) · 15% (5+), frete grátis ≥ R$ 299, Kit Adulto de brinde > R$ 1.000.
// Uso: node gerar-vn2.cjs [peças]  → png2/vf-verme-november-NN-<slug>-9x16.png e -4x5.png (NN = 11 a 20)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const ART = path.join(__dirname, 'cenas2');
const OUT = path.join(__dirname, 'png2');
fs.mkdirSync(OUT, { recursive: true });
const brl = c => 'R$ ' + (c / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const d = (c, p) => Math.round(c * (100 - p) / 100);
const P = { adulto: 34700, k24: 27000, k59: 38900, fam: 115000 };
// z = zoom na cena (cx, cy = centro do zoom, fração)
const pecas = [
  { n: 11, c: 1, slug: 'kids-5a9', h: 'Kids 5 a 9 por <em>' + brl(d(P.k59, 10)) + '</em>', s: 'de ' + brl(P.k59) + ' · 10% OFF, até 15% levando 5' },
  { n: 12, c: 2, slug: 'poucos-dias', h: 'Faltam <em>poucos dias.</em>', s: 'O Verme November acaba 19/11 às 23h59. Até 15% OFF.' },
  { n: 13, c: 3, slug: '1-ou-5', h: '1 sai ' + brl(d(P.adulto, 10)) + '.<br>Levando 5, <em>' + brl(d(P.adulto, 15)) + ' cada.</em>', s: 'quanto mais protocolos, maior o desconto: 10% · 12% · 15%' },
  { n: 14, c: 4, slug: 'casa-de-3', h: '2 Adultos + 1 Kids:<br><em>12% OFF em tudo.</em>', s: '2 Adultos + Kids 2 a 4 por ' + brl(d(2 * P.adulto + P.k24, 12)) + ' · frete grátis' },
  { n: 15, c: 5, slug: 'casa-toda', h: 'A casa toda <em>de uma vez.</em>', s: 'Kit Família por ' + brl(d(P.fam, 10)) + ' + 1 Kit Adulto de presente' },
  { n: 16, c: 6, slug: 'ingredientes', h: '5 ervas, óleo de orégano, <em>ornitina e silimarina.</em>', s: 'Protocolo Adulto por ' + brl(d(P.adulto, 10)) + ' · até 15% OFF' },
  { n: 17, c: 7, slug: '30-dias', h: 'Protocolo de 30 dias.<br><em>Comece agora.</em>', s: 'Pedindo no Verme November, chega a tempo da lua nova (09/12).' },
  { n: 18, c: 8, slug: 'sem-cupom', h: 'Sem cupom.<br><em>O desconto entra sozinho.</em>', s: '10% em 1 · 12% em 3 · 15% em 5, direto no carrinho' },
  { n: 19, c: 9, slug: 'leve-4-ganhe-1', h: 'Leve 4 e <em>ganhe o 5º kit.</em>', s: '4 Adultos por ' + brl(4 * d(P.adulto, 12)) + ' (12% OFF) + 1 Kit Adulto de brinde', z: 1.8, z4: 1.35, cx: .5, cy: .34 },
  { n: 20, c: 10, slug: 'kit-completo', h: 'Kit Adulto completo:<br><em>4 frascos, 30 dias.</em>', s: brl(d(P.adulto, 10)) + ' com 10% OFF · frete grátis' },
];
const css = (W, H, v, p) => {
  const z = (v ? p.z : p.z4 || p.z) || 1, base = v ? 1 : .74, s = base * z, imW = W * s, imH = imW * 1344 / 752;
  const cx = p.cx || .5, cy = p.cy || .3;
  const left = W / 2 - cx * imW, top = (v ? 600 : 400) - cy * imH;
  const T = v ? { lab: 290, tx: 1170, h: 74, s: 30 } : { lab: 34, tx: 860, h: 66, s: 27 };
  return `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
body{font-family:'Inter Display',Inter,Arial,sans-serif;color:#fff;position:relative}
.sc{position:absolute;left:${left}px;top:${top}px;width:${imW}px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.sc img{width:100%;display:block}
.sh{position:absolute;left:0;right:0;top:${T.tx - 220}px;bottom:0;background:linear-gradient(180deg,#0000,#000d 180px,#000)}
.lab{position:absolute;left:56px;top:${T.lab}px;display:flex;align-items:center;gap:12px;font:800 ${v ? 26 : 23}px Inter,Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;background:#000b;padding:10px 16px 10px 12px;border-radius:8px}
.lab i{width:14px;height:14px;background:#e01e26;border-radius:3px}
.lab b{background:#e01e26;padding:3px 9px;border-radius:5px;letter-spacing:.06em}
.tx{position:absolute;left:56px;right:70px;top:${T.tx}px;border-left:8px solid #e01e26;padding-left:28px}
h1{font-weight:700;font-size:${T.h}px;line-height:1.02;letter-spacing:-.035em}
h1 em{font-style:normal;color:#ff3b44}
p{margin-top:18px;font-size:${T.s}px;line-height:1.3;color:#e2e2e2}
.ft{margin-top:22px;font:600 ${v ? 22 : 20}px Inter,Arial,sans-serif;color:#9a9a9a}
.ft b{color:#ff4a52}
`;
};
const html = (p, W, H, v) => `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H, v, p)}</style></head><body>
<div class="sc"><img src="file://${path.join(ART, 'c' + p.c + '.jpg')}"></div><div class="sh"></div>
<div class="lab"><i></i>Verme November <b>12 a 19/11</b></div>
<div class="tx"><h1>${p.h}</h1><p>${p.s}</p><div class="ft"><b>até 15% OFF</b> · frete grátis acima de R$ 299 · <b>Kit Adulto de brinde</b> acima de R$ 1.000</div></div>
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
      const f = path.join(OUT, `vf-verme-november-${p.n}-${p.slug}-${tag}.png`);
      await pg.screenshot({ path: f }); fs.unlinkSync(hf); console.log(path.basename(f));
    }
  }
  await b.close();
})();
