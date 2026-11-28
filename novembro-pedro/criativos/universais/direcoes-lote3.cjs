// Lote 3 · 3 direções de arte (amostras) com os FRASCOS REAIS recortados das fotos (sem rótulo gerado por IA).
// A: editorial claro · B: colagem black · C: tipografia gigante. Uso: node direcoes-lote3.cjs <pasta-das-imagens> [saida]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const ART = process.argv[2];
const OUT = process.argv[3] || path.join(__dirname, 'direcoes');
fs.mkdirSync(OUT, { recursive: true });
const img = f => 'file://' + path.join(ART, f);
const B = n => img('b-' + n + '.png');
const base = `*{box-sizing:border-box;margin:0;padding:0}html,body{width:1080px;height:1350px;overflow:hidden}body{font-family:Inter,Arial,sans-serif;position:relative}`;

// A · Editorial claro: fundo off-white, título gigante verde-escuro, frascos em degraus com sombra, selo vermelho
const A = `<style>${base}
body{background:#eeeae1;color:#0d3626}
.logo{position:absolute;top:56px;left:0;right:0;text-align:center}.logo img{height:46px;filter:brightness(0) saturate(100%) invert(16%) sepia(33%) saturate(900%) hue-rotate(110deg)}
h1{position:absolute;top:140px;left:60px;right:60px;text-align:center;font-size:118px;font-weight:900;letter-spacing:-.05em;line-height:.92;text-transform:uppercase}
h1 em{font-style:normal;color:#e01e26}
.s{position:absolute;top:388px;left:0;right:0;text-align:center;font-size:32px;color:#2b4a3c}
.st{position:absolute;bottom:0;left:0;right:0;height:560px}
.pl{position:absolute;bottom:0;background:linear-gradient(180deg,#fbfaf6,#e3ded2);box-shadow:0 -1px 0 #fff inset,0 20px 40px #0002;border-radius:6px 6px 0 0}
.bt{position:absolute;filter:drop-shadow(0 18px 14px #0004)}
.stk{position:absolute;right:70px;top:470px;width:190px;height:190px;border-radius:50%;background:#e01e26;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(12deg);font-weight:900;text-transform:uppercase;box-shadow:0 12px 30px #0003}
.stk b{font-size:32px;letter-spacing:-.02em}.stk small{font-size:19px;letter-spacing:2px}
.ft{position:absolute;bottom:34px;left:0;right:0;text-align:center;font-size:24px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#0d3626}
</style>
<div class="logo"><img src="${img('logo-shopify-medium.png')}"></div>
<h1>A maior Black<br>da <em>história.</em></h1>
<p class="s">O maior desconto que a VermeFree já fez. Só no site.</p>
<div class="st">
  <div class="pl" style="left:90px;width:250px;height:150px"></div>
  <div class="pl" style="left:330px;width:430px;height:250px;z-index:1"></div>
  <div class="pl" style="left:750px;width:240px;height:110px"></div>
  <img class="bt" src="${B('kids-tintura')}" style="left:120px;bottom:150px;height:360px">
  <img class="bt" src="${B('tintura')}" style="left:372px;bottom:250px;height:300px;z-index:2">
  <img class="bt" src="${B('oleo')}" style="left:540px;bottom:250px;height:225px;z-index:2">
  <img class="bt" src="${B('silimarina')}" style="left:775px;bottom:110px;height:215px">
</div>
<div class="stk"><small>Black</small><b>Vermefree</b><small>só no site</small></div>
<div class="ft">Garanta o seu no site →</div>`;

