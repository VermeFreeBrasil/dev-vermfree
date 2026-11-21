// Verme Friday · 10 estáticos de venda · v3 (09/11): fundo PRETO (pedido do Pedro), pedra escura; elementos em branco e vermelho.
// (v2:, refeitos depois do "ficaram ruins" do Pedro.
// Mais fiel à referência: foto de estúdio verde com pedra (gerada no Higgsfield), produto apoiado na pedra,
// tipografia fina e limpa, selo em pílula contornado, e o desconto como título. Sem caixinhas nem botão.
// Uso: node gerar2.cjs <pasta-das-imagens> [saida] [peças, ex.: 1,3]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const ART = process.argv[2];
const OUT = process.argv[3] || path.join(__dirname, 'png3');
fs.mkdirSync(OUT, { recursive: true });
const img = f => 'file://' + path.join(ART, f);
const brl = c => 'R$ ' + (c / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const off = c => c - Math.floor(c * 18 / 100);
const p3 = c => brl(Math.round(c / 3));
const P = { adulto: 34700, k24: 27000, k59: 38900, fam: 115000 };
const cinco = 4 * off(P.adulto);

// v = imagem do produto (já recortada) e largura relativa na pedra
const FAM = { f: 'crop-vf-pv2-kit-familia-v3.png', w: .46 }, AD = { f: 'crop-vf-pv2-adulto.png', w: .46 },
  K24 = { f: 'crop-vf-pv2-kids-2a4.png', w: .32 }, K59 = { f: 'crop-vf-pv2-kids-5a9.png', w: .32 };
const pecas = [
  { n: 1, slug: 'maior-desconto', pill: 'Compre 4, leve 5 · Frete grátis', big: '18% OFF', h: 'em todo o site', s: 'O maior desconto do ano. Só 27 e 28/11.', v: FAM },
  { n: 2, slug: 'compre4-leve5', pill: '+ 18% OFF em tudo', big: 'Leve 5,', h: 'pague 4.', s: 'O 5º item sai grátis e soma com os 18% OFF.', v: FAM },
  { n: 3, slug: 'adulto', pill: '18% OFF + 5º grátis', h: 'VermeFree Adulto', de: P.adulto, v: AD },
  { n: 4, slug: 'kids-2a4', pill: '18% OFF + 5º grátis', h: 'VermeFree Kids 2 a 4', de: P.k24, v: K24 },
  { n: 5, slug: 'kids-5a9', pill: '18% OFF + 5º grátis', h: 'VermeFree Kids 5 a 9', de: P.k59, v: K59 },
  { n: 6, slug: 'kit-familia', pill: '18% OFF + 5º grátis', h: 'Kit Família', de: P.fam, v: FAM },
  { n: 7, slug: 'casa-toda', pill: 'Até 34% OFF levando 5', big: brl(cinco), h: '5 protocolos Adulto', s: 'De ' + brl(5 * P.adulto) + '. Você economiza ' + brl(5 * P.adulto - cinco) + '.', v: AD, x: '×5' },
  { n: 8, slug: 'frete-gratis', pill: 'Frete grátis sem mínimo', big: 'Frete grátis', h: 'em qualquer pedido', s: 'Mesmo levando 1 protocolo, com 18% OFF.', v: K24 },
  { n: 9, slug: 'sorteio', pill: 'Sorteio · 300 primeiros pedidos', big: 'Ganhe um kit', h: 'à sua escolha', s: 'Os 300 primeiros pedidos concorrem. 18% OFF + 5º grátis.', v: FAM },
  { n: 10, slug: 'so-2-dias', pill: 'Só 27 e 28/11', big: '2 dias.', h: 'Depois, acabou.', s: 'Guia de alimentos e manual da desparasitação de presente.', v: AD },
];

const css = (W, H, p) => {
  const T = H > 1500;
  const pe = T ? .60 : .72, vw = W * p.v.w * (T ? .8 : 1);
  const R = '#e01e26';
  return `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{font-family:Inter,Arial,sans-serif;color:#fff;position:relative;background:#000 url('${img(T ? 'bk-v.png' : 'bk-a.png')}') center/cover no-repeat}
.band{position:absolute;left:0;right:0;top:${T ? 236 : 0}px;height:${T ? 96 : 88}px;background:${R};display:flex;align-items:center;justify-content:space-between;padding:0 48px}
.band img{height:${T ? 46 : 42}px;filter:brightness(0) invert(1)}
.band .t{display:flex;align-items:center;gap:16px;font-weight:900;font-size:${T ? 32 : 30}px;letter-spacing:3px;text-transform:uppercase}
.band .t i{width:12px;height:12px;border-radius:50%;background:#fff}
.band .t span{background:#000;padding:8px 16px;border-radius:8px;letter-spacing:1px;font-size:${T ? 28 : 26}px}
.c{position:absolute;top:${T ? 380 : 128}px;left:44px;right:44px;text-align:center}
.pill{display:inline-block;background:#fff;color:#000;border-radius:999px;padding:${T ? '13px 38px' : '11px 34px'};font-size:${T ? 31 : 28}px;font-weight:800;letter-spacing:.5px;text-transform:uppercase}
.big{margin-top:${T ? 26 : 18}px;font-size:${T ? 150 : 128}px;font-weight:900;letter-spacing:-.045em;line-height:.95}
.big b{background:${R};padding:0 .14em;border-radius:14px;box-decoration-break:clone;-webkit-box-decoration-break:clone;box-shadow:0 14px 34px #0008}
h1{margin-top:${T ? 20 : 14}px;font-size:${T ? 62 : 54}px;font-weight:300;letter-spacing:-.02em;line-height:1.05}
h1.only{margin-top:${T ? 30 : 22}px;font-size:${T ? 80 : 70}px}
.s{margin-top:${T ? 16 : 12}px;font-size:${T ? 30 : 27}px;opacity:.92}
.pr{margin-top:${T ? 14 : 10}px;display:flex;justify-content:center;align-items:center;gap:20px}
.pr s{font-size:${T ? 36 : 32}px;opacity:.7;font-weight:300}
.pr b{font-size:${T ? 120 : 106}px;font-weight:900;letter-spacing:-.04em}
.pr em{font-style:normal;background:${R};font-weight:900;font-size:${T ? 36 : 32}px;padding:6px 14px;border-radius:10px}
.p3{font-size:${T ? 33 : 29}px;margin-top:2px}
.p3 b{font-weight:800}
.v{position:absolute;left:${(W - vw) / 2}px;width:${vw}px;bottom:${H * (1 - pe)}px}
.v img{width:100%;display:block;filter:drop-shadow(0 18px 22px #000)}
.v .x{position:absolute;left:-30px;top:-24px;width:${T ? 118 : 108}px;height:${T ? 118 : 108}px;border-radius:50%;background:${R};color:#fff;
  display:flex;align-items:center;justify-content:center;font-size:${T ? 46 : 42}px;font-weight:900;box-shadow:0 10px 26px #0008}
.seal{position:absolute;right:${T ? 70 : 60}px;bottom:${H * (1 - pe) + (T ? 140 : 200)}px;width:${T ? 190 : 172}px;height:${T ? 190 : 172}px;border-radius:50%;background:${R};
  border:6px solid #fff;display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(-10deg);box-shadow:0 14px 34px #000a;text-transform:uppercase}
.seal small{font-size:${T ? 24 : 22}px;font-weight:800;letter-spacing:2px}
.seal b{font-size:${T ? 66 : 60}px;font-weight:900;line-height:.95;letter-spacing:-.03em}
.seal i{font-style:normal;font-size:${T ? 20 : 18}px;font-weight:700;color:#fff;letter-spacing:1px}
.ft{position:absolute;left:0;right:0;bottom:${T ? 384 : 0}px;background:#fff;color:#000;padding:${T ? '22px 30px' : '20px 30px'};text-align:center}
.ft p{font-size:${T ? 27 : 25}px;font-weight:600;letter-spacing:.4px}
.ft p b{color:${R};font-weight:900}
.ft .tm{margin-top:6px;font-size:${T ? 24 : 22}px;font-weight:800;letter-spacing:2px;text-transform:uppercase}
.ft .tm span{color:#fff;background:${R};padding:3px 10px;border-radius:6px}
`;
};

const html = (p, W, H) => `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H, p)}</style></head><body>
<div class="band"><img src="${img('logo-shopify-medium.png')}"><div class="t"><i></i>Verme Friday<span>27 e 28/11</span></div></div>
<div class="c">
  <span class="pill">${p.pill}</span>
  ${p.de
    ? `<h1 class="only">${p.h}</h1><div class="pr"><s>${brl(p.de)}</s><b>${brl(off(p.de))}</b><em>−18%</em></div><p class="p3">ou <b>3x de ${p3(off(p.de))}</b> sem juros</p>`
    : `<div class="big"><b>${p.big}</b></div><h1>${p.h}</h1><p class="s">${p.s}</p>`}
</div>
<div class="v">${p.x ? `<span class="x">${p.x}</span>` : ''}<img src="${img(p.v.f)}"></div>
<div class="seal"><small>Só</small><b>48h</b><i>27 e 28/11</i></div>
<div class="ft"><p><b>18% OFF</b> em tudo · <b>5º grátis</b> levando 5 · <b>frete grátis</b> sem mínimo</p><p class="tm">⏱ Acaba <span>28/11 às 23h59</span></p></div>
</body></html>`;

(async () => {
  const b = await chromium.launch();
  const so = process.argv[4] ? process.argv[4].split(',').map(Number) : null;
  for (const [W, H, tag] of [[1080, 1350, '4x5'], [1080, 1920, '9x16']]) {
    const pg = await b.newPage({ viewport: { width: W, height: H } });
    for (const p of pecas) {
      if (so && !so.includes(p.n)) continue;
      const hf = path.join(ART, `vfr3-${p.n}-${tag}.html`); fs.writeFileSync(hf, html(p, W, H));
      await pg.goto('file://' + hf, { waitUntil: 'load' }); await pg.waitForTimeout(150);
      const f = path.join(OUT, `vf-verme-friday-${String(p.n).padStart(2, '0')}-${p.slug}-${tag}.png`);
      await pg.screenshot({ path: f }); console.log(f);
    }
    await pg.close();
  }
  await b.close();
})();
