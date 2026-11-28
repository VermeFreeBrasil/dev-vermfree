// Estáticos universais · 3º lote (25–32) · versão com FOTOS REAIS do site (pedido do Pedro em 09/11, depois de reprovar as cenas de IA).
// Foto em tela cheia (produto real, rótulo real), etiqueta preta "Black VermeFree", selo vermelho, degradê preto embaixo com o título.
// Regra da tarefa: sem data, porcentagem ou nome de campanha; só Black e "maior desconto da história".
// Uso: node gerar-lote3-fotos.cjs <pasta-das-fotos> <pasta-das-imagens(logo)> [saida]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const FOT = process.argv[2], ART = process.argv[3];
const OUT = process.argv[4] || path.join(__dirname, 'png-lote3-fotos');
fs.mkdirSync(OUT, { recursive: true });
const f = n => 'file://' + path.join(FOT, 'full-' + n);
const img = n => 'file://' + path.join(ART, n);

// pos: posição da foto (CSS object-position); st: onde fica o selo
const pecas = [
  { n: 25, slug: 'a-maior-black', foto: 'IMG_4384-scaled.jpg', pos: '50% 60%', card: 1, st: 'tr', h: 'A maior Black<br>da história<br>da <b>VermeFree.</b>', s: 'O kit completo de 30 dias pelo menor preço que a gente já fez.' },
  { n: 26, slug: 'abraco', foto: 'asset-03-foto-beijo.png', pos: '50% 30%', st: 'tl', h: 'Um abraço<br>na sua <b>saúde.</b>', s: 'Agora com o maior desconto da história da VermeFree.' },
  { n: 27, slug: 'rotina', foto: '02-carrossel.png', pos: '50% 20%', st: 'tr', h: 'Cabe na rotina.<br>Cabe no <b>bolso.</b>', s: 'A Black VermeFree chegou com o maior desconto da história.' },
  { n: 28, slug: 'casa-toda', foto: '07-carrossel.png', pos: '50% 20%', st: 'tl', h: 'Da mãe<br>às <b>crianças.</b>', s: 'Protocolos para a casa toda, com o maior desconto da história.' },
  { n: 29, slug: 'kids', foto: 'IMG_4386-scaled.jpg', pos: '50% 55%', card: 1, st: 'tr', h: 'Os pequenos<br>também <b>entram.</b>', s: 'VermeFree Kids, a partir de 2 anos, no maior desconto da história.' },
  { n: 30, slug: 'menor-preco', foto: 'pdp-adulto-01-oregano-frontal_4ca010ec-4d8e-4631-a011-f41c81e3672a.jpg', pos: '50% 50%', card: 1, st: 'tl', h: 'O menor preço<br>que a VermeFree<br>já <b>fez.</b>', s: 'É Black. E é só no site.' },
  { n: 31, slug: 'sem-idade', foto: 'ugc-05-adulto-senhora.png', pos: '50% 25%', st: 'tr', h: 'Cuidar de dentro<br>não tem <b>idade.</b>', s: 'O maior desconto da história da VermeFree é agora.' },
  { n: 32, slug: 'seu-momento', foto: 'video2-adulto-holistica.png', pos: '50% 45%', st: 'tr', h: 'Seu momento.<br>Seu <b>ciclo.</b>', s: 'Comece o próximo com o maior desconto da história.' },
];

