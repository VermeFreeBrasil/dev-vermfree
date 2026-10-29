// Gera os 10 estáticos de captação 11/11 (4:5 e 9:16) no visual da LP aprovada.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const D = __dirname;
const img = f => 'file://' + path.join(D, f);
const OUT = process.argv[2] || path.join(D, 'out');
fs.mkdirSync(OUT, { recursive: true });

const wa = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a9 9 0 0 1-13.5 7.8L3 21l1.7-4.5A9 9 0 1 1 21 11.5Z"/><path d="m8 7 2 3-1 1c1 2 2 3 4 4l1-1 3 1c0 2-2 3-4 2-4-1-7-5-7-7 0-2 1-3 2-3Z"/></svg>';
const lock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

const pecas = [
  { n: 1, h: 'A maior oferta da história da VermeFree está <em>guardada a sete chaves.</em>', s: 'Ela abre primeiro no Grupo VIP, à 00h do dia 11/11.', b: 'Quero entrar no grupo',
    v: `<div class="prod"><img src="${img('vf-hero-pedestal.png')}"></div>
        <div class="secret"><p class="k">${lock} Oferta secreta</p><span class="bl b1"></span><span class="bl b2"></span><span class="bl b3"></span></div>` },
  { n: 2, h: 'O Grupo VIP compra à 00h. <em>O resto do Brasil, só às 7h.</em>', s: '7 horas de vantagem no maior desconto da história da VermeFree.', b: 'Garantir minha vantagem',
    v: `<div class="clocks"><div class="ck in"><b>00h</b><span>Grupo VIP</span><i>✓ compra primeiro</i></div><div class="ck out"><b>07h</b><span>Todo mundo</span><i>✕ o que sobrar</i></div></div>
        <div class="prod sm"><img src="${img('vf-hero-pedestal.png')}"></div>` },
  { n: 3, h: 'Só os <em>100 primeiros pedidos</em> ganham cashback.', s: 'Quem está no Grupo VIP sai na frente à 00h do 11/11.', b: 'Entrar antes de todo mundo',
    v: `<div class="big"><b>100</b><span>primeiros<br>pedidos</span></div><div class="prod sm"><img src="${img('vf-hero-pedestal.png')}"></div>` },
  { n: 4, h: 'Os <em>300 primeiros pedidos</em> do 11/11 concorrem a um kit VermeFree.', s: 'O Grupo VIP recebe o link antes.', b: 'Quero minha chance',
    v: `<div class="prod kit"><img src="${img('vf-pv2-kit-familia-v3.png')}"><div class="seal"><small>sorteio</small><b>300</b><small>primeiros</small></div></div>` },
  { n: 5, h: 'Faltam poucos dias para o <em>maior desconto da história</em> da VermeFree.', s: 'Abre só no grupo, à 00h do dia 11/11. Dura 24 horas.', b: 'Entrar no Grupo VIP',
    v: `<div class="timer"><div><b>11/11</b><small>o dia</small></div><div><b>00h</b><small>abre no grupo</small></div><div class="r"><b>24h</b><small>e acaba</small></div></div>
        <div class="prod sm"><img src="${img('vf-hero-pedestal.png')}"></div>` },
  { n: 6, h: 'Quem espera as 7h <em>disputa o que sobrar.</em>', s: 'O maior desconto da história da VermeFree abre à 00h, primeiro no Grupo VIP. Não fique de fora.', b: 'Não quero ficar de fora',
    v: `<div class="sides"><div class="sd out"><p>Quem fica de fora</p><ul><li>Descobre a oferta só às 7h</li><li>Disputa o que sobrar dos 100 cashbacks</li></ul></div>
        <div class="sd in"><p>Quem está no Grupo VIP</p><ul><li>Recebe o link à 00h</li><li>Sai na frente de todo mundo</li></ul></div></div>
        <div class="prod xs"><img src="${img('vf-hero-pedestal.png')}"></div>` },
  { n: 7, h: 'Famílias inteiras já fizeram o protocolo. <em>No 11/11 é a sua vez.</em>', s: 'A maior condição do ano abre primeiro no Grupo VIP.', b: 'Quero entrar',
    v: `<div class="mosaic"><img src="${img('d04.jpg')}"><img src="${img('d06.jpg')}"><img src="${img('d07.jpg')}"></div>` },
  { n: 8, dark: true, h: 'Novembro é a hora de cuidar da família <em>por dentro.</em>', s: 'E o 11/11 traz o maior desconto da história da VermeFree, primeiro no grupo.', b: 'Entrar no Grupo VIP',
    v: `<div class="prod moon"><span class="lua"></span><img src="${img('vf-hero-pedestal.png')}"></div>` },
  { n: 9, dark: true, h: 'Esse grupo não é para todo mundo. <em>É para quem não quer perder o 11/11.</em>', s: 'Gratuito · só avisos · sai quando quiser.', b: 'Quero o acesso VIP',
    v: `<div class="ticket"><div class="tl"><small>Acesso</small><b>VIP</b><small>VermeFree</small></div><div class="tr"><b>11.11</b><span>Entrada à 00h</span><span>Antes de todo mundo</span></div></div>
        <div class="prod xs"><img src="${img('vf-hero-pedestal.png')}"></div>` },
  { n: 10, h: '<span class="giant">11.11</span>só 24 horas.', s: 'O maior desconto da história da VermeFree abre à 00h, primeiro no Grupo VIP.', b: 'Entrar agora',
    v: `<div class="prod"><img src="${img('vf-hero-pedestal.png')}"></div>` },
];

