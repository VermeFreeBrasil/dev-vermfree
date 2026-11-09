// Verme Friday · 10 estáticos de venda · v5 (09/11): um CONCEITO diferente por peça (pedido do Pedro: "pensa fora da caixa").
// Cenas geradas no Higgsfield com as fotos reais dos produtos: mãos passando o frasco, 5 mãos (compre 4 leve 5),
// palma com potes levitando, mão de criança, 4 mãos da família, relógio 48:00:00, caixa de envio com fita vermelha,
// cápsulas voando, caixa de presente com laço vermelho. Fundo preto; faixa vermelha; tarjas vermelhas; rodapé branco.
// Uso: node gerar5.cjs <pasta-das-imagens> [saida] [peças]   (só 4:5 nesta rodada; 9:16 depois da aprovação dos conceitos)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const ART = process.argv[2];
const OUT = process.argv[3] || path.join(__dirname, 'png5');
fs.mkdirSync(OUT, { recursive: true });
const SC = JSON.parse(fs.readFileSync(path.join(ART, 'kscenes.json'), 'utf8'));
const img = f => 'file://' + path.join(ART, f);
const brl = c => 'R$ ' + (c / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const off = c => c - Math.floor(c * 18 / 100);
const p3 = c => brl(Math.round(c / 3));
const P = { adulto: 34700, k24: 27000, k59: 38900, fam: 115000 };
const cinco = 4 * off(P.adulto);

const pecas = [
  { n: 1, slug: 'maior-desconto', k: 'k1', tags: ['<b>18% OFF</b> em todo o site', '+ o <b>5º grátis</b> levando 5', '<b>Frete grátis</b> sem mínimo', 'Só <b>27 e 28/11</b>'] },
  { n: 2, slug: 'compre4-leve5', k: 'k2', pill: '+ 18% OFF em tudo', big: 'Compre 4, leve 5', h: 'o 5º item sai grátis', sticker: { t: 'GRÁTIS', x: 51, y: 36 } },
  { n: 3, slug: 'adulto', k: 'k3', pill: '18% OFF + 5º grátis', h: 'VermeFree Adulto', de: P.adulto },
  { n: 4, slug: 'kids-2a4', k: 'k4', alt: 'k5', pill: '18% OFF + 5º grátis', h: 'VermeFree Kids 2 a 4', de: P.k24 },
  { n: 5, slug: 'kids-5a9', k: 'k5', pill: '18% OFF + 5º grátis', h: 'VermeFree Kids 5 a 9', de: P.k59 },
  { n: 6, slug: 'kit-familia', k: 'k6', pill: '18% OFF + 5º grátis', h: 'Kit Família · a casa toda', de: P.fam },
  { n: 7, slug: 'so-48h', k: 'k7', fit: 1, pill: 'Só 27 e 28/11', big: '48 horas.', h: 'Depois, o preço volta.', s: 'Guia de alimentos + manual de presente.' },
  { n: 8, slug: 'frete-gratis', k: 'k8', fit: 1, pill: 'Sem valor mínimo', big: 'Frete grátis', h: 'em qualquer pedido, até em 1 protocolo' },
  { n: 9, slug: 'casa-toda', k: 'k9', pill: 'Até 34% OFF levando 5', big: brl(cinco), h: '5 protocolos Adulto · economia de ' + brl(5 * P.adulto - cinco) },
  { n: 10, slug: 'sorteio', k: 'k10', fit: 1, pill: 'Sorteio · 300 primeiros pedidos', big: 'Ganhe um kit', h: 'à sua escolha' },
];

const css = (W, H, p, key) => {
  const R = '#e01e26', [iw, ih, top, bot0] = SC[key], bot = Math.min(bot0, .95);
  let s = 1, imTop = 0;
  if (p.tags) { imTop = 40; }
  else if (p.fit) { s = Math.min(1, (1262 - 470) / ((bot - top + .03) * W * ih / iw)); imTop = 470 - (top - .03) * W * s * ih / iw; }
  else { imTop = Math.max(0, 470 - top * W * ih / iw); }
  const imW = W * s, imH = imW * ih / iw;
  return `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
body{font-family:Inter,Arial,sans-serif;color:#fff;position:relative}
.sc{position:absolute;left:${(W - imW) / 2}px;top:${imTop}px;width:${imW}px;height:${imH}px;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent);mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent)}
.sc img{width:100%;height:100%;display:block;-webkit-mask-image:linear-gradient(180deg,transparent,#000 8%);mask-image:linear-gradient(180deg,transparent,#000 8%)}
.band{position:absolute;left:0;right:0;top:0;height:84px;background:${R};display:flex;align-items:center;justify-content:space-between;padding:0 46px;z-index:3}
.band img{height:40px;filter:brightness(0) invert(1)}
.band .t{display:flex;align-items:center;gap:14px;font-weight:900;font-size:29px;letter-spacing:3px;text-transform:uppercase}
.band .t span{background:#000;padding:7px 14px;border-radius:8px;letter-spacing:1px;font-size:25px}
.c{position:absolute;top:108px;left:40px;right:40px;text-align:center;z-index:3}
.pill{display:inline-block;background:#fff;color:#000;border-radius:999px;padding:10px 30px;font-size:25px;font-weight:800;letter-spacing:.5px;text-transform:uppercase}
.big{margin-top:16px;font-size:100px;font-weight:900;letter-spacing:-.045em;line-height:1}
.big b{background:${R};padding:0 .16em;border-radius:14px}
h1{margin-top:12px;font-size:42px;font-weight:300;letter-spacing:-.02em;line-height:1.1}
h1.only{margin-top:16px;font-size:58px}
.s{margin-top:8px;font-size:24px;opacity:.9}
.pr{margin-top:6px;display:flex;justify-content:center;align-items:center;gap:18px}
.pr s{font-size:29px;opacity:.7;font-weight:300}
.pr b{font-size:92px;font-weight:900;letter-spacing:-.04em;line-height:1}
.pr em{font-style:normal;background:${R};font-weight:900;font-size:29px;padding:5px 12px;border-radius:9px}
.p3{font-size:26px;margin-top:4px}
.p3 b{font-weight:800}
.tm{display:inline-flex;align-items:center;gap:12px;margin-top:12px;border:2px solid ${R};border-radius:999px;padding:6px 20px;
  font-size:22px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;background:#000c}
.tm b{background:${R};padding:3px 10px;border-radius:6px}
.tags{position:absolute;right:46px;top:200px;width:560px;z-index:3;display:flex;flex-direction:column;align-items:flex-end;gap:26px}
.tags div{background:#fff;color:#000;font-size:40px;font-weight:600;padding:16px 28px;border-radius:6px;box-shadow:0 14px 30px #000a;white-space:nowrap}
.tags div b{color:${R};font-weight:900}
.tags div:nth-child(1){transform:rotate(-5deg);background:${R};color:#fff}.tags div:nth-child(1) b{color:#fff}
.tags div:nth-child(2){transform:rotate(3deg);margin-right:40px}
.tags div:nth-child(3){transform:rotate(-3deg)}
.tags div:nth-child(4){transform:rotate(4deg);margin-right:60px;background:#000;color:#fff;border:3px solid ${R}}.tags div:nth-child(4) b{color:#ff4d55}
.stk{position:absolute;left:${p.sticker ? p.sticker.x : 0}%;top:${p.sticker ? p.sticker.y : 0}%;transform:translate(-50%,-50%) rotate(-12deg);z-index:4;
  background:${R};color:#fff;font-weight:900;font-size:34px;letter-spacing:1px;padding:12px 22px;border-radius:12px;border:4px solid #fff;box-shadow:0 12px 28px #000b}
.ft{position:absolute;left:0;right:0;bottom:0;background:#fff;color:#000;padding:18px 24px;text-align:center;font-size:24px;font-weight:600;z-index:3}
.ft b{color:${R};font-weight:900}
`;
};

const tm = `<div><span class="tm">⏱ Só 48h · acaba <b>28/11 às 23h59</b></span></div>`;
const html = (p, W, H, key) => `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H, p, key)}</style></head><body>
<div class="sc"><img src="${img(key + '.png')}"></div>
<div class="band"><img src="${img('logo-shopify-medium.png')}"><div class="t">Verme Friday<span>27 e 28/11</span></div></div>
${p.tags ? `<div class="tags">${p.tags.map(t => `<div>${t}</div>`).join('')}</div>` : `<div class="c">
  <span class="pill">${p.pill}</span>
  ${p.de
    ? `<h1 class="only">${p.h}</h1><div class="pr"><s>${brl(p.de)}</s><b>${brl(off(p.de))}</b><em>−18%</em></div><p class="p3">ou <b>3x de ${p3(off(p.de))}</b> sem juros</p>`
    : `<div class="big"><b>${p.big}</b></div><h1>${p.h}</h1>${p.s ? `<p class="s">${p.s}</p>` : ''}`}
  ${p.n === 7 ? '' : tm}
</div>`}
${p.sticker ? `<div class="stk">${p.sticker.t}</div>` : ''}
<div class="ft"><b>18% OFF</b> em tudo · <b>5º grátis</b> levando 5 · <b>frete grátis</b> sem mínimo</div>
</body></html>`;

(async () => {
  const b = await chromium.launch();
  const so = process.argv[4] ? process.argv[4].split(',').map(Number) : null;
  const [W, H, tag] = [1080, 1350, '4x5'];
  const pg = await b.newPage({ viewport: { width: W, height: H } });
  for (const p of pecas) {
    if (so && !so.includes(p.n)) continue;
    const key = SC[p.k] ? p.k : p.alt;
    if (!key || !SC[key]) { console.log('sem cena', p.k); continue; }
    const hf = path.join(ART, `vfr5-${p.n}-${tag}.html`); fs.writeFileSync(hf, html(p, W, H, key));
    await pg.goto('file://' + hf, { waitUntil: 'load' }); await pg.waitForTimeout(150);
    const f = path.join(OUT, `vf-verme-friday-${String(p.n).padStart(2, '0')}-${p.slug}-${tag}.png`);
    await pg.screenshot({ path: f }); console.log(f);
  }
  await b.close();
})();
