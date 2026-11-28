// Universais Black · 4º lote (peças 33–40, 16/11). Estilo "neon" aprovado na Verme Friday (título brilhante), versão
// universal: sem data, porcentagem, cupom ou nome de campanha; só "Black VermeFree" e "o maior desconto da história".
// Cenas do Higgsfield com as fotos reais (cenas-lote4/). Uso: node gerar-lote4.cjs [peças] → png-lote4/vf-black-universal-NN-<slug>-9x16|4x5.png
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const ART = path.join(__dirname, 'cenas-lote4');
const OUT = path.join(__dirname, 'png-lote4');
fs.mkdirSync(OUT, { recursive: true });
const img = f => 'file://' + path.join(ART, f);
const brl = c => 'R$ ' + (c / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const off = c => c - Math.floor(c * 18 / 100);
const p3 = c => brl(Math.round(c / 3));
const P = { adulto: 34700, k24: 27000, k59: 38900, fam: 115000 };
const cinco = 4 * off(P.adulto);
// topo do produto em cada cena (fração da altura), medido na prova
const TOPO = { 33: .31, 34: .42, 35: .42, 36: .42, 37: .30, 38: .44, 39: .41, 40: .47 };
const BASE = { 33: .95, 34: .86, 35: .95, 36: .95, 37: .95, 38: .98, 39: .97, 40: .92 };
const pecas = [
  { n: 33, slug: 'feito-de-plantas', e: 'Feito<br>de plantas', d: '100%<br>vegetal' },
  { n: 34, slug: 'cuidado-na-medida', e: 'Cuidado<br>na medida', d: 'crianças a partir<br>de 2 anos' },
  { n: 35, slug: 'cabe-na-rotina', e: 'Cabe<br>na rotina', d: 'um protocolo simples<br>para a casa toda' },
  { n: 36, slug: 'antes-das-ferias', e: 'Antes<br>das férias', d: 'prepare<br>a casa toda' },
  { n: 37, slug: '4-frascos', e: '4 frascos,<br>1 protocolo', d: '30 dias<br>de cuidado' },
  { n: 38, slug: 'de-mao-em-mao', e: 'De mão<br>em mão', d: 'adultos e crianças<br>a partir de 2 anos' },
  { n: 39, slug: 'quanto-mais-melhor', e: 'Quanto mais,<br>melhor', d: 'leve para<br>a casa toda' },
  { n: 40, slug: 'nao-deixa-pra-depois', e: 'Não deixa<br>pra depois', d: 'o maior desconto<br>da história não dura' },
];

const css = (W, H, v, n) => {
  const imH = W * 1344 / 752; // cenas 752×1344
  const t = v ? { top: 285, fs: 168, lh: .86, ft: 712, of: 790, ofs: 62, ds: 40, prod: 950 } : { top: 46, fs: 142, lh: .86, ft: 400, of: 470, ofs: 52, ds: 34, prod: 600 };
  // 4:5: reduz a cena para o produto inteiro caber entre o texto e a borda de baixo
  const s = Math.min(1, (H - (v ? 40 : 20) - t.prod) / ((BASE[n] - TOPO[n]) * imH));
  t.imW = W * s; t.imTop = t.prod - TOPO[n] * imH * s;
  return `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
body{font-family:'Inter Display',Inter,Arial,sans-serif;color:#fff;position:relative}
.sc{position:absolute;left:${(W - t.imW) / 2}px;top:${t.imTop}px;width:${t.imW}px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.sc img{width:100%;display:block}
.sh{position:absolute;inset:0;background:linear-gradient(180deg,#000 0,#000d ${v ? 38 : 32}%,#0000 ${v ? 50 : 46}%)}
.glow{color:#fff;text-shadow:0 0 6px #fff,0 0 22px #ffffffb0,0 0 60px #ffffff60,0 0 120px #ff2a3340}
h1{position:absolute;left:0;right:0;top:${t.top}px;text-align:center;font-weight:500;font-size:${t.fs}px;line-height:${t.lh};letter-spacing:-.055em;text-transform:uppercase}
h1 span{display:block}
h1 span:last-child{text-shadow:0 0 6px #fff,0 0 22px #ffffffa0,0 0 70px #ff2a33b0,0 0 140px #ff2a3370}
.of{position:absolute;left:56px;right:56px;top:${t.of}px;display:flex;justify-content:space-between;align-items:flex-start;gap:24px;text-transform:uppercase;font-weight:500;letter-spacing:-.02em}
.of .e{font-size:${t.ofs}px;line-height:.98}
.of .d{font-size:${t.ds}px;line-height:1.05;text-align:right}
.ft{position:absolute;left:0;right:0;top:${t.ft}px;display:flex;justify-content:center}
.ft p{background:#e01e26;color:#fff;font:800 ${v ? 26 : 23}px Inter,Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;padding:9px 20px;border-radius:999px;box-shadow:0 0 30px #e01e2680}
`;
};
const html = (p, W, H, v) => `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H, v, p.n)}</style></head><body>
<div class="sc"><img src="${img('c' + p.n + '.jpg')}"></div><div class="sh"></div>
<h1 class="glow"><span>Black</span><span>VermeFree</span></h1>
<div class="of glow"><div class="e">${p.e}</div><div class="d">${p.d}</div></div>
<div class="ft"><p>O maior desconto da história</p></div>
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
      const f = path.join(OUT, `vf-black-universal-${p.n}-${p.slug}-${tag}.png`);
      await pg.screenshot({ path: f }); fs.unlinkSync(hf); console.log(path.basename(f));
    }
  }
  await b.close();
})();
