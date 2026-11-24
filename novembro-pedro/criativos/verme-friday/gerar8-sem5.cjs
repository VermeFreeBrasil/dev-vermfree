// Verme Friday · 10 estáticos novos (16/11) no estilo da referência do Pedro (título grande em branco brilhante,
// oferta em branco, produto real em superfície iluminada). Sem copiar a referência: cenas próprias (Higgsfield com as
// fotos reais dos produtos), preto/vermelho/branco, uma composição diferente por peça.
// v8 (24/11): sem preço e sem o 5º grátis (saiu da oferta). Urgência, desejo, benefício e dor.
// Uso: node gerar8-sem5.cjs [peças]   → png6/vf-verme-friday-v8-NN-<slug>-9x16.png e -4x5.png
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const ART = path.join(__dirname, 'cenas6');
const OUT = path.join(__dirname, 'png8');
fs.mkdirSync(OUT, { recursive: true });
const img = f => 'file://' + path.join(ART, f);
const brl = c => 'R$ ' + (c / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const off = c => c - Math.floor(c * 18 / 100);
const p3 = c => brl(Math.floor(c / 3)); // igual ao site (arredonda para baixo)
const P = { adulto: 34700, k24: 27000, k59: 38900, fam: 115000 };
const cinco = 4 * off(P.adulto);
// topo do produto em cada cena (fração da altura), medido na prova
const TOPO = { 1: .485, 2: .467, 3: .433, 4: .47, 5: .40, 6: .59, 7: .404, 8: .466, 9: .41, 10: .44 };
const BASE = { 1: .86, 2: .80, 3: .95, 4: .90, 5: .93, 6: .82, 7: .95, 8: .95, 9: .97, 10: .97 }; // base do produto

// e = texto da esquerda (grande), d = texto da direita (menor). <b> = destaque em vermelho.
const pecas = [
  { n: 1, c: 8, slug: 'so-48h', e: 'Só<br>48 horas', d: 'acaba 28/11<br>às 23h59' },
  { n: 2, c: 1, slug: '18-off', e: '18% OFF<br>no site todo', d: 'só 27<br>e 28/11' },
  { n: 3, c: 3, slug: 'fez-e-voltou', e: 'Fez e<br>voltou?', d: 'se só um faz,<br>volta pra casa' },
  { n: 4, c: 2, slug: 'deixou-pra-depois', e: 'De novo<br>pra depois?', d: 'a Black<br>acaba 28/11' },
  { n: 5, c: 7, slug: 'em-fases', e: 'Em fases,<br>não dose única', d: 'o protocolo<br>completo' },
  { n: 6, c: 9, slug: '100-tipos', e: '+100 tipos<br>de vermes', d: 'e parasitas<br>num protocolo' },
  { n: 7, c: 5, slug: 'casa-toda', e: 'A casa toda<br>num pedido', d: 'cada um no<br>seu protocolo' },
  { n: 8, c: 6, slug: 'frete-gratis', e: 'Frete grátis<br>sem mínimo', d: 'até em<br>1 protocolo' },
  { n: 9, c: 4, slug: 'comece-2027', e: 'Comece 2027<br>desparasitado', d: '18% OFF<br>só 27 e 28/11' },
  { n: 10, c: 10, slug: 'sorteio', e: 'Sorteio de<br>um protocolo', d: 'entre os 300<br>primeiros pedidos' },
];

const css = (W, H, v, n) => {
  const imH = W * 1344 / 752;
  const t = v ? { top: 285, fs: 236, lh: .86, ft: 712, of: 790, ofs: 62, ds: 40, prod: 950 } : { top: 46, fs: 196, lh: .86, ft: 400, of: 470, ofs: 52, ds: 34, prod: 600 };
  // 4:5: reduz a cena para o produto inteiro caber entre o texto e a borda de baixo
  const s = v ? 1 : Math.min(1, (H - 20 - t.prod) / ((BASE[n] - TOPO[n]) * imH));
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
const html = (p, W, H, v) => `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H, v, p.c)}</style></head><body>
<div class="sc"><img src="${img('c' + p.c + '.jpg')}"></div><div class="sh"></div>
<h1 class="glow"><span>Verme</span><span>Friday</span></h1>
<div class="of glow"><div class="e">${p.e}</div><div class="d">${p.d}</div></div>
<div class="ft"><p>18% OFF · frete grátis · só 27 e 28/11</p></div>
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
      const f = path.join(OUT, `vf-verme-friday-v8-${String(p.n).padStart(2, '0')}-${p.slug}-${tag}.png`);
      await pg.screenshot({ path: f }); fs.unlinkSync(hf); console.log(path.basename(f));
    }
  }
  await b.close();
})();
