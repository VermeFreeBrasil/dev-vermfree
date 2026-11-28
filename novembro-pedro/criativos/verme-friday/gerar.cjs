// 10 estáticos de venda da Verme Friday (27 e 28/11), no estilo da referência enviada pelo Pedro em 09/11
// (fundo verde liso de estúdio, marca no canto, selo em pílula, título grande e produto sobre pedra),
// com mais destaque para o desconto e as condições.
// Oferta (ficha v3 do Vitor): 18% OFF no site todo · compre 4 leve 5 (soma com os 18%) · frete grátis sem mínimo ·
// sorteio de um kit entre os 300 primeiros pedidos · guia + manual digitais para quem comprar em 27 ou 28/11.
// Uso: node gerar.cjs <pasta-das-imagens> [saida]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const ART = process.argv[2];
const OUT = process.argv[3] || path.join(__dirname, 'png');
fs.mkdirSync(OUT, { recursive: true });
const img = f => 'file://' + path.join(ART, f);
const brl = c => 'R$ ' + (c / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
// 18% OFF com centavos para baixo (igual ao carrinho); 3x sem juros
const off = c => c - Math.floor(c * 18 / 100);
const p3 = c => brl(Math.round(c / 3));

const P = { adulto: 34700, k24: 27000, k59: 38900, fam: 115000 };
const cinco = 5 * off(P.adulto) - off(P.adulto); // 5 Adultos: 18% em tudo e o 5º grátis

const pecas = [
  { n: 1, slug: 'maior-desconto', pill: '18% OFF + 5º GRÁTIS', h: 'O maior desconto<br>do ano <b>voltou.</b>', s: 'Só no site, só em 27 e 28/11.', v: 'pedestal' },
  { n: 2, slug: 'compre4-leve5', pill: 'COMPRE 4, LEVE 5', h: 'Leve 5 protocolos,<br><b>pague 4.</b>', s: 'E o 5º grátis ainda soma com os 18% OFF.', v: 'pedestal' },
  { n: 3, slug: 'adulto', pill: '18% OFF + 5º GRÁTIS', h: 'VermeFree <b>Adulto</b>', s: 'Protocolo natural de 30 dias', v: 'produto', foto: 'vf-pv2-adulto.png', de: P.adulto },
  { n: 4, slug: 'kids-2a4', pill: '18% OFF + 5º GRÁTIS', h: 'VermeFree <b>Kids</b> 2 a 4', s: 'Dose certa para os pequenos', v: 'produto', foto: 'vf-pv2-kids-2a4.png', de: P.k24 },
  { n: 5, slug: 'kids-5a9', pill: '18% OFF + 5º GRÁTIS', h: 'VermeFree <b>Kids</b> 5 a 9', s: 'Dose certa para a idade', v: 'produto', foto: 'vf-pv2-kids-5a9.png', de: P.k59 },
  { n: 6, slug: 'kit-familia', pill: '18% OFF + 5º GRÁTIS', h: '<b>Kit Família</b>', s: '2 adultos + 2 crianças, no mesmo ciclo', v: 'produto', foto: 'vf-pv2-kit-familia-v3.png', de: P.fam },
  { n: 7, slug: 'casa-toda', pill: 'ATÉ 34% OFF LEVANDO 5', h: '5 Adultos por<br><b>' + brl(cinco) + '</b>', s: 'De ' + brl(5 * P.adulto) + '. Você economiza ' + brl(5 * P.adulto - cinco) + '.', v: 'produto', foto: 'vf-pv2-adulto.png', x: '×5' },
  { n: 8, slug: 'frete-gratis', pill: 'FRETE GRÁTIS SEM MÍNIMO', h: 'Frete grátis<br><b>em qualquer pedido.</b>', s: 'Para todo o Brasil, mesmo levando 1 protocolo.', v: 'pedestal' },
  { n: 9, slug: 'sorteio', pill: 'SORTEIO · 300 PRIMEIROS', h: 'Os 300 primeiros<br>concorrem a <b>um kit.</b>', s: 'Um kit VermeFree à sua escolha, sorteado entre os 300 primeiros pedidos.', v: 'pedestal' },
  { n: 10, slug: 'so-2-dias', pill: 'SÓ 27 E 28/11', h: 'Dois dias.<br><b>Depois, acabou.</b>', s: 'Quem comprar ganha o guia de alimentos e o manual da desparasitação.', v: 'pedestal' },
];

const css = (W, H) => {
  const T = H > 1500, k = T ? 1.08 : 1;
  return `
@font-face{font-family:Capra;src:url('${img('Caprasimo-Regular.ttf')}')}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{font-family:Inter,Arial,sans-serif;color:#fff;position:relative;
  background:linear-gradient(180deg,#0f2f22 0%,#123a2a ${T ? 60 : 62}%,#1b4d39 ${T ? 60 : 62}%,#164331 100%)}
body:after{content:'';position:absolute;left:0;right:0;top:${T ? 60 : 62}%;height:140px;background:linear-gradient(180deg,#0003,transparent)}
.hd{position:absolute;top:${T ? 230 : 54}px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:flex-start;z-index:3}
.hd img{height:${T ? 62 : 56}px;filter:brightness(0) invert(1)}
.hd .r{text-align:right;font-size:${25 * k}px;line-height:1.25;letter-spacing:.5px}
.hd .r b{display:block;font-weight:800;letter-spacing:2px}
.c{position:absolute;top:${T ? 370 : 168}px;left:60px;right:60px;text-align:center;z-index:3}
.pill{display:inline-block;background:#c0de96;color:#0c2219;border-radius:999px;padding:${14 * k}px ${40 * k}px;font-weight:900;font-size:${38 * k}px;letter-spacing:1px;
  box-shadow:0 10px 30px #0006}
h1{margin-top:${T ? 44 : 30}px;font-weight:400;font-size:${T ? 88 : 78}px;line-height:1.08;letter-spacing:-.02em}
h1 b{font-weight:800;color:#c0de96}
.s{margin-top:${T ? 22 : 16}px;font-size:${T ? 32 : 29}px;opacity:.88;line-height:1.3}
.preco{margin-top:${T ? 30 : 20}px;display:flex;align-items:baseline;justify-content:center;gap:20px}
.de{font-size:${T ? 36 : 32}px;opacity:.7;text-decoration:line-through}
.por{font-size:${T ? 92 : 78}px;font-weight:900;letter-spacing:-.03em;color:#fff}
.parc{margin-top:4px;font-size:${T ? 34 : 30}px;font-weight:600}
.parc b{color:#c0de96}
.v{position:absolute;left:0;right:0;z-index:2;display:flex;justify-content:center;align-items:flex-end}
.v.pedestal{bottom:${T ? 590 : 200}px;height:${T ? 600 : 620}px}
.v.pedestal img{height:100%;filter:drop-shadow(0 30px 30px #0008)}
.v.produto{bottom:${T ? 600 : 195}px;height:${T ? 620 : 640}px}
.v .x{position:absolute;right:23%;top:6%;width:${T ? 130 : 120}px;height:${T ? 130 : 120}px;border-radius:50%;background:#c0de96;color:#0c2219;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:${T ? 54 : 50}px;box-shadow:0 10px 30px #0007;z-index:3}
.v.produto img{height:100%;filter:drop-shadow(0 30px 34px #000a)}
.ft{position:absolute;left:44px;right:44px;bottom:${T ? 400 : 44}px;z-index:3}
.cond{display:flex;gap:12px;justify-content:center}
.cond div{flex:1;background:#0c2219e6;border:1.5px solid #c0de9655;border-radius:18px;padding:${16 * k}px 10px;text-align:center;font-size:${22 * k}px;line-height:1.25}
.cond b{display:block;font-size:${27 * k}px;font-weight:800;color:#c0de96}
.cta{margin-top:14px;height:${T ? 92 : 82}px;border-radius:999px;background:#5ebc43;display:flex;align-items:center;justify-content:center;
  font-size:${T ? 36 : 33}px;font-weight:900;letter-spacing:.3px;box-shadow:0 14px 36px #0007}
`;
};

const html = (p, W, H) => `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H)}</style></head><body>
<div class="hd"><img src="${img('logo-shopify-medium.png')}"><div class="r"><b>VERME FRIDAY</b>27 e 28/11 · no site</div></div>
<div class="c">
  <span class="pill">${p.pill}</span>
  <h1>${p.h}</h1>
  ${p.de ? `<div class="preco"><span class="de">${brl(p.de)}</span><span class="por">${brl(off(p.de))}</span></div><div class="parc">ou <b>3x de ${p3(off(p.de))}</b> sem juros</div>` : `<p class="s">${p.s}</p>`}
</div>
<div class="v ${p.v}">${p.x ? `<span class="x">${p.x}</span>` : ''}<img src="${img(p.v === 'pedestal' ? 'vf-hero-pedestal.png' : p.foto)}"></div>
<div class="ft">
  <div class="cond">
    <div><b>18% OFF</b>em todo o site</div>
    <div><b>5º grátis</b>levando 5</div>
    <div><b>Frete grátis</b>sem valor mínimo</div>
  </div>
  <div class="cta">Comprar com 18% OFF →</div>
</div>
</body></html>`;

(async () => {
  const b = await chromium.launch();
  const so = process.argv[4] ? process.argv[4].split(',').map(Number) : null;
  for (const [W, H, tag] of [[1080, 1350, '4x5'], [1080, 1920, '9x16']]) {
    const pg = await b.newPage({ viewport: { width: W, height: H } });
    for (const p of pecas) {
      if (so && !so.includes(p.n)) continue;
      const hf = path.join(ART, `vfr-${p.n}-${tag}.html`); fs.writeFileSync(hf, html(p, W, H));
      await pg.goto('file://' + hf, { waitUntil: 'load' });
      await pg.waitForTimeout(150);
      const f = path.join(OUT, `vf-verme-friday-${String(p.n).padStart(2, '0')}-${p.slug}-${tag}.png`);
      await pg.screenshot({ path: f });
      console.log(f);
    }
    await pg.close();
  }
  await b.close();
})();
