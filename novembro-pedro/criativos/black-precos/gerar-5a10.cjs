// Estáticos de venda do 11/11, peças 05–10 (03/11): mesmo visual Black das peças 01–04, cada uma com um argumento da oferta.
// Uso: node gerar-5a10.cjs <pasta-das-imagens> [saida]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const ART = process.argv[2];
const OUT = process.argv[3] || path.join(__dirname, 'png');
fs.mkdirSync(OUT, { recursive: true });
const img = f => 'file://' + path.join(ART, f);

const pecas = [
  { n: 5, slug: 'compre4-leve5', tag: '20% OFF + compre 4, leve 5', big: 'Leve <em>5</em>,<br>pague 4', sub: 'Além dos 20% OFF em tudo, o 5º produto sai de graça (o de menor valor).', foto: 'vf-pv2-kit-familia-v3.png', btn: 'Montar meus 5' },
  { n: 6, slug: 'cashback', tag: 'Só para os 100 primeiros pedidos', big: '<em>15%</em><br>de volta', sub: 'Cashback de 15% do valor pago para usar até 30/11. Depois do 100º pedido, acabou.', foto: 'vf-pv2-adulto.png', btn: 'Quero estar entre os 100', chip: '100' },
  { n: 7, slug: 'sorteio', tag: 'Entre os 300 primeiros pedidos', big: 'Concorra a um<br><em>kit completo</em>', sub: 'Os 300 primeiros pedidos do 11/11 entram no sorteio de um kit VermeFree.', foto: 'vf-pv2-kit-familia-v3.png', btn: 'Garantir meu número', chip: '300' },
  { n: 8, slug: 'frete-gratis', tag: 'Para todo o Brasil', big: 'Frete <em>grátis</em><br>sem mínimo', sub: 'E 20% OFF no site todo: Adulto, Kids e Kit Família. Só no dia 11/11.', foto: 'vf-pv2-adulto.png', btn: 'Comprar com frete grátis' },
  { n: 9, slug: 'so-24h', tag: '11/11 · das 00h às 23h59', big: '<em>24 horas.</em><br>Depois, acabou.', sub: 'O maior desconto da história da VermeFree dura um dia só. Grupo VIP entra à 00h.', foto: 'vf-pv2-kit-familia-v3.png', btn: 'Comprar agora', relogio: 1 },
  { n: 10, slug: 'ultima-chamada', tag: 'Últimas horas do 11/11', big: 'Acaba à<br><em>meia-noite</em>', sub: '20% OFF, compre 4 leve 5 e frete grátis. Às 23h59, tudo volta ao preço normal.', foto: 'vf-pv2-adulto.png', btn: 'Garantir antes de acabar', urg: 1 },
];

