// Free Monday (30/11) · 10 estáticos de venda (16/11). Ficha v2 (Vitor): escada 10% (1 un) · 12% (3 un) · 15% (5 un),
// frete grátis a partir de R$ 299, 1 kit adulto de brinde acima de R$ 1.000, mensagem "última chance de desparasitar no ano"
// (chega a tempo da última lua nova do ano). Visual: noite, lua nova (disco preto com anel branco), produto real em pedra
// escura (cenas do Higgsfield com as fotos reais, cenas/), texto no chão escuro; preto, vermelho e branco.
// Uso: node gerar-fm.cjs [peças]  → png/vf-free-monday-NN-<slug>-9x16.png e -4x5.png
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const ART = path.join(__dirname, 'cenas');
const OUT = path.join(__dirname, 'png');
fs.mkdirSync(OUT, { recursive: true });
const brl = c => 'R$ ' + (c / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const p3 = c => brl(Math.floor(c / 3)); // igual ao site (arredonda para baixo)
const d = (c, p) => Math.round(c * (100 - p) / 100);
const P = { adulto: 34700, k24: 27000, k59: 38900, fam: 115000 };

const pecas = [
  { n: 1, slug: 'ultima-chance', h: 'Última chance de<br><em>desparasitar no ano.</em>', s: 'Pedindo no Free Monday, chega a tempo da última lua nova do ano.' },
  { n: 2, slug: 'ate-15-off', h: 'Até <em>15% OFF</em> por quantidade.', s: '1 unidade 10% · 3 unidades 12% · 5 unidades 15%' },
  { n: 3, slug: 'adulto', h: 'Adulto em <em>3x de ' + p3(d(P.adulto, 10)) + '</em>', s: 'sem juros · 10% OFF · até 15% OFF levando 5' },
  { n: 4, slug: 'kids-2a4', h: 'Kids 2 a 4 em <em>3x de ' + p3(d(P.k24, 10)) + '</em>', s: 'sem juros · 10% OFF · até 15% OFF levando 5' },
  { n: 5, slug: 'kids-5a9', h: 'Kids 5 a 9 em <em>3x de ' + p3(d(P.k59, 10)) + '</em>', s: 'sem juros · 10% OFF · até 15% OFF levando 5' },
  { n: 6, slug: 'kit-familia', h: 'Kit Família <em>ganha brinde.</em>', s: '10% OFF + 1 protocolo adulto de presente' },
  { n: 7, slug: 'kit-de-brinde', h: 'Ganhe <em>1 protocolo adulto</em> grátis.', s: 'Só no Free Monday · 30/11' },
  { n: 8, slug: 'frete-gratis', h: '<em>Frete grátis</em> acima de R$ 299.', s: '1 Protocolo Adulto já garante o frete grátis' },
  { n: 9, slug: 'so-hoje', h: 'Só hoje.<br><em>Última oportunidade do mês.</em>', s: '30/11 até 23h59' },
  { n: 10, slug: '5-adultos', h: '5 Adultos <em>+ 1 de brinde.</em>', s: '15% OFF em cada um · o 6º protocolo vem de presente' },
];

const css = (W, H, v) => {
  const imH = W * 1344 / 752, s = v ? 1 : .86, imW = W * s;
  const top = v ? 0 : -.04 * imH * s;
  const tx = v ? { top: 1235, h: 76, s: 31, pill: 26 } : { top: 1030, h: 64, s: 27, pill: 23 };
  return `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
body{font-family:'Inter Display',Inter,Arial,sans-serif;color:#fff;position:relative}
.sc{position:absolute;left:${(W - imW) / 2}px;top:${top}px;width:${imW}px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)}
.sc img{width:100%;display:block}
.sh{position:absolute;left:0;right:0;top:${tx.top - 140}px;bottom:0;background:linear-gradient(180deg,#0000,#000c 140px,#000e)}
.tx{position:absolute;left:64px;right:64px;top:${tx.top}px;text-align:center}
.pill{display:inline-block;background:#e01e26;color:#fff;font:800 ${tx.pill}px Inter,Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;padding:9px 22px;border-radius:999px}
h1{margin-top:20px;font-weight:700;font-size:${tx.h}px;line-height:1.02;letter-spacing:-.035em}
h1 em{font-style:normal;color:#ff3b44}
p{margin-top:16px;font-size:${tx.s}px;line-height:1.3;color:#e6e6e6}
`;
};
const html = (p, W, H, v) => `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H, v)}</style></head><body>
<div class="sc"><img src="file://${path.join(ART, 'c' + p.n + '.jpg')}"></div><div class="sh"></div>
<div class="tx"><span class="pill">Free Monday · só 30/11</span><h1>${p.h}</h1><p>${p.s}</p></div>
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
      const f = path.join(OUT, `vf-free-monday-${String(p.n).padStart(2, '0')}-${p.slug}-${tag}.png`);
      await pg.screenshot({ path: f }); fs.unlinkSync(hf); console.log(path.basename(f));
    }
  }
  await b.close();
})();