const css = (W, H, p) => {
  const T = H > 1500, R = '#e01e26', top = T ? 250 : 48, bot = T ? 300 : 56;
  const stPos = p.st === 'tl' ? `left:44px` : `right:44px`;
  return `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
body{font-family:Inter,Arial,sans-serif;color:#fff;position:relative}
${p.card ? `.ph{position:absolute;left:110px;right:110px;top:${T ? 560 : 330}px;height:${T ? 820 : 640}px;width:860px;object-fit:cover;object-position:${p.pos};border-radius:26px;box-shadow:0 30px 60px #000;transform:rotate(-2deg);border:10px solid #fff}`
  : T ? `.ph{position:absolute;left:0;top:120px;width:1080px;height:1341px;object-fit:cover;object-position:${p.pos}}`
  : `.ph{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${p.pos}}`}
${p.card ? `.gr{display:none}body{background:radial-gradient(ellipse 80% 50% at 50% 50%,#1c1c1c,#000)}` : T ? `.gr{position:absolute;left:0;right:0;top:${120+1341-700}px;height:700px;background:linear-gradient(180deg,transparent,#000 85%)}` : `.gr{position:absolute;left:0;right:0;bottom:0;height:58%;background:linear-gradient(180deg,transparent 0,#000a 35%,#000e 70%,#000 100%)}`}
.tag{position:absolute;top:${top}px;${p.st === 'tl' ? 'right:44px' : 'left:44px'};display:flex;align-items:center;gap:12px;background:#000;padding:12px 20px;border-radius:10px;font-weight:900;font-size:24px;letter-spacing:3px;text-transform:uppercase;box-shadow:0 8px 24px #0008}
.tag i{width:12px;height:12px;border-radius:50%;background:${R};box-shadow:0 0 10px ${R}}
.tag img{height:30px;filter:brightness(0) invert(1)}
.st{position:absolute;top:${top - 6}px;${stPos};width:${T ? 200 : 186}px;height:${T ? 200 : 186}px;border-radius:50%;background:${R};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;
  transform:rotate(-10deg);box-shadow:0 12px 30px #0009;border:4px solid #fff;text-transform:uppercase;font-weight:900;line-height:1.02}
.st small{font-size:${T ? 17 : 16}px;letter-spacing:1px}.st b{font-size:${T ? 30 : 28}px;letter-spacing:-.01em}
${p.card ? `.tx{position:absolute;left:56px;right:56px;top:${T ? 330 : 128}px;text-align:center}.tx h1{font-size:${T ? 76 : 64}px}.tx h1 br{display:none}.tx .s{margin:12px auto 0;font-size:${T ? 28 : 25}px}.cta{left:0;right:0;justify-content:center}` : `.tx{position:absolute;left:56px;right:56px;bottom:${bot + (T ? 110 : 104)}px}`}
h1{font-size:${T ? 92 : 84}px;font-weight:900;letter-spacing:-.04em;line-height:.98}
h1 b{color:#fff;background:${R};padding:0 .12em;border-radius:10px}
.s{margin-top:18px;font-size:${T ? 32 : 29}px;line-height:1.3;opacity:.92;max-width:900px}
.cta{position:absolute;left:56px;bottom:${bot}px;display:flex;align-items:center;gap:16px}
.cta span{background:#fff;color:#000;font-weight:900;font-size:${T ? 30 : 28}px;padding:18px 34px;border-radius:999px;text-transform:uppercase;letter-spacing:.5px}
.cta em{font-style:normal;font-size:${T ? 24 : 22}px;opacity:.85;letter-spacing:1px;text-transform:uppercase;font-weight:700}
`;
};

const html = (p, W, H) => `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H, p)}</style></head><body>
<img class="ph" src="${f(p.foto)}">
<div class="gr"></div>
<div class="tag"><i></i><img src="${img('logo-shopify-medium.png')}">Black</div>
<div class="st"><small>O maior</small><b>desconto</b><small>da história</small></div>
<div class="tx"><h1>${p.h}</h1><p class="s">${p.s}</p></div>
<div class="cta"><span>Garantir no site →</span><em>Só no site</em></div>
</body></html>`;

(async () => {
  const b = await chromium.launch();
  for (const [W, H, tag] of [[1080, 1350, '4x5'], [1080, 1920, '9x16']]) {
    const pg = await b.newPage({ viewport: { width: W, height: H } });
    for (const p of pecas) {
      const hf = path.join(FOT, `lf-${p.n}-${tag}.html`); fs.writeFileSync(hf, html(p, W, H));
      await pg.goto('file://' + hf, { waitUntil: 'load' }); await pg.waitForTimeout(150);
      const o = path.join(OUT, `vf-black-universal-${p.n}-${p.slug}-${tag}.png`);
      await pg.screenshot({ path: o }); console.log(o);
    }
    await pg.close();
  }
  await b.close();
})();