const css = (W, H) => {
  const T = H > 1500;
  return `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{font-family:Inter,Arial,sans-serif;color:#fff;background:#060606;
  background-image:radial-gradient(ellipse 70% 45% at 50% ${T ? 52 : 55}%,#3a0709 0,#1a0405 45%,#060606 75%)}
.top{position:absolute;left:0;right:0;top:0;height:${T ? 74 : 64}px;background:#e01e26;display:flex;align-items:center;justify-content:center;gap:18px;
  font-weight:900;font-size:${T ? 28 : 25}px;letter-spacing:4px;text-transform:uppercase}
.top i{width:10px;height:10px;border-radius:50%;background:#fff;display:block}
body.urg .top{background:repeating-linear-gradient(-45deg,#e01e26 0 26px,#b5121b 26px 52px)}
.c{position:absolute;inset:${T ? '150px 70px 170px' : '96px 64px 48px'};display:flex;flex-direction:column;align-items:center;text-align:center}
.logo{height:${T ? 60 : 50}px;filter:brightness(0) invert(1)}
.tag{margin-top:${T ? 26 : 18}px;display:inline-block;border:2px solid #ff2a33;border-radius:40px;padding:8px 22px;font-size:${T ? 25 : 22}px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:#ff4d55}
h1{margin-top:${T ? 24 : 16}px;font-size:${T ? 108 : 90}px;line-height:.98;font-weight:900;letter-spacing:-.045em}
h1 em{font-style:normal;color:#ff2a33;text-shadow:0 0 50px #ff1e2766}
.sub{margin-top:${T ? 22 : 14}px;font-size:${T ? 32 : 28}px;line-height:1.35;color:#cfcfcf;max-width:900px}
.v{flex:1;min-height:0;width:100%;display:flex;align-items:center;justify-content:center;position:relative;margin:${T ? 18 : 8}px 0}
.v img{max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 30px 40px #000c)}
.chip{position:absolute;right:6%;top:6%;width:${T ? 190 : 160}px;height:${T ? 190 : 160}px;border-radius:50%;background:#e01e26;display:flex;flex-direction:column;align-items:center;justify-content:center;
  font-weight:900;font-size:${T ? 76 : 64}px;line-height:.9;box-shadow:0 14px 40px #e01e2777;transform:rotate(-8deg)}
.chip small{font-size:.3em;letter-spacing:2px;text-transform:uppercase;margin-top:6px}
.relogio{display:flex;gap:14px;margin-bottom:${T ? 26 : 14}px}
.relogio div{background:#161616;border:2px solid #2a2a2a;border-radius:16px;padding:${T ? '14px 22px' : '10px 18px'};min-width:${T ? 170 : 150}px}
.relogio b{display:block;font-size:${T ? 48 : 40}px;font-weight:900}
.relogio small{font-size:${T ? 20 : 18}px;color:#aaa;letter-spacing:1px;text-transform:uppercase}
.relogio div.r{border-color:#ff2a33}
.relogio div.r b{color:#ff2a33}
.btn{width:100%;max-width:860px;height:${T ? 112 : 96}px;border-radius:80px;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(180deg,#ff2f38,#c2121b);font-size:${T ? 42 : 36}px;font-weight:900;box-shadow:0 18px 44px #e01e2766;flex-shrink:0}
.foot{margin-top:${T ? 18 : 12}px;font-size:${T ? 24 : 21}px;color:#a8a8a8;letter-spacing:1px;flex-shrink:0}
.foot b{color:#fff}
`;
};

const html = (p, W, H) => `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H)}</style></head><body class="${p.urg ? 'urg' : ''}">
<div class="top"><i></i>${p.urg ? 'Última chamada · 11.11' : 'Black VermeFree · 11.11'}<i></i></div>
<div class="c">
<img class="logo" src="${img('logo-shopify-medium.png')}">
<p class="tag">${p.tag}</p>
<h1>${p.big}</h1>
<p class="sub">${p.sub}</p>
<div class="v"><img src="${img(p.foto)}">${p.chip ? `<span class="chip">${p.chip}<small>primeiros</small></span>` : ''}</div>
${p.relogio ? '<div class="relogio"><div><b>00h</b><small>Grupo VIP</small></div><div><b>07h</b><small>Todo mundo</small></div><div class="r"><b>23h59</b><small>Acabou</small></div></div>' : ''}
<div class="btn">${p.btn}</div>
<p class="foot"><b>20% OFF</b> · Compre 4, leve 5 · Frete grátis · Só no 11/11</p>
</div></body></html>`;

(async () => {
  const b = await chromium.launch();
  for (const tag of ['4x5', '9x16']) {
    const [W, H] = tag === '4x5' ? [1080, 1350] : [1080, 1920];
    const pg = await b.newPage({ viewport: { width: W, height: H } });
    for (const p of pecas) {
      const f = path.join(OUT, `_tmp-${p.n}-${tag}.html`);
      fs.writeFileSync(f, html(p, W, H));
      await pg.goto('file://' + f);
      await pg.waitForTimeout(300);
      await pg.screenshot({ path: path.join(OUT, `vf-black-1111-venda-${String(p.n).padStart(2, '0')}-${p.slug}-${tag}.png`) });
      fs.unlinkSync(f);
    }
    await pg.close();
  }
  await b.close();
})();
