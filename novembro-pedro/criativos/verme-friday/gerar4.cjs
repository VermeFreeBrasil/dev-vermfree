// Verme Friday · 10 estáticos de venda · v4 (09/11)
// v3 reprovada: "potes flutuantes" e "produtos sempre do mesmo jeito". Na v4 cada peça usa uma CENA fotográfica
// gerada no Higgsfield com os produtos reais como referência (apoiados na pedra e no chão, em alturas e
// arranjos diferentes, com sombra de contato). Fundo preto; elementos em vermelho, branco e preto.
// Uso: node gerar4.cjs <pasta-das-imagens> [saida] [peças]
// A pasta precisa de: logo-shopify-medium.png, sA.png sB.png s1..s9.png (cenas) e scenes.json (topo/base dos rótulos).
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const ART = process.argv[2];
const OUT = process.argv[3] || path.join(__dirname, 'png4');
fs.mkdirSync(OUT, { recursive: true });
const SC = JSON.parse(fs.readFileSync(path.join(ART, 'scenes.json'), 'utf8'));
const img = f => 'file://' + path.join(ART, f);
const brl = c => 'R$ ' + (c / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const off = c => c - Math.floor(c * 18 / 100);
const p3 = c => brl(Math.round(c / 3));
const P = { adulto: 34700, k24: 27000, k59: 38900, fam: 115000 };
const cinco = 4 * off(P.adulto);

// cena 4:5 / cena 9:16
const pecas = [
  { n: 1, slug: 'maior-desconto', c: ['A', '5'], pill: 'Compre 4, leve 5 · Frete grátis', big: '18% OFF', h: 'em todo o site', s: 'O maior desconto do ano.' },
  { n: 2, slug: 'compre4-leve5', c: ['4', '9'], pill: '+ 18% OFF em tudo', big: 'Leve 5, pague 4', h: 'o 5º item sai grátis', s: 'E ainda soma com os 18% OFF.' },
  { n: 3, slug: 'adulto', c: ['1', '6'], pill: '18% OFF + 5º grátis', h: 'VermeFree Adulto', de: P.adulto },
  { n: 4, slug: 'kids-2a4', c: ['2', '7'], pill: '18% OFF + 5º grátis', h: 'VermeFree Kids 2 a 4', de: P.k24 },
  { n: 5, slug: 'kids-5a9', c: ['8', '8'], pill: '18% OFF + 5º grátis', h: 'VermeFree Kids 5 a 9', de: P.k59 },
  { n: 6, slug: 'kit-familia', c: ['B', '9'], pill: '18% OFF + 5º grátis', h: 'Kit Família', de: P.fam, sub: '2 adultos + 2 crianças' },
  { n: 7, slug: 'casa-toda', c: ['1', '6'], pill: 'Até 34% OFF levando 5', big: brl(cinco), h: '5 protocolos Adulto', s: 'De ' + brl(5 * P.adulto) + '. Economia de ' + brl(5 * P.adulto - cinco) + '.' },
  { n: 8, slug: 'frete-gratis', c: ['2', '7'], pill: 'Sem valor mínimo', big: 'Frete grátis', h: 'em qualquer pedido', s: 'Mesmo levando 1 protocolo.' },
  { n: 9, slug: 'sorteio', c: ['4', '9'], pill: 'Sorteio · 300 primeiros pedidos', big: 'Ganhe um kit', h: 'à sua escolha', s: 'Os 300 primeiros pedidos concorrem.' },
  { n: 10, slug: 'so-2-dias', c: ['A', '5'], pill: 'Só 27 e 28/11', big: '2 dias.', h: 'Depois, acabou.', s: 'Guia de alimentos + manual de presente.' },
];

const css = (W, H, p) => {
  const T = H > 1500, R = '#e01e26';
  const k = T ? p.c[1] : p.c[0], [iw, ih, top, bot] = SC[k];
  const Y0 = T ? 820 : 470, Y1 = T ? 1590 : 1262;
  const s = Math.min(1, (Y1 - Y0) / ((bot - top + .06) * W * ih / iw));
  const imW = W * s, imH = imW * ih / iw, imTop = Y0 - (top - .06) * imH;
  return `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
body{font-family:Inter,Arial,sans-serif;color:#fff;position:relative}
.sc{position:absolute;left:${(W - imW) / 2}px;top:${imTop}px;width:${imW}px;height:${imH}px;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}
.sc img{width:100%;height:100%;display:block;-webkit-mask-image:linear-gradient(180deg,transparent,#000 14%);mask-image:linear-gradient(180deg,transparent,#000 14%)}
.band{position:absolute;left:0;right:0;top:${T ? 236 : 0}px;height:${T ? 96 : 84}px;background:${R};display:flex;align-items:center;justify-content:space-between;padding:0 46px;z-index:3}
.band img{height:${T ? 46 : 40}px;filter:brightness(0) invert(1)}
.band .t{display:flex;align-items:center;gap:14px;font-weight:900;font-size:${T ? 32 : 29}px;letter-spacing:3px;text-transform:uppercase}
.band .t span{background:#000;padding:7px 14px;border-radius:8px;letter-spacing:1px;font-size:${T ? 28 : 25}px}
.c{position:absolute;top:${T ? 372 : 108}px;left:40px;right:40px;text-align:center;z-index:3}
.pill{display:inline-block;background:#fff;color:#000;border-radius:999px;padding:${T ? '12px 34px' : '10px 30px'};font-size:${T ? 29 : 25}px;font-weight:800;letter-spacing:.5px;text-transform:uppercase}
.big{margin-top:${T ? 22 : 16}px;font-size:${T ? 124 : 104}px;font-weight:900;letter-spacing:-.045em;line-height:1}
.big b{background:${R};padding:0 .16em;border-radius:14px}
h1{margin-top:${T ? 16 : 12}px;font-size:${T ? 54 : 46}px;font-weight:300;letter-spacing:-.02em;line-height:1.05}
h1.only{margin-top:${T ? 24 : 16}px;font-size:${T ? 70 : 60}px}
.s{margin-top:${T ? 10 : 8}px;font-size:${T ? 28 : 24}px;opacity:.9}
.pr{margin-top:${T ? 10 : 6}px;display:flex;justify-content:center;align-items:center;gap:18px}
.pr s{font-size:${T ? 34 : 29}px;opacity:.7;font-weight:300}
.pr b{font-size:${T ? 112 : 94}px;font-weight:900;letter-spacing:-.04em;line-height:1}
.pr em{font-style:normal;background:${R};font-weight:900;font-size:${T ? 34 : 29}px;padding:5px 12px;border-radius:9px}
.p3{font-size:${T ? 30 : 26}px;margin-top:4px}
.p3 b{font-weight:800}
.tm{display:inline-flex;align-items:center;gap:12px;margin-top:${T ? 18 : 12}px;border:2px solid ${R};border-radius:999px;padding:${T ? '8px 22px' : '6px 20px'};
  font-size:${T ? 25 : 22}px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;background:#000c}
.tm b{background:${R};padding:3px 10px;border-radius:6px}
.ft{position:absolute;left:0;right:0;bottom:${T ? 250 : 0}px;background:#fff;color:#000;padding:${T ? '20px 24px' : '18px 24px'};text-align:center;font-size:${T ? 27 : 24}px;font-weight:600;z-index:3}
.ft b{color:${R};font-weight:900}
`;
};

const html = (p, W, H) => {
  const T = H > 1500, k = T ? p.c[1] : p.c[0];
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H, p)}</style></head><body>
<div class="sc"><img src="${img('s' + k + '.png')}"></div>
<div class="band"><img src="${img('logo-shopify-medium.png')}"><div class="t">Verme Friday<span>27 e 28/11</span></div></div>
<div class="c">
  <span class="pill">${p.pill}</span>
  ${p.de
    ? `<h1 class="only">${p.h}</h1><div class="pr"><s>${brl(p.de)}</s><b>${brl(off(p.de))}</b><em>−18%</em></div><p class="p3">ou <b>3x de ${p3(off(p.de))}</b> sem juros</p>`
    : `<div class="big"><b>${p.big}</b></div><h1>${p.h}</h1><p class="s">${p.s}</p>`}
  <div><span class="tm">⏱ Só 48h · acaba <b>28/11 às 23h59</b></span></div>
</div>
<div class="ft"><b>18% OFF</b> em tudo · <b>5º grátis</b> levando 5 · <b>frete grátis</b> sem mínimo</div>
</body></html>`;
};

(async () => {
  const b = await chromium.launch();
  const so = process.argv[4] ? process.argv[4].split(',').map(Number) : null;
  for (const [W, H, tag] of [[1080, 1350, '4x5'], [1080, 1920, '9x16']]) {
    const pg = await b.newPage({ viewport: { width: W, height: H } });
    for (const p of pecas) {
      if (so && !so.includes(p.n)) continue;
      const k = H > 1500 ? p.c[1] : p.c[0];
      if (!SC[k]) { console.log('sem cena', k, 'peça', p.n); continue; }
      const hf = path.join(ART, `vfr4-${p.n}-${tag}.html`); fs.writeFileSync(hf, html(p, W, H));
      await pg.goto('file://' + hf, { waitUntil: 'load' }); await pg.waitForTimeout(150);
      const f = path.join(OUT, `vf-verme-friday-${String(p.n).padStart(2, '0')}-${p.slug}-${tag}.png`);
      await pg.screenshot({ path: f }); console.log(f);
    }
    await pg.close();
  }
  await b.close();
})();