const css = (W, H) => `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{font-family:Inter,sans-serif;--ink:#173e2d;--red:#d7262f;--red2:#b5121b;--bg:#f5f2ea;background:var(--bg);color:var(--ink)}
body.dark{--bg:#173e2d;background:radial-gradient(ellipse 90% 60% at 50% 30%,#245a40 0,#173e2d 70%);color:#fff}
.c{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;text-align:center;padding:${H > 1500 ? '230px 70px 300px' : '0 70px 54px'}}
.top{position:absolute;left:0;right:0;top:0;background:var(--red);color:#fff;font-weight:800;font-size:26px;letter-spacing:3px;text-transform:uppercase;padding:18px 0;display:flex;justify-content:center;gap:14px;align-items:center}
.top:before{content:'';width:12px;height:12px;border-radius:50%;background:#fff}
.logo{height:${H > 1500 ? 70 : 58}px;margin:${H > 1500 ? 0 : 96}px 0 26px}
body.dark .logo{filter:brightness(0) invert(1)}
.badge{display:inline-block;border:2px solid #f6c9cb;background:#fdeceb;color:var(--red);font-size:26px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;padding:10px 24px;border-radius:60px;margin-bottom:24px}
h1{font-size:${H > 1500 ? 84 : 74}px;line-height:1.04;font-weight:800;letter-spacing:-.035em}
h1 em{font-style:normal;color:var(--red)}
body.dark h1 em{color:#ff5a5f}
.giant{display:block;font-size:${H > 1500 ? 300 : 250}px;line-height:.9;color:var(--red);letter-spacing:-.05em}
.s{font-size:${H > 1500 ? 36 : 32}px;line-height:1.35;margin:20px 0 0;opacity:.85;max-width:900px}
.v{flex:1;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;min-height:0;position:relative}
.prod{flex:1;min-height:0;width:100%;display:flex;align-items:center;justify-content:center;position:relative}
.prod img{max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 24px 30px #173e2d40)}
.prod.sm{flex:1}.prod.xs{flex:1}
.btn{display:flex;align-items:center;justify-content:center;gap:16px;width:100%;max-width:860px;height:${H > 1500 ? 120 : 108}px;border-radius:80px;background:linear-gradient(180deg,#e2333b,var(--red2));color:#fff;font-size:${H > 1500 ? 44 : 40}px;font-weight:800;box-shadow:0 18px 36px #d7262f55;flex-shrink:0}
.btn svg{width:46px;height:46px}
.checks{margin-top:16px;font-size:24px;opacity:.75;flex-shrink:0}
.secret{position:absolute;left:50%;bottom:6%;transform:translateX(-50%);width:78%;background:var(--ink);color:#fff;border-radius:26px;padding:26px 30px;display:flex;flex-direction:column;align-items:center;gap:12px;box-shadow:0 20px 40px #0004}
.secret .k{display:flex;gap:10px;align-items:center;font-size:24px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#ff8a80}
.secret .k svg{width:26px;height:26px}
.bl{display:block;height:22px;border-radius:20px;background:linear-gradient(90deg,#8fbf7a,#e0b86a,#8fbf7a);filter:blur(8px);opacity:.8}
.b1{width:70%}.b2{width:90%}.b3{width:55%}
.clocks{display:flex;gap:24px;width:100%;margin-top:30px}
.ck{flex:1;border-radius:28px;padding:30px 10px;display:flex;flex-direction:column;gap:6px}
.ck b{font-size:110px;line-height:1;font-weight:800;letter-spacing:-.04em}
.ck span{font-size:30px;font-weight:800;text-transform:uppercase;letter-spacing:2px}
.ck i{font-style:normal;font-size:26px}
.ck.in{background:var(--ink);color:#fff;box-shadow:0 14px 30px #173e2d55}
.ck.out{background:#fdeeee;border:3px solid #f6c9cb;color:var(--red)}
.ck.out b{text-decoration:line-through;text-decoration-thickness:8px;opacity:.7}
.big{display:flex;align-items:center;gap:24px;margin-top:20px}
.big b{font-size:${H > 1500 ? 260 : 210}px;line-height:.85;color:var(--red);font-weight:800;letter-spacing:-.06em}
.big span{font-size:44px;font-weight:800;text-align:left;line-height:1.1}
.kit img{max-height:100%}
.seal{position:absolute;right:2%;top:4%;width:230px;height:230px;border-radius:50%;background:var(--red);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(-10deg);box-shadow:0 14px 30px #d7262f66}
.seal b{font-size:96px;line-height:1;font-weight:800}
.seal small{font-size:24px;font-weight:800;text-transform:uppercase;letter-spacing:2px}
.timer{display:flex;gap:20px;margin-top:30px}
.timer div{width:250px;background:var(--ink);color:#fff;border-radius:24px;padding:26px 0 20px;box-shadow:0 14px 28px #173e2d44}
.timer div.r{background:var(--red);box-shadow:0 14px 28px #d7262f55}
.timer b{display:block;font-size:70px;font-weight:800;line-height:1.05}
.timer small{font-size:22px;letter-spacing:2px;text-transform:uppercase;opacity:.8}
.sides{display:flex;flex-direction:column;gap:18px;width:100%;margin-top:28px;text-align:left}
.sd{border-radius:24px;padding:24px 30px}
.sd p{font-size:32px;font-weight:800;margin-bottom:8px}
.sd li{list-style:none;font-size:29px;padding:4px 0 4px 42px;position:relative}
.sd.out{background:#fdeeee;border:2px solid #f6c9cb}.sd.out p,.sd.out li:before{color:var(--red)}
.sd.out li:before{content:'✕';position:absolute;left:0;font-weight:900}
.sd.in{background:#eef7ec;border:2px solid #cde6c6}.sd.in p,.sd.in li:before{color:#2f7d32}
.sd.in li:before{content:'✓';position:absolute;left:0;font-weight:900}
.mosaic{flex:1;min-height:0;display:flex;gap:18px;align-items:center;justify-content:center;width:100%;margin-top:24px}
.mosaic img{width:30%;height:auto;max-height:92%;aspect-ratio:9/16;object-fit:cover;border-radius:24px;box-shadow:0 14px 30px #0003}
.mosaic img:nth-child(2){width:34%;max-height:100%;outline:6px solid var(--red)}
.moon .lua{position:absolute;top:2%;right:12%;width:150px;height:150px;border-radius:50%;box-shadow:-34px 14px 0 0 #f3ead2;opacity:.9}
.ticket{display:flex;width:100%;margin-top:30px;border-radius:28px;overflow:hidden;box-shadow:0 20px 40px #0005}
.ticket .tl{background:var(--red);color:#fff;width:34%;padding:30px 0;display:flex;flex-direction:column;justify-content:center;border-right:6px dashed #173e2d}
.ticket .tl b{font-size:96px;line-height:1;font-weight:800}
.ticket .tl small{font-size:22px;letter-spacing:3px;text-transform:uppercase;font-weight:800}
.ticket .tr{flex:1;background:#f5f2ea;color:var(--ink);display:flex;flex-direction:column;justify-content:center;gap:4px;padding:24px}
.ticket .tr b{font-size:100px;line-height:1;font-weight:800;color:var(--red);letter-spacing:-.04em}
.ticket .tr span{font-size:28px;font-weight:700}
`;

