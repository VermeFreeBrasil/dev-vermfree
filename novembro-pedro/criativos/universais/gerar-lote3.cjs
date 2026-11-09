// Estáticos universais · 3º lote (peças 25–32) · 09/11
// Regra da tarefa: falam só da Black e do maior desconto da história da VermeFree, SEM data, porcentagem ou nome de campanha.
// Visual aprovado na Verme Friday v5: fundo preto, cena fotográfica com os produtos reais (Higgsfield), faixa vermelha,
// título em tarja vermelha, rodapé branco. Uso: node gerar-lote3.cjs <pasta-das-imagens> [saida] [peças]
// A pasta precisa de: logo-shopify-medium.png, u25..u32.png (4:5), v25..v32.png (9:16) e uscenes.json.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const ART = process.argv[2];
const OUT = process.argv[3] || path.join(__dirname, 'png-lote3');
fs.mkdirSync(OUT, { recursive: true });
const SC = JSON.parse(fs.readFileSync(path.join(ART, 'uscenes.json'), 'utf8'));
const img = f => 'file://' + path.join(ART, f);

const pecas = [
  { n: 25, slug: 'a-maior-black', pill: 'Black VermeFree', big: 'A maior Black', h: 'da história da VermeFree.' },
  { n: 26, slug: 'gota-a-gota', pill: '100% vegetal', big: 'Gota a gota', h: 'o cuidado que a sua casa merece,<br>com o maior desconto da história.' },
  { n: 27, slug: 'natureza', pill: 'Sem metais pesados', big: 'Da natureza', h: 'ervas selecionadas, sem metais pesados,<br>com o maior desconto da história.' },
  { n: 28, slug: 'lua-nova', pill: 'No ritmo da lua nova', big: 'Seu próximo ciclo', h: 'começa com o maior desconto da história.', mode: 'none' },
  { n: 29, slug: 'casa-toda', pill: 'Adultos e crianças a partir de 2 anos', big: 'A casa toda', h: 'pelo menor preço da história da VermeFree.' },
  { n: 30, slug: 'preco-rasgado', pill: 'Black VermeFree', big: 'Preço rasgado', h: 'o maior desconto da história da VermeFree.' },
  { n: 31, slug: 'cuide-de-dentro', pill: '30 dias de protocolo', big: 'Cuide de dentro', h: 'com o maior desconto da história.' },
  { n: 32, slug: 'corre-pro-site', pill: 'Black VermeFree', big: 'Corre pro site', h: 'o maior desconto da história chegou.' },
];

const css = (W, H, p, key) => {
  const T = H > 1500, R = '#e01e26', [iw, ih, top, bot0] = SC[key], bot = Math.min(bot0, .95);
  const Y0 = T ? 840 : 470, Y1 = T ? 1590 : 1262, imH0 = W * ih / iw;
  let s = 1, imTop = 0;
  if (T) { s = Math.min(1, (Y1 - Y0) / ((bot - top + .03) * imH0)); imTop = Y0 - (top - .03) * imH0 * s; }
  else if (p.mode !== 'none') imTop = Math.max(0, Y0 - top * imH0);
  const imW = W * s, imH = imH0 * s;
  return `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
body{font-family:Inter,Arial,sans-serif;color:#fff;position:relative}
.sc{position:absolute;left:${(W - imW) / 2}px;top:${imTop}px;width:${imW}px;height:${imH}px;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent);mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent)}
.sc img{width:100%;height:100%;display:block;-webkit-mask-image:linear-gradient(180deg,transparent,#000 8%);mask-image:linear-gradient(180deg,transparent,#000 8%)}
.band{position:absolute;left:0;right:0;top:${T ? 236 : 0}px;height:${T ? 92 : 84}px;background:${R};display:flex;align-items:center;justify-content:space-between;padding:0 46px;z-index:3}
.band img{height:40px;filter:brightness(0) invert(1)}
.band .t{display:flex;align-items:center;gap:14px;font-weight:900;font-size:29px;letter-spacing:3px;text-transform:uppercase}
.band .t span{background:#000;padding:7px 14px;border-radius:8px;letter-spacing:1px;font-size:25px}
.c{position:absolute;top:${T ? 372 : 110}px;left:40px;right:40px;text-align:center;z-index:3}
.pill{display:inline-block;background:#fff;color:#000;border-radius:999px;padding:10px 30px;font-size:${T ? 27 : 25}px;font-weight:800;letter-spacing:.5px;text-transform:uppercase}
.big{margin-top:16px;font-size:${T ? 112 : 100}px;font-weight:900;letter-spacing:-.045em;line-height:1}
.big b{background:${R};padding:0 .16em;border-radius:14px}
h1{margin-top:14px;font-size:${T ? 46 : 40}px;font-weight:300;letter-spacing:-.02em;line-height:1.15;text-shadow:0 2px 12px #000}
.ft{position:absolute;left:0;right:0;bottom:${T ? 250 : 0}px;background:#fff;color:#000;padding:18px 24px;text-align:center;font-size:${T ? 27 : 25}px;font-weight:600;z-index:3}
.ft b{color:${R};font-weight:900}
`;
};

const html = (p, W, H, key) => `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H, p, key)}</style></head><body>
<div class="sc"><img src="${img(key + '.png')}"></div>
<div class="band"><img src="${img('logo-shopify-medium.png')}"><div class="t">Black VermeFree<span>No site</span></div></div>
<div class="c"><span class="pill">${p.pill}</span><div class="big"><b>${p.big}</b></div><h1>${p.h}</h1></div>
<div class="ft"><b>O maior desconto da história</b> da VermeFree · garanta o seu no site →</div>
</body></html>`;

(async () => {
  const b = await chromium.launch();
  const so = process.argv[4] ? process.argv[4].split(',').map(Number) : null;
  for (const [W, H, tag, pre] of [[1080, 1350, '4x5', 'u'], [1080, 1920, '9x16', 'v']]) {
    const pg = await b.newPage({ viewport: { width: W, height: H } });
    for (const p of pecas) {
      if (so && !so.includes(p.n)) continue;
      const key = pre + p.n;
      if (!SC[key]) { console.log('sem cena', key); continue; }
      const hf = path.join(ART, `lote3-${p.n}-${tag}.html`); fs.writeFileSync(hf, html(p, W, H, key));
      await pg.goto('file://' + hf, { waitUntil: 'load' }); await pg.waitForTimeout(150);
      const f = path.join(OUT, `vf-black-universal-${p.n}-${p.slug}-${tag}.png`);
      await pg.screenshot({ path: f }); console.log(f);
    }
    await pg.close();
  }
  await b.close();
})();
