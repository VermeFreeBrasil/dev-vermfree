// Verme November (12–19/11) · 10 estáticos de venda · 11/11 (pedido do Pedro).
// Regras do Pedro: fundo preto, elementos vermelhos e brancos, produto real ou mão (sem UGC),
// um conceito diferente por peça, sem repetir layouts anteriores. Tema da campanha: lua nova.
// Oferta (Shopify, agendada): 10% (1 item) · 12% (3+) · 15% (5+) · frete grátis ≥ R$ 299 · Kit Adulto de brinde > R$ 1.000.
// Uso: node gerar-vn.cjs <pasta-imagens(art)> <pasta-cenas> [saida] [peças]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const ART = process.argv[2], SC = process.argv[3];
const OUT = process.argv[4] || path.join(__dirname, 'png');
fs.mkdirSync(OUT, { recursive: true });
const A = f => 'file://' + path.join(ART, f);
const S = f => 'file://' + path.join(SC, f);
const brl = c => 'R$ ' + (c / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const pct = (c, p) => c - Math.round(c * p / 100);
const P = { adulto: 34700, k24: 27000, fam: 115000 };
const R = '#e01e26';

// cabeçalho comum: lua + nome da campanha + datas
const head = `<div class="hd"><i class="lu"></i><span>Verme November</span><em>12 a 19/11</em><img src="${A('logo-shopify-medium.png')}"></div>`;
const foot = `<div class="ft"><b>até 15% OFF</b> · frete grátis acima de R$ 299 · <b>Kit Adulto de brinde</b> acima de R$ 1.000</div>`;

const bottles = (n, h) => Array.from({ length: n }, (_, i) => `<img class="bt" style="z-index:${10 - Math.abs(i - (n - 1) / 2)}" src="${A('b-tintura.png')}">`).join('');

const pecas = [
  { n: 1, slug: 'lua-nova', cena: 's1.png', body: `
    <div class="c1"><p class="k">a semana da lua nova</p><h1>Verme<br>November</h1>
    <div class="tg"><b>até 15% OFF</b><span>em todo o site</span></div></div>` },
  { n: 2, slug: 'escada', body: `
    <div class="tt"><p class="k">quanto mais você leva</p><h2>maior o <b>desconto.</b></h2></div>
    <div class="esc">
      <div class="st s1"><div class="pr">${bottles(1, 0)}</div><div class="dg"><b>10%</b><span>1 protocolo</span></div></div>
      <div class="st s2"><div class="pr">${bottles(3, 0)}</div><div class="dg"><b>12%</b><span>3 ou mais</span></div></div>
      <div class="st s3"><div class="pr">${bottles(5, 0)}</div><div class="dg"><b>15%</b><span>5 ou mais</span></div></div>
    </div>` },
  { n: 3, slug: 'adulto-tabela', body: `
    <div class="tt l"><p class="k">VermeFree Adulto</p><h2>Quanto custa<br>cada <b>protocolo</b></h2></div>
    <img class="hero-p" src="${A('crop-vf-pv2-adulto.png')}">
    <div class="tab">
      <div><span>levando 1</span><s>${brl(P.adulto)}</s><b>${brl(pct(P.adulto, 10))}</b></div>
      <div><span>levando 3+</span><s>${brl(P.adulto)}</s><b>${brl(pct(P.adulto, 12))}</b><i>cada</i></div>
      <div class="on"><span>levando 5+</span><s>${brl(P.adulto)}</s><b>${brl(pct(P.adulto, 15))}</b><i>cada</i></div>
    </div>` },
  { n: 4, slug: 'kids', cena: 's2.png', body: `
    <div class="tt"><p class="k">pros pequenos de 2 a 4 anos</p><h2>VermeFree <b>Kids</b></h2>
    <div class="px"><s>${brl(P.k24)}</s><b>${brl(pct(P.k24, 10))}</b><em>−10%</em></div><p class="m">e 12% levando 3, 15% levando 5</p></div>` },
  { n: 5, slug: 'kit-familia', cena: 's3.png', body: `
    <div class="tt"><p class="k">Kit Família · 2 adultos + 2 crianças</p>
    <div class="px"><s>${brl(P.fam)}</s><b>${brl(pct(P.fam, 10))}</b></div>
    <h3>+ 1 Kit Adulto <b>de presente</b></h3></div>` },
  { n: 6, slug: 'brinde', cena: 's4.png', body: `
    <div class="tt"><p class="k">pedidos acima de R$ 1.000</p><h2>O Kit Adulto<br><b>vai de presente.</b></h2><p class="m">1 protocolo completo a mais, sem pagar nada.</p></div>` },
  { n: 7, slug: 'frete', cena: 's5.png', body: `
    <div class="tt"><p class="k">acima de R$ 299</p><h2>Frete <b>grátis</b><br>até a sua porta.</h2><p class="m">1 protocolo Adulto já passa de R$ 299.</p></div>` },
  { n: 8, slug: 'oito-dias', body: `
    <div class="tt l"><p class="k">só de 12 a 19 de novembro</p><h2><b>8 dias.</b><br>Depois acaba.</h2></div>
    <div class="cal">${['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => `<i>${d}</i>`).join('')}${Array.from({ length: 21 }, (_, i) => { const d = 8 + i; return `<span class="${d >= 12 && d <= 19 ? 'on' : ''}${d === 19 ? ' fim' : ''}">${d}</span>`; }).join('')}</div>
    <p class="cap">o desconto acaba dia <b>19/11 às 23h59</b></p>` },
  { n: 9, slug: 'comece-na-lua', body: `
    <div class="tt"><p class="k">o calendário ajuda</p><h2>Compre agora,<br>comece na <b>lua nova.</b></h2></div>
    <div class="fases">${[0, 1, 2, 3, 4].map(k => `<i class="f${k}"></i>`).join('')}</div>
    <p class="cap">o pedido chega a tempo da <b>última lua nova do ano (09/12)</b>, a data que a gente usa para começar o protocolo</p>
    <img class="tin" src="${A('b-tintura.png')}">` },
  { n: 10, slug: 'leve-5', body: `
    <div class="tt"><p class="k">a casa toda de uma vez</p><h2>Leve 5:<br><b>15% OFF</b> + brinde</h2></div>
    <div class="cinco">${bottles(5, 0)}<div class="gift">+1<small>de presente</small></div></div>
    <div class="px c"><span>5 Adultos por</span><b>${brl(5 * pct(P.adulto, 15))}</b></div><p class="m c">+ 1 Kit Adulto de brinde (pedido acima de R$ 1.000)</p>` },
];

const css = (W, H, p) => {
  const T = H > 1500, top = T ? 250 : 40, bot = T ? 300 : 0;
  return `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
body{font-family:Inter,Arial,sans-serif;color:#fff;position:relative;background:radial-gradient(ellipse 90% 55% at 50% ${p.cena ? 40 : 55}%,#1c0608,#000 70%)}
.bg{position:absolute;left:0;right:0;top:${T ? 270 : 0}px;height:${T ? 1350 : 1350}px;background-size:cover;background-position:center 60%;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 18%,#000 82%,transparent);mask-image:linear-gradient(180deg,transparent 0,#000 18%,#000 82%,transparent)}
.hd{position:absolute;top:${top}px;left:48px;right:48px;display:flex;align-items:center;gap:14px;font-weight:900;text-transform:uppercase;letter-spacing:3px;font-size:24px;z-index:5}
.hd .lu{width:30px;height:30px;border-radius:50%;background:#050102;box-shadow:inset -6px 0 0 #fff,0 0 14px #fff6}
.hd em{font-style:normal;background:${R};padding:6px 12px;border-radius:8px;letter-spacing:1px}
.hd img{height:34px;margin-left:auto;filter:brightness(0) invert(1)}
.ft{position:absolute;left:0;right:0;bottom:${bot}px;background:#fff;color:#000;text-align:center;font-size:${T ? 22 : 24}px;font-weight:600;padding:18px 20px;z-index:5;white-space:nowrap}
.ft b{color:${R};font-weight:900}
.k{font-size:${T ? 30 : 27}px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#ff5a60}
h1{font-size:${T ? 190 : 170}px;font-weight:900;letter-spacing:-.06em;line-height:.86;margin-top:12px}
h2{font-size:${T ? 98 : 88}px;font-weight:900;letter-spacing:-.045em;line-height:1.06;margin-top:10px}
h2 b,h3 b{background:${R};padding:0 .12em;border-radius:12px}
h3{font-size:${T ? 60 : 54}px;font-weight:900;letter-spacing:-.03em;margin-top:18px}
.m{font-size:${T ? 32 : 29}px;margin-top:16px;opacity:.9}
.c{text-align:center}
.tt{position:absolute;left:48px;right:48px;top:${top + 80}px;text-align:center;z-index:4}
.tt.l{text-align:left}
.px{display:flex;justify-content:center;align-items:center;gap:20px;margin-top:16px}
.px s{font-size:${T ? 38 : 34}px;opacity:.65}
.px b{font-size:${T ? 120 : 108}px;font-weight:900;letter-spacing:-.05em;line-height:1}
.px em{font-style:normal;background:${R};font-weight:900;font-size:34px;padding:6px 14px;border-radius:10px}
.px span{font-size:36px;font-weight:600}
.px.c{position:absolute;left:0;right:0;bottom:${bot + (T ? 260 : 200)}px;flex-direction:column;gap:0}
.m.c{position:absolute;left:60px;right:60px;bottom:${bot + (T ? 200 : 140)}px}
/* 1 */
.c1{position:absolute;left:56px;right:56px;top:${top + 90}px}
.c1 h1{text-shadow:0 10px 40px #000}
.tg{display:inline-flex;align-items:center;gap:16px;margin-top:22px;background:${R};padding:16px 28px;border-radius:14px;transform:rotate(-2deg)}
.tg b{font-size:54px;font-weight:900;letter-spacing:-.03em}.tg span{font-size:28px;font-weight:700}
/* 2 escada */
.esc{position:absolute;left:40px;right:40px;bottom:${bot + (T ? 120 : 90)}px;height:${T ? 900 : 760}px;display:flex;align-items:flex-end;gap:16px}
.st{flex:1;display:flex;flex-direction:column;align-items:center}
.st .pr{display:flex;justify-content:center;align-items:flex-end;margin-bottom:-6px}
.st .pr .bt{margin:0 -22px;filter:drop-shadow(0 16px 16px #000)}
.s1 .pr .bt{margin:0}
.st .dg{width:100%;background:linear-gradient(180deg,#2a0b0e,#120405);border-top:6px solid ${R};border-radius:16px 16px 0 0;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:22px}
.s1 .dg{height:${T ? 260 : 220}px}.s2 .dg{height:${T ? 400 : 330}px}.s3 .dg{height:${T ? 540 : 440}px;background:linear-gradient(180deg,${R},#7d0c12)}
.st .dg b{font-size:${T ? 92 : 82}px;font-weight:900;letter-spacing:-.05em;line-height:1}
.st .dg span{font-size:26px;font-weight:700;opacity:.9}
.st .pr .bt{width:auto!important;height:${T ? 250 : 210}px;object-fit:contain}
.s1 .pr .bt{height:${T ? 300 : 260}px}.s2 .pr .bt{height:${T ? 270 : 230}px}
/* 3 tabela */
.hero-p{position:absolute;left:50%;transform:translateX(-50%);top:${top + (T ? 330 : 300)}px;width:${T ? 620 : 600}px;filter:drop-shadow(0 30px 40px #000)}
.tab{position:absolute;left:48px;right:48px;bottom:${bot + (T ? 150 : 100)}px;display:flex;flex-direction:column;gap:14px}
.tab div{display:flex;align-items:baseline;gap:20px;background:#ffffff10;border:2px solid #ffffff22;border-radius:18px;padding:20px 28px}
.tab span{flex:1;font-size:34px;font-weight:700}.tab s{font-size:28px;opacity:.55}
.tab b{font-size:62px;font-weight:900;letter-spacing:-.04em}.tab i{font-style:normal;font-size:24px;opacity:.8}
.tab .on{background:${R};border-color:${R}}
/* 8 calendário */
.cal{position:absolute;left:56px;right:56px;top:${top + (T ? 480 : 360)}px;display:grid;grid-template-columns:repeat(7,1fr);gap:12px;text-align:center}
.cal i{font-style:normal;font-size:26px;font-weight:800;opacity:.6}
.cal span{font-size:${T ? 58 : 52}px;font-weight:800;padding:${T ? 44 : 34}px 0;border-radius:16px;background:#ffffff0d;color:#ffffff66}
.cal span.on{background:#fff;color:#000}.cal span.fim{background:${R};color:#fff}
.cap{position:absolute;left:60px;right:60px;bottom:${bot + (T ? 140 : 100)}px;text-align:center;font-size:${T ? 36 : 33}px;line-height:1.3}
.cap b{color:#ff5a60}
/* 9 lua */
.fases{position:absolute;left:60px;right:60px;top:${top + (T ? 430 : 420)}px;display:flex;justify-content:space-between}
.fases i{width:150px;height:150px;border-radius:50%;background:#f3ead6;box-shadow:0 0 30px #fff3}
.fases .f0{box-shadow:inset 0 0 0 0 #000,0 0 30px #fff3}.fases .f1{box-shadow:inset -50px 0 0 #050102,0 0 30px #fff3}.fases .f2{box-shadow:inset -95px 0 0 #050102,0 0 30px #fff3}
.fases .f3{box-shadow:inset -130px 0 0 #050102,0 0 20px #fff2}.fases .f4{background:#050102;box-shadow:0 0 0 4px ${R},0 0 50px ${R}88}
.tin{position:absolute;left:50%;transform:translateX(-50%);bottom:${bot + (T ? 330 : 200)}px;height:${T ? 420 : 380}px;filter:drop-shadow(0 20px 30px #000)}
.cap{z-index:3}
/* 10 cinco */
.cinco{position:absolute;left:0;right:0;top:${top + (T ? 430 : 360)}px;display:flex;justify-content:center;align-items:flex-end}
.cinco .bt{width:auto!important;height:${T ? 420 : 430}px;margin:0 -30px;filter:drop-shadow(0 20px 20px #000)}
.gift{position:absolute;right:50px;top:-40px;width:170px;height:170px;border-radius:50%;background:${R};border:5px solid #fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:64px;font-weight:900;line-height:1;transform:rotate(-10deg);z-index:20}
.gift small{font-size:18px;text-transform:uppercase;letter-spacing:1px}
`;
};

const html = (p, W, H) => `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H, p)}</style></head><body>
${p.cena ? `<div class="bg" style="background-image:url('${S(p.cena)}')"></div>` : ''}
${head}${p.body}${foot}
</body></html>`;

(async () => {
  const b = await chromium.launch();
  const so = process.argv[5] ? process.argv[5].split(',').map(Number) : null;
  for (const [W, H, tag] of [[1080, 1350, '4x5'], [1080, 1920, '9x16']]) {
    const pg = await b.newPage({ viewport: { width: W, height: H } });
    for (const p of pecas) {
      if (so && !so.includes(p.n)) continue;
      if (p.cena && !fs.existsSync(path.join(SC, p.cena))) { console.log('sem cena', p.cena); continue; }
      const hf = path.join(SC, `vn-${p.n}-${tag}.html`); fs.writeFileSync(hf, html(p, W, H));
      await pg.goto('file://' + hf, { waitUntil: 'load' }); await pg.waitForTimeout(200);
      const o = path.join(OUT, `vf-verme-november-${String(p.n).padStart(2, '0')}-${p.slug}-${tag}.png`);
      await pg.screenshot({ path: o }); console.log(o);
    }
    await pg.close();
  }
  await b.close();
})();
