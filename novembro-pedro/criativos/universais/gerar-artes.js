// 30 estáticos universais do mês (Black VermeFree) · estilos "lp" (claro/vermelho, Inter) e "soc" (floresta/lima, Caprasimo)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const D = __dirname;
const img = f => 'file://' + path.join(D, f);
const OUT = process.argv[2] || path.join(D, 'out30');
const ONLY = process.argv[3] ? process.argv[3].split(',').map(Number) : null;
const TAGS = (process.argv[4] || '4x5,9x16').split(',');
fs.mkdirSync(OUT, { recursive: true });

const P = { ped: 'vf-hero-pedestal.png', kit: 'vf-pv2-kit-familia-v3.png' };
const pecas = require('./pecas30.js');

const css = (W, H) => {
  const T = H > 1500;
  return `
@font-face{font-family:Caprasimo;src:url('${img('Caprasimo-Regular.ttf')}')}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{font-family:Inter,sans-serif;--ink:#173e2d;--red:#d7262f;--red2:#b5121b;--lime:#c0de96;--cream:#f6f5ec}
body.lp{background:#f5f2ea;color:var(--ink)}
body.soc{background:radial-gradient(ellipse 100% 70% at 50% 35%,#245a40 0,#173e2d 55%,#102e21 100%);color:var(--cream)}
.c{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;text-align:center;padding:${T ? '230px 70px 300px' : '0 70px 54px'}}
.top{position:absolute;left:0;right:0;top:0;background:var(--red);color:#fff;font-weight:800;font-size:24px;letter-spacing:2.5px;text-transform:uppercase;padding:18px 0;text-align:center}
.logo{height:${T ? 70 : 58}px;margin:${T ? 0 : 96}px 0 24px}
body.soc .logo{filter:brightness(0) invert(1)}
.badge{display:inline-block;font-size:24px;font-weight:800;letter-spacing:2px;text-transform:uppercase;padding:10px 24px;border-radius:60px;margin-bottom:24px}
body.lp .badge{border:2px solid #f6c9cb;background:#fdeceb;color:var(--red)}
body.soc .badge{background:var(--red);color:#fff}
h1{font-size:${T ? 84 : 74}px;line-height:1.05;font-weight:800;letter-spacing:-.035em}
body.soc h1{font-family:Caprasimo,serif;font-weight:400;letter-spacing:-.01em;line-height:1.08}
h1 b{color:var(--red);font-weight:inherit}
body.soc h1 b{color:var(--lime)}
h1.q{font-style:italic;font-size:${T ? 66 : 58}px}
.s{font-size:${T ? 36 : 32}px;line-height:1.35;margin-top:20px;opacity:.85;max-width:920px}
.v{flex:1;width:100%;min-height:0;display:flex;align-items:center;justify-content:center;position:relative;margin:18px 0}
.v>img.p{max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 26px 30px #0005)}
.btn{display:flex;align-items:center;justify-content:center;width:100%;max-width:860px;height:${T ? 120 : 108}px;border-radius:80px;font-size:${T ? 44 : 40}px;font-weight:800;flex-shrink:0}
body.lp .btn{background:linear-gradient(180deg,#e2333b,var(--red2));color:#fff;box-shadow:0 18px 36px #d7262f55}
body.soc .btn{background:var(--lime);color:var(--ink);box-shadow:0 18px 36px #0006}
.foot{margin-top:16px;font-size:24px;opacity:.75;flex-shrink:0}
.moon{position:absolute;top:0;right:10%;width:150px;height:150px;border-radius:50%;box-shadow:-34px 14px 0 0 #f3ead2}
.print{height:100%;aspect-ratio:9/16;object-fit:cover;border-radius:26px;box-shadow:0 20px 40px #0005;outline:6px solid var(--lime)}
body.lp .print{outline-color:var(--red)}
.mosaic{display:flex;gap:18px;height:100%;align-items:center;justify-content:center;width:100%}
.mosaic img{width:30%;max-height:92%;aspect-ratio:9/16;object-fit:cover;border-radius:22px;box-shadow:0 14px 30px #0004}
.mosaic img:nth-child(2){width:34%;max-height:100%;outline:6px solid var(--red)}
.pick{display:grid;grid-template-columns:1fr 1fr;gap:16px;width:100%;margin-bottom:10px}
.pick div{background:#fff;border:2px solid #e3dccb;border-radius:22px;padding:18px;font-size:28px;font-weight:800}
.pick small{display:block;font-size:22px;font-weight:600;opacity:.7;margin-top:4px}
`;
};

const visual = p => {
  if (p.img === 'prints') return `<div class="mosaic"><img src="${img('d04.jpg')}"><img src="${img('d06.jpg')}"><img src="${img('d07.jpg')}"></div>`;
  if (/^d0\d$/.test(p.img)) return `<img class="print" src="${img(p.img + '.jpg')}">`;
  if (p.img === 'moon') return `<span class="moon"></span><img class="p" src="${img(P.ped)}">`;
  return `<img class="p" src="${img(P[p.img] || P.ped)}">`;
};

const html = (p, W, H) => `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H)}</style></head>
<body class="${p.st}">${p.st === 'lp' ? '<div class="top">Black VermeFree · o maior desconto da história</div>' : ''}<div class="c">
<img class="logo" src="${img('logo-shopify-medium.png')}">
${p.st === 'soc' ? '<p class="badge">Black VermeFree · o maior desconto da história</p>' : ''}
<h1 class="${p.q ? 'q' : ''}">${p.h}</h1><p class="s">${p.s}</p>
${p.pick ? `<div class="v" style="flex-direction:column"><div class="pick"><div>Adulto<small>a partir de 10 anos</small></div><div>Kids 2 a 4<small>dose para a idade</small></div><div>Kids 5 a 9<small>dose para a idade</small></div><div>Kit Família<small>2 adultos + 2 crianças</small></div></div><img class="p" style="flex:1;min-height:0" src="${img(P.kit)}"></div>` : `<div class="v">${visual(p)}</div>`}
<div class="btn">${p.b}</div><p class="foot">Protocolo natural · 30 dias</p>
</div></body></html>`;

(async () => {
  const b = await chromium.launch();
  for (const tag of TAGS) {
    const [W, H] = tag === '4x5' ? [1080, 1350] : [1080, 1920];
    const pg = await b.newPage({ viewport: { width: W, height: H } });
    for (const p of pecas) {
      if (ONLY && !ONLY.includes(p.n)) continue;
      const f = path.join(D, `u${p.n}-${tag}.html`);
      fs.writeFileSync(f, html(p, W, H));
      await pg.goto('file://' + f);
      await pg.evaluate(() => document.fonts.ready);
      await pg.waitForTimeout(200);
      await pg.screenshot({ path: path.join(OUT, `vf-black-universal-${String(p.n).padStart(2, '0')}-${tag}.png`) });
    }
  }
  await b.close();
})();
