// 4 estáticos "Black" de preço para o 11/11 (03/11): fundo preto, detalhes vermelhos, 20% OFF e 3x sem juros.
// Uso: node gerar.cjs <pasta-das-imagens> [saida]
// Imagens esperadas na pasta: logo-shopify-medium.png, vf-pv2-adulto.png, vf-pv2-kids-2a4.png, vf-pv2-kids-5a9.png, vf-pv2-kit-familia-v3.png
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const ART = process.argv[2];
const OUT = process.argv[3] || path.join(__dirname, 'png');
fs.mkdirSync(OUT, { recursive: true });
const img = f => 'file://' + path.join(ART, f);

const brl = c => 'R$ ' + (c / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
// Preço da loja em centavos; 20% OFF com centavos para baixo (igual ao carrinho); 3x sem juros.
const pecas = [
  { n: 1, slug: 'adulto', nome: 'VermeFree Adulto', sub: 'Protocolo natural de 30 dias', de: 34700, foto: 'vf-pv2-adulto.png' },
  { n: 2, slug: 'kids-2a4', nome: 'VermeFree Kids 2 a 4 anos', sub: 'Dose certa para os pequenos', de: 27000, foto: 'vf-pv2-kids-2a4.png' },
  { n: 3, slug: 'kids-5a9', nome: 'VermeFree Kids 5 a 9 anos', sub: 'Dose certa para a idade', de: 38900, foto: 'vf-pv2-kids-5a9.png' },
  { n: 4, slug: 'kit-familia', nome: 'Kit Família', sub: '2 adultos + 2 crianças', de: 115000, foto: 'vf-pv2-kit-familia-v3.png' },
].map(p => {
  const por = p.de - Math.floor(p.de * 20 / 100);
  return { ...p, por, parc: Math.round(por / 3) };
});

const css = (W, H) => {
  const T = H > 1500;
  return `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{font-family:Inter,Arial,sans-serif;color:#fff;background:#060606;
  background-image:radial-gradient(ellipse 70% 45% at 50% ${T ? 46 : 48}%,#3a0709 0,#1a0405 45%,#060606 75%)}
.top{position:absolute;left:0;right:0;top:0;height:${T ? 74 : 64}px;background:#e01e26;display:flex;align-items:center;justify-content:center;gap:18px;
  font-weight:900;font-size:${T ? 28 : 25}px;letter-spacing:4px;text-transform:uppercase}
.top i{width:10px;height:10px;border-radius:50%;background:#fff;display:block}
.c{position:absolute;inset:${T ? '150px 70px 170px' : '96px 64px 48px'};display:flex;flex-direction:column;align-items:center;text-align:center}
.logo{height:${T ? 60 : 50}px;filter:brightness(0) invert(1)}
.tag{margin-top:${T ? 26 : 18}px;font-size:${T ? 26 : 23}px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#ff4d55}
.off{display:flex;align-items:flex-start;line-height:.82;font-weight:900;letter-spacing:-.05em;color:#ff2a33;margin-top:${T ? 10 : 6}px;
  font-size:${T ? 250 : 200}px;text-shadow:0 0 60px #ff1e2766}
.off small{font-size:.42em;letter-spacing:-.02em;margin:.12em 0 0 .06em;line-height:.9;text-align:left}
.v{flex:1;min-height:0;width:100%;display:flex;align-items:center;justify-content:center;position:relative;margin:${T ? 18 : 6}px 0}
.v img{max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 30px 40px #000c)}
.v:before{content:'';position:absolute;bottom:4%;left:18%;right:18%;height:14%;background:radial-gradient(ellipse at center,#ff1e2740 0,transparent 70%)}
.nome{font-size:${T ? 40 : 34}px;font-weight:800;letter-spacing:-.01em}
.sub{font-size:${T ? 26 : 22}px;color:#bdbdbd;margin-top:4px}
.preco{margin-top:${T ? 22 : 14}px;display:flex;align-items:baseline;gap:22px;justify-content:center}
.de{font-size:${T ? 36 : 30}px;color:#9a9a9a;text-decoration:line-through;text-decoration-color:#ff2a33;text-decoration-thickness:3px}
.por{font-size:${T ? 84 : 70}px;font-weight:900;letter-spacing:-.03em}
.parc{margin-top:${T ? 10 : 6}px;display:inline-block;border:3px solid #ff2a33;border-radius:16px;padding:${T ? '12px 30px' : '9px 26px'};
  font-size:${T ? 44 : 36}px;font-weight:800;letter-spacing:-.01em}
.parc b{color:#ff4d55}
.btn{margin-top:${T ? 30 : 20}px;width:100%;max-width:860px;height:${T ? 112 : 96}px;border-radius:80px;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(180deg,#ff2f38,#c2121b);font-size:${T ? 42 : 36}px;font-weight:900;letter-spacing:.5px;box-shadow:0 18px 44px #e01e2766;flex-shrink:0}
.foot{margin-top:${T ? 18 : 12}px;font-size:${T ? 24 : 21}px;color:#a8a8a8;letter-spacing:1px;flex-shrink:0}
.foot b{color:#fff}
`;
};

const html = (p, W, H) => `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H)}</style></head><body>
<div class="top"><i></i>Black VermeFree · 11.11<i></i></div>
<div class="c">
<img class="logo" src="${img('logo-shopify-medium.png')}">
<p class="tag">O maior desconto da história</p>
<div class="off">20<small>%<br>OFF</small></div>
<div class="v"><img src="${img(p.foto)}"></div>
<p class="nome">${p.nome}</p><p class="sub">${p.sub}</p>
<div class="preco"><span class="de">${brl(p.de)}</span><span class="por">${brl(p.por)}</span></div>
<p class="parc">ou <b>3x de ${brl(p.parc)}</b> sem juros</p>
<div class="btn">Comprar no 11/11</div>
<p class="foot"><b>Só 24 horas</b> · Frete grátis · Compre 4, leve 5</p>
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
      await pg.screenshot({ path: path.join(OUT, `vf-black-1111-preco-0${p.n}-${p.slug}-${tag}.png`) });
      fs.unlinkSync(f);
      console.log(p.n, tag, brl(p.de), '→', brl(p.por), '3x', brl(p.parc));
    }
    await pg.close();
  }
  await b.close();
})();