// B · Colagem black: fundo preto com grão, frascos inclinados e sobrepostos, fita adesiva, tarjas de papel inclinadas
const Bc = `<style>${base}
body{background:#0b0b0b;color:#000;background-image:radial-gradient(circle at 30% 20%,#1d1d1d 0,#0b0b0b 60%)}
.tag{position:absolute;background:#f4f1ea;font-weight:900;text-transform:uppercase;letter-spacing:-.02em;padding:10px 26px;box-shadow:0 14px 30px #000c}
.tag.r{background:#e01e26;color:#fff}
.bt{position:absolute;filter:drop-shadow(0 24px 22px #000)}
.tp{position:absolute;width:150px;height:44px;background:#f4f1ea99;box-shadow:0 2px 6px #0005}
.logo{position:absolute;bottom:52px;left:60px}.logo img{height:46px;filter:brightness(0) invert(1)}
.cta{position:absolute;bottom:44px;right:60px;background:#fff;color:#000;font-weight:900;font-size:28px;padding:16px 30px;border-radius:999px;text-transform:uppercase}
.stk{position:absolute;width:170px;height:170px;border-radius:50%;background:#e01e26;color:#fff;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:900;font-size:30px;line-height:1;text-transform:uppercase;transform:rotate(-14deg);border:5px solid #fff;box-shadow:0 12px 30px #000a}
</style>
<div class="tag" style="left:60px;top:80px;font-size:110px;transform:rotate(-4deg)">A maior</div>
<div class="tag r" style="left:150px;top:230px;font-size:130px;transform:rotate(2deg)">Black</div>
<div class="tag" style="left:80px;top:405px;font-size:56px;transform:rotate(-2deg)">da história da VermeFree</div>
<img class="bt" src="${B('kids-fito')}" style="left:600px;top:560px;height:470px;transform:rotate(14deg)">
<img class="bt" src="${B('tintura')}" style="left:330px;top:600px;height:440px;transform:rotate(-9deg)">
<img class="bt" src="${B('ornitina')}" style="left:110px;top:760px;height:300px;transform:rotate(-20deg)">
<img class="bt" src="${B('oleo')}" style="left:800px;top:880px;height:250px;transform:rotate(8deg)">
<div class="tp" style="left:380px;top:640px;transform:rotate(-30deg)"></div>
<div class="tp" style="left:690px;top:600px;transform:rotate(25deg)"></div>
<div class="stk" style="right:60px;top:520px">Só no<br>site</div>
<div class="logo"><img src="${img('logo-shopify-medium.png')}"></div>
<div class="cta">Garantir →</div>`;

// C · Tipografia gigante: fundo verde-limão, "BLACK" gigante atrás, frascos na frente em profundidade, sombras no chão
const C = `<style>${base}
body{background:#c0de96;color:#000}
.giant{position:absolute;top:150px;left:-20px;right:-20px;text-align:center;font-size:330px;font-weight:900;letter-spacing:-.07em;line-height:1;color:#0b0b0b}
.top{position:absolute;top:60px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:center;font-weight:800;font-size:26px;letter-spacing:2px;text-transform:uppercase}
.top img{height:44px;filter:brightness(0)}
.floor{position:absolute;left:0;right:0;bottom:0;height:420px;background:linear-gradient(180deg,#b3d486,#a6c977)}
.bt{position:absolute;filter:drop-shadow(0 22px 16px #0005)}
.sh{position:absolute;height:34px;border-radius:50%;background:radial-gradient(ellipse at center,#0006,transparent 70%)}
.cp{position:absolute;bottom:60px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:flex-end}
.cp p{font-size:44px;font-weight:800;letter-spacing:-.02em;line-height:1.05;max-width:620px}
.cp span{background:#0b0b0b;color:#fff;font-weight:900;font-size:28px;padding:18px 32px;border-radius:999px;text-transform:uppercase;white-space:nowrap}
.red{color:#e01e26}
</style>
<div class="top"><img src="${img('logo-shopify-medium.png')}"><span>Só no site</span></div>
<div class="giant">BLACK</div>
<div class="floor"></div>
<div class="sh" style="left:150px;width:250px;bottom:300px"></div><div class="sh" style="left:420px;width:250px;bottom:270px"></div><div class="sh" style="left:690px;width:250px;bottom:300px"></div>
<img class="bt" src="${B('kids-tintura')}" style="left:170px;bottom:310px;height:380px">
<img class="bt" src="${B('tintura')}" style="left:440px;bottom:280px;height:430px;z-index:2">
<img class="bt" src="${B('silimarina')}" style="left:700px;bottom:312px;height:290px">
<div class="cp"><p>O maior desconto da <span class="red" style="background:none;color:#e01e26;padding:0;font-size:inherit">história</span> da VermeFree.</p><span>Garantir →</span></div>`;

(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [n, h] of [['A-editorial-claro', A], ['B-colagem-black', Bc], ['C-tipografia-gigante', C]]) {
    const hf = path.join(ART, `dir-${n}.html`); fs.writeFileSync(hf, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + h + '</body></html>');
    await pg.goto('file://' + hf, { waitUntil: 'load' }); await pg.waitForTimeout(200);
    await pg.screenshot({ path: path.join(OUT, `direcao-${n}.png`) }); console.log(n);
  }
  await b.close();
})();