const html = (p, W, H) => `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H)}</style></head>
<body class="${p.dark ? 'dark' : ''}"><div class="top">Acesso antecipado · abre 11/11 à 00h</div><div class="c">
<img class="logo" src="${img('logo-shopify-medium.png')}">
${p.n === 10 ? '' : '<p class="badge">11.11 · só 24 horas</p>'}
<h1>${p.h}</h1><p class="s">${p.s}</p>
<div class="v">${p.v}</div>
<div class="btn">${wa}${p.b}</div><p class="checks">Gratuito · Só avisos · Sai quando quiser</p>
</div></body></html>`;

(async () => {
  const b = await chromium.launch();
  const only = process.argv[3] ? process.argv[3].split(',').map(Number) : null;
  for (const [tag, W, H] of [['4x5', 1080, 1350], ['9x16', 1080, 1920]]) {
    const pg = await b.newPage({ viewport: { width: W, height: H } });
    for (const p of pecas) {
      if (only && !only.includes(p.n)) continue;
      const f = path.join(D, `p${p.n}-${tag}.html`);
      fs.writeFileSync(f, html(p, W, H));
      await pg.goto('file://' + f);
      await pg.waitForTimeout(300);
      await pg.screenshot({ path: path.join(OUT, `vf-1111-captacao-${String(p.n).padStart(2, '0')}-${tag}.png`) });
    }
  }
  await b.close();
})();
