// Verme Week (20 a 26/11) · 10 estáticos v2 (17/11) no estilo da referência do Pedro (cartaz de oferta: faixas
// inclinadas, número gigante, pílula "OFF", botão, rodapé com 3 benefícios, produtos nos cantos), em fundo preto com
// vermelho e branco. Produtos: recortes das fotos reais (assets/). Ficha v3: 12% (1) · 15% (3+) · 17% (5+), frete
// grátis ≥ R$ 299, 1 kit adulto de brinde > R$ 1.000. Uso: node gerar-vw2.cjs [peças] → png2/…-4x5.png e -9x16.png
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const A = f => 'file://' + path.join(__dirname, 'assets', f);
const OUT = path.join(__dirname, 'png2');
fs.mkdirSync(OUT, { recursive: true });
// e = produto da esquerda, d = da direita (arquivo, altura em px, rotação, desfoque)
const pecas = [
  { n: 1, slug: 'quanto-mais', badge: 'Só 7 dias', a: 'Quanto mais', b: 'maior o desconto', big: '17%', pill: 'OFF levando 5', body: '12% em 1 · 15% levando 3 · 17% levando 5', e: ['b-tintura.png', 430, -10], d: ['b-silimarina.png', 330, 12, 1] },
  { n: 2, slug: 'adulto', badge: 'Até 17% OFF', a: 'VermeFree', b: 'Adulto', big: 'R$ 305<small>,36</small>', pill: '−12%', body: 'de R$ 347,00 · levando 5, R$ 288,01 cada', e: ['b-ornitina.png', 300, -12, 1], d: ['crop-vf-pv2-adulto.png', 330, 8] },
  { n: 3, slug: 'kids-2a4', badge: 'Até 17% OFF', a: 'VermeFree Kids', b: '2 a 4 anos', big: 'R$ 237<small>,60</small>', pill: '−12%', body: 'de R$ 270,00 · até 17% OFF levando 5', e: ['b-kids-fito.png', 400, -10, 1], d: ['crop-vf-pv2-kids-2a4.png', 420, 7] },
  { n: 4, slug: 'kids-5a9', badge: 'Até 17% OFF', a: 'VermeFree Kids', b: '5 a 9 anos', big: 'R$ 342<small>,32</small>', pill: '−12%', body: 'de R$ 389,00 · até 17% OFF levando 5', e: ['b-kids-tintura.png', 420, -9], d: ['crop-vf-pv2-kids-5a9.png', 420, 8, 1] },
  { n: 5, slug: 'kit-familia', badge: '+ brinde', a: 'A casa toda', b: 'Kit Família', big: 'R$ 1.012', pill: '+ kit adulto', body: 'Kit Família com 12% OFF e 1 kit adulto de brinde (acima de R$ 1.000)', e: ['b-kids-tintura.png', 360, -12, 1], d: ['crop-vf-pv2-kit-familia-v3.png', 400, 6] },
  { n: 6, slug: 'frete-gratis', badge: 'Até 17% OFF', a: 'Frete grátis', b: 'acima de', big: 'R$ 299', pill: '1 Adulto já passa', body: 'O Protocolo Adulto sai por R$ 305,36 na Verme Week', e: ['b-oleo.png', 320, -14, 1], d: ['b-tintura.png', 440, 10] },
  { n: 7, slug: 'brinde', badge: 'Acima de R$ 1.000', a: 'Ganhe', b: 'de presente', big: '+1', pill: 'kit adulto', body: '1 kit adulto de brinde nas compras acima de R$ 1.000', e: ['crop-vf-pv2-adulto.png', 300, -8, 1], d: ['crop-vf-pv2-adulto.png', 330, 8] },
  { n: 8, slug: '7-dias', badge: '20 a 26/11', a: 'Verme Week', b: 'só até 26/11', big: '7', pill: 'dias', body: 'De 20 a 26/11 · acaba 26/11 às 23h59', e: ['b-silimarina.png', 320, -12], d: ['b-tintura.png', 440, 9, 1] },
  { n: 9, slug: 'leve-5', badge: '+ brinde', a: 'Levando 5', b: '17% OFF em tudo', big: 'R$ 1.440', pill: '5 Adultos', body: 'R$ 288,01 cada + 1 kit adulto de brinde', e: ['b-tintura.png', 430, -10], d: ['crop-vf-pv2-adulto.png', 330, 8, 1] },
  { n: 10, slug: 'pode-misturar', badge: 'Até 17% OFF', a: 'Pode', b: 'misturar', big: '15%', pill: 'com 3 itens', body: 'Adulto + Kids na mesma conta: 3 itens, 15% · 5 itens, 17%', e: ['b-kids-tintura.png', 400, -10], d: ['b-tintura.png', 430, 10, 1] },
];
const prod = (x, lado) => `<img class="pr ${lado}${x[3] ? ' bl' : ''}" style="height:${x[1]}px;transform:rotate(${x[2]}deg)" src="${A(x[0])}">`;
const css = (W, H, v) => `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#050505}
body{font-family:Inter,Arial,sans-serif;color:#fff;position:relative}
.fr{position:absolute;left:0;right:0;top:${v ? 270 : 0}px;height:${v ? 1266 : 1350}px;overflow:hidden;
  background:linear-gradient(135deg,transparent 0 30%,#ffffff07 30% 52%,transparent 52%),linear-gradient(225deg,transparent 0 58%,#e01e2614 58% 76%,transparent 76%),radial-gradient(ellipse 70% 45% at 50% 42%,#2a0608 0,transparent 70%)}
.top{position:absolute;left:56px;right:56px;top:46px;display:flex;justify-content:space-between;align-items:flex-start}
.logo{height:46px;filter:brightness(0) invert(1);margin-top:8px}
.tag{text-align:center;flex:1;margin:0 20px}
.tag b{display:block;font-size:64px;font-weight:900;letter-spacing:-.03em;line-height:1}
.tag i{font-style:normal;display:block;margin-top:10px;font-size:20px;font-weight:700;letter-spacing:.32em;color:#cfcfcf}
.badge{background:#e01e26;color:#fff;font-weight:900;font-size:22px;text-transform:uppercase;letter-spacing:.03em;padding:14px 22px;border-radius:40px;transform:rotate(-8deg);box-shadow:0 10px 30px #e01e2655;white-space:nowrap;margin-top:6px}
.mid{position:absolute;left:0;right:0;top:250px;display:flex;flex-direction:column;align-items:center;z-index:3}
.a{background:#fff;color:#0b0b0b;font-weight:900;font-size:50px;text-transform:uppercase;padding:8px 34px;transform:rotate(-4deg) skewX(-6deg);margin-right:120px;letter-spacing:-.01em}
.b{background:#e01e26;color:#fff;font-weight:900;font-size:84px;line-height:1.02;text-transform:uppercase;padding:10px 40px 14px;transform:rotate(-4deg) skewX(-6deg);border-radius:18px;margin-top:-6px;letter-spacing:-.03em;max-width:980px;text-align:center}
.big{margin-top:24px;font-weight:900;font-size:230px;line-height:.9;letter-spacing:-.05em;color:#fff;text-shadow:10px 10px 0 #e01e26,12px 12px 0 #000;transform:rotate(-3deg)}
.big small{font-size:110px}
.pill{background:#fff;color:#0b0b0b;font-weight:900;font-size:62px;text-transform:uppercase;padding:6px 44px 10px;border-radius:30px;transform:rotate(-5deg);margin-top:-12px;letter-spacing:-.02em;box-shadow:0 14px 34px #0009}
.body{margin-top:30px;max-width:640px;text-align:center;font-size:27px;line-height:1.35;color:#e8e8e8}
.cta{margin-top:26px;background:#e01e26;color:#fff;font-weight:900;font-size:30px;text-transform:uppercase;letter-spacing:.04em;padding:18px 54px;border-radius:50px;box-shadow:0 0 0 6px #e01e2633}
.url{margin-top:12px;font-weight:700;font-size:22px;color:#fff}
.pr{position:absolute;bottom:140px;z-index:2;filter:drop-shadow(0 24px 30px #000)}
.pr.e{left:-30px}.pr.d{right:-30px}
.pr.bl{filter:blur(3px) drop-shadow(0 24px 30px #000)}
.ft{position:absolute;left:0;right:0;bottom:0;height:120px;background:#121212;border-top:2px solid #e01e26;display:flex;align-items:center;justify-content:space-around;z-index:4}
.ft div{display:flex;align-items:center;gap:14px;font-size:21px;font-weight:600;color:#eee;line-height:1.2}
.ft i{width:46px;height:46px;border-radius:50%;background:#e01e26;display:grid;place-items:center;font-style:normal;font-size:22px;flex:0 0 46px}
.ft div+div{border-left:1px solid #333;padding-left:28px}
`;
const html = (p, W, H, v) => `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H, v)}</style></head><body><div class="fr">
<div class="top"><img class="logo" src="${A('logo-shopify-medium.png')}"><div class="tag"><b>Verme Week</b><i>20 a 26/11 · site todo</i></div><div class="badge">${p.badge}</div></div>
${prod(p.e, 'e')}${prod(p.d, 'd')}
<div class="mid"><div class="a">${p.a}</div><div class="b">${p.b}</div><div class="big">${p.big}</div><div class="pill">${p.pill}</div>
<p class="body">${p.body}</p><div class="cta">Comprar no site</div><div class="url">vermefree.com.br</div></div>
<div class="ft"><div><i>🚚</i>Frete grátis<br>acima de R$ 299</div><div><i>🎁</i>Kit adulto de brinde<br>acima de R$ 1.000</div><div><i>✓</i>Desconto automático<br>no carrinho</div></div>
</div></body></html>`;
(async () => {
  const b = await chromium.launch();
  const so = process.argv[2] ? process.argv[2].split(',').map(Number) : null;
  for (const [W, H, tag, v] of [[1080, 1350, '4x5', 0], [1080, 1920, '9x16', 1]]) {
    const pg = await b.newPage({ viewport: { width: W, height: H } });
    for (const p of pecas) {
      if (so && !so.includes(p.n)) continue;
      const hf = path.join(__dirname, 'assets', `_p${p.n}-${tag}.html`); fs.writeFileSync(hf, html(p, W, H, v));
      await pg.goto('file://' + hf, { waitUntil: 'load' }); await pg.waitForTimeout(250);
      await pg.screenshot({ path: path.join(OUT, `vf-verme-week-${String(p.n).padStart(2, '0')}-${p.slug}-${tag}.png`) }); fs.unlinkSync(hf);
    }
  }
  await b.close();
})();
