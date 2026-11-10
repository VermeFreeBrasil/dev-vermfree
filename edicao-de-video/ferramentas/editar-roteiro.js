// Edição dos UGC "roteiro" do 11/11 (10/11). Corta as melhores tomadas do bruto 4K, alterna apresentadora em tela cheia
// com cartões de tela cheia (preto → vinho, vermelho e branco) e a apresentadora em janela no canto.
// Uso: node editar-roteiro.js <plano.json>
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const plano = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const D = path.dirname(path.resolve(process.argv[2]));
const ART = path.join(D, '..', '..', 'art');
const FPS = 30, W = 1080, H = 1920, PADI = 0.0, PADF = 0.05;
const work = path.join(D, 'tmp-' + plano.id);
if (!process.env.SO_COMPOR) fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(work, { recursive: true });

// 1) linha do tempo de saída
let t = 0;
const segs = plano.segs.map((s, i) => {
  const a = Math.max(0, s.de - PADI), b = s.ate + PADF, d = +(b - a).toFixed(3);
  const o = { ...s, i, a, b, d, t0: t, t1: t + d };
  t += d; return o;
});
const DUR = +t.toFixed(3), N = Math.round(DUR * FPS);
const T = (i, off) => off === 'fim' ? segs[i].t1 : segs[i].t0 + off;
const cards = segs.flatMap(s => {
  const l = s.cards ? s.cards : (s.card ? [{ tipo: s.card, ini: s.cardIni || 0, extra: s.extra }] : []);
  return l.map(c => ({ tipo: c.tipo, ini: T(s.i, c.ini || 0), fim: c.fim === undefined ? s.t1 : T(s.i, c.fim), i: s.i, extra: c.extra || {} }));
});
const SEMPIP = ['final', 'pergunta'];
const caps = [];
for (const s of segs) {
  if (!s.legenda) continue;

  const w = s.legenda.split(/\s+/), g = [];
  for (let k = 0; k < w.length; k += 3) g.push(w.slice(k, k + 3));
  if (g.length > 1 && g[g.length - 1].length === 1) g[g.length - 2].push(...g.pop());
  const tot = g.reduce((x, y) => x + y.join(' ').length, 0); let c = s.t0 + 0.05;
  const span = (s.legFim ? s.t0 + s.legFim : s.t1 - 0.05) - c;
  for (const gg of g) { const l = span * gg.join(' ').length / tot; caps.push({ ini: c, fim: c + l, p: gg }); c += l; }
}
const extras = segs.flatMap(s => (s.fx || []).map(f => ({ ...f, ini: T(s.i, f.ini || 0), fim: f.fim === undefined ? s.t1 : T(s.i, f.fim) })));
fs.writeFileSync(path.join(work, 'linha.json'), JSON.stringify({ DUR, segs, cards, caps, extras }, null, 1));
console.log('duração', DUR, 'quadros', N);

// 2) base: cortes do bruto, 1080x1920 30fps, zoom alternado por corte
const base = path.join(work, 'base.mp4');
// um trecho por vez (pouca memória), depois junta
const partes = [];
if (!process.argv[3] && !process.env.SO_COMPOR) {
  segs.forEach((s, k) => {
    const z = s.zoom || (k % 2 ? 1.12 : 1.0);
    const w2 = Math.round(W * z / 2) * 2, h2 = Math.round(H * z / 2) * 2;
    const o = path.join(work, `seg${String(k).padStart(2, '0')}.mov`); partes.push(o);
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-threads', '2', '-ss', String(s.a), '-t', String(s.d), '-i', plano.entrada,
      '-vf', `fps=${FPS},scale=${w2}:${h2}:flags=lanczos,crop=${W}:${H}:(iw-${W})/2:(ih-${H})*0.3,setsar=1`,
      '-af', `aresample=48000,afade=t=in:d=0.02,afade=t=out:st=${(s.d - 0.04).toFixed(3)}:d=0.04`,
      '-t', String(s.d), '-c:v', 'libx264', '-preset', 'fast', '-crf', '14', '-pix_fmt', 'yuv420p', '-c:a', 'pcm_s16le', o], { stdio: 'inherit' });
  });
  const fc2 = partes.map((p, k) => `[${k}:v][${k}:a]`).join('') + `concat=n=${partes.length}:v=1:a=1[v][a]`;
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...partes.flatMap(p => ['-i', p]), '-filter_complex', fc2, '-map', '[v]', '-map', '[a]',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '16', '-pix_fmt', 'yuv420p', '-c:a', 'pcm_s16le', base.replace('.mp4', '.mov')], { stdio: 'inherit' });
}

// 3) camada gráfica
const img = f => 'file://' + path.join(ART, f);
const brl = c => 'R$ ' + (c / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const por = c => c - Math.round(c * 20 / 100);
const PROD = {
  adulto: { n: 'Adulto', s: 'pra você', img: 'crop-vf-pv2-adulto.png', de: 34700 },
  kids: { n: 'Kids', s: 'pro seu filho', img: 'crop-vf-pv2-kids-2a4.png', de: 27000 },
  familia: { n: 'Kit Família', s: 'junta os dois', img: 'crop-vf-pv2-kit-familia-v3.png', de: 115000 },
};
const R = '#e01e26';
const cardHtml = (c, k) => {
  const head = `<div class="ck"><img src="${img('logo-shopify-medium.png')}"><span>11.11 · só hoje</span></div>`;
  if (c.tipo === 'relogio') return `<div class="card escuro" data-k="${k}">${head}<p class="sup">${c.extra.sup}</p><div class="dig">${'23:59'.split('').map(x => x === ':' ? '<i>:</i>' : `<b>${x}</b>`).join('')}</div><p class="sub">${c.extra.sub}</p></div>`;
  if (c.tipo === 'off') return `<div class="card verm" data-k="${k}">${head}<p class="sup">em todo o site</p><div class="mega">20%<small>OFF</small></div><div class="thumbs">${['adulto', 'kids', 'familia'].map((p, j) => `<div data-j="${j}"><img src="${img(PROD[p].img)}"><span>${PROD[p].n}</span></div>`).join('')}</div></div>`;
  if (c.tipo === 'frete') return `<div class="card escuro" data-k="${k}">${head}<p class="sup">frete grátis</p><div class="big2">em qualquer<br>pedido</div><div class="recibo"><div><span>Frete</span><b>R$ 0,00</b></div><div class="lin"><span>Valor mínimo</span><b>nenhum</b></div></div><p class="sub">até em 1 protocolo só</p></div>`;
  if (c.tipo === 'cinco') return `<div class="card escuro" data-k="${k}">${head}<p class="sup">leve 5, pague 4</p><div class="big2">o 5º sai<br><em>de graça</em></div><div class="slots">${[0, 1, 2, 3, 4].map(j => `<div data-j="${j}"><img src="${img(j === 4 ? 'crop-vf-pv2-kids-2a4.png' : 'crop-vf-pv2-adulto.png')}"><span>${j === 4 ? 'GRÁTIS' : j + 1}</span></div>`).join('')}</div><p class="sub">a cada 5 itens, o de menor valor sai grátis</p></div>`;
  if (c.tipo === 'sorteio') return `<div class="card verm" data-k="${k}">${head}<p class="sup">bônus dos primeiros</p><div class="mega" data-cont>0</div><p class="lab">primeiros pedidos</p><div class="big3">concorrem a um<br>kit VermeFree inteiro</div></div>`;
  if (c.tipo === 'linha') return `<div class="card escuro" data-k="${k}">${head}<p class="sup">monte o seu protocolo</p><div class="trio">${['adulto', 'kids', 'familia'].map((p, j) => `<div data-j="${j}"><img src="${img(PROD[p].img)}"><b>${PROD[p].n}</b><small>${PROD[p].s}</small><s>${brl(PROD[p].de)}</s><strong>${brl(por(PROD[p].de))}</strong></div>`).join('')}</div><p class="sub">preços com 20% OFF · ou em até 3x sem juros</p></div>`;
  if (c.tipo === 'eclipse') return `<div class="card escuro" data-k="${k}">${head}<p class="sup">tudo isso só até</p><div class="lua"><div class="sol"></div><div class="som"></div></div><div class="hora">23h59</div><p class="sub">depois o preço volta ao normal</p></div>`;
  if (c.tipo === 'pergunta') return `<div class="card escuro" data-k="${k}"><img class="lg" src="${img('logo-shopify-medium.png')}" style="margin-top:120px"><div class="big2 perg">${c.extra.html || 'Quando<br>começa a<br><em>Black</em> da<br>VermeFree?'}</div></div>`;
  if (c.tipo === 'cashback') return `<div class="card verm" data-k="${k}">${head}<p class="sup">bônus dos 100 primeiros pedidos</p><div class="mega"><span data-cont15>0</span>%<small>de volta</small></div><div class="big3">em cashback pra usar<br>até 30/11</div></div>`;
  if (c.tipo === 'kitkids') return `<div class="card escuro" data-k="${k}">${head}<p class="sup">comprou 4 itens?</p><div class="big2">ganha um<br><em>Kit Kids</em></div><div class="kk"><img src="${img('crop-vf-pv2-kids-2a4.png')}"><span>2 a 4 anos · grátis</span></div></div>`;
  if (c.tipo === 'brindes') return `<div class="card escuro" data-k="${k}">${head}<p class="sup">quem compra hoje leva junto</p><div class="docs"><div data-j="0"><i>🥗</i><b>Guia de alimentos antiparasitários</b></div><div data-j="1"><i>📘</i><b>Manual da desparasitação</b></div></div><p class="sub">o passo a passo completo, de presente</p></div>`;
  if (c.tipo === 'fases') return `<div class="card escuro" data-k="${k}">${head}<p class="sup">do jeito certo</p><div class="vs"><div class="nao" data-j="0"><span>✕</span><b>dose única</b></div><div class="sim" data-j="1"><span>✓</span><b>em fases</b></div></div><div class="frs">${['b-silimarina.png', 'b-tintura.png', 'b-oleo.png', 'b-ornitina.png'].map((f, j) => `<img data-j="${j}" src="${img(f)}">`).join('')}</div></div>`;
  if (c.tipo === 'carrinho') return `<div class="card escuro" data-k="${k}">${head}<p class="sup">o mesmo carrinho</p><div class="cmp"><div class="hj" data-j="0"><p>hoje</p><div><span>Adulto</span><b>R$ 277,60</b></div><div><span>Frete</span><b>R$ 0,00</b></div></div><div class="am" data-j="1"><p>amanhã</p><div><span>Adulto</span><b>R$ 347,00</b></div><div><span>Frete</span><b>+ frete</b></div></div></div><p class="sub">é o mesmo pedido, só que custando mais</p></div>`;
  if (c.tipo === 'luanova') return `<div class="card escuro" data-k="${k}">${head}<p class="sup">o calendário também ajuda</p><div class="nova"></div><div class="big3">compra hoje, chega com folga<br>e você começa na<br><em class="ver">última lua nova do ano</em></div></div>`;
  if (c.tipo === 'final') return `<div class="card escuro" data-k="${k}"><img class="lg" src="${img('logo-shopify-medium.png')}"><p class="sup">11.11 · só hoje até 23h59</p><ul class="lista"><li><b>20% OFF</b> em todo o site</li><li><b>5º grátis</b> levando 5</li><li><b>Frete grátis</b> sem mínimo</li></ul><img class="kit" src="${img('crop-vf-pv2-kit-familia-v3.png')}"><div class="btn">Garantir no site ↓</div></div>`;
  return '';
};
const fxHtml = (f, k) => {
  if (f.tipo === 'tarja') return `<div class="fx tarja" data-f="${k}" style="top:${f.y || 300}px"><span>${f.texto}</span></div>`;
  if (f.tipo === 'selo') return `<div class="fx selo" data-f="${k}">${f.texto}</div>`;
  if (f.tipo === 'botao') return `<div class="fx botao" data-f="${k}">${f.texto}</div>`;
  if (f.tipo === 'frascos') return `<div class="fx frasc" data-f="${k}">${f.itens.map((it, j) => `<div data-j="${j}"><img src="${img(it.img)}"><b>${it.label}</b></div>`).join('')}</div>`;
  if (f.tipo === 'chips') return `<div class="fx chips" data-f="${k}">${f.itens.map((it, j) => `<span data-j="${j}">${it.label}<i></i></span>`).join('')}</div>`;
  if (f.tipo === 'gancho') return `<div class="fx gancho" data-f="${k}"><p>${f.texto}</p></div>`;
  return '';
};
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;background:transparent;overflow:hidden;font-family:Inter,sans-serif;color:#fff}
.card{position:absolute;inset:0;opacity:0;text-align:center;padding-top:380px}
.card.escuro{background:radial-gradient(ellipse 90% 60% at 50% 30%,#3b0c10 0,#160406 55%,#070102 100%)}
.card.verm{background:radial-gradient(ellipse 90% 70% at 50% 30%,#f2343c 0,${R} 45%,#a3101a 100%)}
.ck{position:absolute;top:150px;left:0;right:0;display:flex;justify-content:center;align-items:center;gap:18px}
.ck img{height:46px;filter:brightness(0) invert(1)}
.ck span{font-size:26px;font-weight:800;letter-spacing:3px;text-transform:uppercase;border:2px solid #fff6;border-radius:40px;padding:8px 18px}
.sup{font-size:38px;font-weight:800;letter-spacing:4px;text-transform:uppercase;color:#ff6b70}
.verm .sup{color:#fff}
.sub{margin-top:34px;font-size:38px;font-weight:600;opacity:.92;padding:0 90px}
.dig{display:flex;justify-content:center;gap:14px;margin-top:40px}
.dig b{display:inline-block;width:170px;height:240px;line-height:240px;font-size:190px;font-weight:900;background:linear-gradient(180deg,#1d1d1d 50%,#111 50%);border-radius:22px;box-shadow:0 20px 40px #000a,inset 0 0 0 2px #ffffff14;letter-spacing:-.04em}
.dig i{font-style:normal;font-size:170px;font-weight:900;line-height:240px;color:${R}}
.mega{font-size:330px;font-weight:900;letter-spacing:-.06em;line-height:.95;margin-top:10px}
.mega small{display:block;font-size:110px;letter-spacing:-.02em;margin-top:-10px}
.thumbs{display:flex;justify-content:center;gap:22px;margin-top:40px}
.thumbs div{width:290px;background:#fff;border-radius:26px;padding:16px 10px 14px;color:#111;box-shadow:0 18px 36px #0006}
.thumbs img{width:100%;height:210px;object-fit:contain}
.thumbs span{display:block;font-size:30px;font-weight:900;margin-top:6px}
.big2{font-size:132px;font-weight:900;letter-spacing:-.05em;line-height:.95;margin-top:24px}
.big2 em{font-style:normal;background:${R};padding:0 .14em;border-radius:18px}
.big3{font-size:66px;font-weight:900;letter-spacing:-.03em;line-height:1.05;margin-top:30px}
.lab{font-size:52px;font-weight:800;margin-top:-6px}
.recibo{margin:50px auto 0;width:760px;background:#fff;color:#111;border-radius:26px;padding:24px 40px;box-shadow:0 24px 50px #000a;text-align:left}
.recibo div{display:flex;justify-content:space-between;align-items:center;font-size:44px;font-weight:700;padding:14px 0}
.recibo div b{font-weight:900;color:${R};font-size:56px}
.recibo .lin{border-top:3px dashed #ddd}
.slots{display:flex;justify-content:center;gap:16px;margin-top:56px}
.slots div{position:relative;width:184px;height:270px;border-radius:24px;background:#ffffff12;border:3px dashed #ffffff40;display:flex;align-items:center;justify-content:center}
.slots img{width:164px;height:210px;object-fit:contain}
.slots span{position:absolute;bottom:-26px;left:50%;transform:translateX(-50%);background:#fff;color:#111;font-weight:900;font-size:30px;border-radius:30px;padding:4px 18px;white-space:nowrap}
.slots div:last-child{border-color:${R};background:#e01e2622}
.slots div:last-child span{background:${R};color:#fff;font-size:28px}
.trio{display:flex;justify-content:center;gap:20px;margin-top:44px;padding:0 30px}
.trio div{flex:1;max-width:320px;background:#fff;color:#111;border-radius:28px;padding:18px 12px 22px;box-shadow:0 20px 40px #0008;display:flex;flex-direction:column;align-items:center}
.trio img{width:100%;height:260px;object-fit:contain}
.trio b{font-size:40px;font-weight:900;margin-top:8px;letter-spacing:-.02em}
.trio small{font-size:26px;color:#666;margin-bottom:10px}
.trio s{font-size:28px;color:#888}
.trio strong{font-size:46px;font-weight:900;color:${R};letter-spacing:-.03em}
.lua{position:relative;width:420px;height:420px;margin:40px auto 0}
.sol{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 40% 35%,#fff,#f5e9d0 60%,#d9c6a0);box-shadow:0 0 80px #ff6b7088,0 0 0 6px #e01e2655}
.som{position:absolute;top:0;width:420px;height:420px;border-radius:50%;background:#0a0203}
.hora{font-size:200px;font-weight:900;letter-spacing:-.06em;margin-top:20px;line-height:1}
.perg{font-size:150px;margin-top:70px}.lg{height:80px;margin-top:-100px;filter:brightness(0) invert(1)}
.final .sup{}
.lista{list-style:none;margin:36px auto 0;width:820px;text-align:left}
.lista li{font-size:56px;font-weight:600;padding:14px 0;border-bottom:2px solid #ffffff22}
.lista li b{font-weight:900;color:#ff5a60}
.kit{display:block;height:330px;margin:26px auto 0;object-fit:contain}
.btn{display:inline-block;margin-top:26px;background:linear-gradient(180deg,#f0353d,#b5121b);font-size:52px;font-weight:900;padding:30px 70px;border-radius:90px;text-transform:uppercase;box-shadow:0 0 0 6px #e01e2633,0 20px 50px #e01e2680}
.kk{margin:40px auto 0;width:520px;background:#fff;border-radius:34px;padding:20px 20px 26px;box-shadow:0 24px 50px #000a;color:#111}
.kk img{width:100%;height:380px;object-fit:contain}.kk span{display:inline-block;margin-top:8px;background:#e01e26;color:#fff;font-size:40px;font-weight:900;padding:10px 30px;border-radius:40px}
.docs{display:flex;justify-content:center;gap:30px;margin-top:60px}
.docs div{width:380px;height:480px;background:#fbfaf5;color:#173e2d;border-radius:20px 40px 40px 20px;box-shadow:0 26px 50px #000b, inset 18px 0 0 #c0de96;padding:60px 36px 30px 52px;text-align:left;display:flex;flex-direction:column;justify-content:space-between}
.docs i{font-style:normal;font-size:110px}.docs b{font-size:46px;font-weight:900;line-height:1.08;letter-spacing:-.02em}
.vs{display:flex;justify-content:center;gap:30px;margin-top:50px}
.vs div{width:420px;border-radius:30px;padding:30px 20px;display:flex;flex-direction:column;align-items:center;gap:10px}
.vs span{font-size:110px;font-weight:900;line-height:1}.vs b{font-size:58px;font-weight:900;letter-spacing:-.03em}
.vs .nao{background:#ffffff12;color:#ffffff99}.vs .nao b{text-decoration:line-through;text-decoration-color:#e01e26;text-decoration-thickness:8px}
.vs .sim{background:#fff;color:#173e2d}.vs .sim span{color:#2f9e44}
.frs{display:flex;justify-content:center;align-items:flex-end;gap:26px;margin-top:60px}.frs img{height:300px;filter:drop-shadow(0 20px 30px #000c)}
.cmp{display:flex;justify-content:center;gap:26px;margin-top:50px}
.cmp>div{width:440px;border-radius:30px;padding:26px 30px 30px;text-align:left}
.cmp p{font-size:44px;font-weight:900;text-transform:uppercase;letter-spacing:3px;margin-bottom:14px}
.cmp>div>div{display:flex;justify-content:space-between;font-size:38px;font-weight:600;padding:12px 0;border-top:2px solid #0001}
.cmp>div>div b{font-weight:900}
.cmp .hj{background:#fff;color:#111}.cmp .hj p{color:#2f9e44}.cmp .hj b{color:#e01e26}
.cmp .am{background:#ffffff14;color:#fff}.cmp .am p{color:#ff6b70}.cmp .am>div{border-color:#fff2}
.nova{width:360px;height:360px;border-radius:50%;margin:46px auto 0;background:radial-gradient(circle at 60% 40%,#1a0507,#050102);box-shadow:0 0 0 4px #ffffff30,0 0 90px #e01e2666, inset -14px 8px 30px #ffffff22}
.ver{font-style:normal;color:#ff5a60}
.frasc{left:0;right:0;top:925px;display:flex;justify-content:center;gap:24px}
.frasc div{width:220px;background:#fffffff2;border-radius:26px;padding:14px 10px 12px;text-align:center;color:#173e2d;box-shadow:0 18px 40px #0008}
.frasc img{height:190px;object-fit:contain}.frasc b{display:block;font-size:28px;font-weight:900;line-height:1.1;margin-top:6px}
.chips{left:60px;right:60px;top:960px;display:flex;flex-wrap:wrap;justify-content:center;gap:18px 16px}
.chips span{position:relative;font-size:64px;font-weight:900;color:#111;background:#fff;padding:12px 30px;border-radius:60px;box-shadow:0 12px 30px #0007}
.chips span i{position:absolute;left:16px;right:16px;top:50%;height:8px;background:#e01e26;border-radius:6px;transform-origin:left center;transform:scaleX(0)}
.pipf{position:absolute;left:${plano.pip.x - 8}px;top:${plano.pip.y - 8}px;width:${plano.pip.w + 16}px;height:${plano.pip.h + 16}px;border-radius:28px;background:#fff;opacity:0;box-shadow:0 20px 50px #000a}
#cap{position:absolute;left:60px;right:60px;top:1240px;text-align:center}
#cap span{display:inline-block;font-size:74px;font-weight:900;letter-spacing:-.025em;margin:0 10px;color:#fff;-webkit-text-stroke:3px #000;paint-order:stroke fill;text-shadow:0 8px 24px #000c}
#cap span.r{color:#fff;background:${R};-webkit-text-stroke:0;padding:0 14px;border-radius:12px;text-shadow:none}
.fx{position:absolute;opacity:0}
.tarja{left:80px;right:80px;text-align:center}
.tarja span{display:inline;font-size:84px;line-height:1.22;font-weight:900;letter-spacing:-.04em;background:${R};padding:4px 26px;border-radius:16px;box-decoration-break:clone;-webkit-box-decoration-break:clone;text-transform:uppercase;box-shadow:0 18px 40px #0008}
.gancho{left:60px;right:60px;top:1120px;text-align:center}
.gancho p{display:inline;font-size:100px;font-weight:900;line-height:1.12;letter-spacing:-.04em;text-transform:uppercase;background:#000;box-decoration-break:clone;-webkit-box-decoration-break:clone;padding:4px 24px;border-radius:16px}
.gancho p b{color:#ff4d55}
.selo{left:640px;top:1000px;width:380px;text-align:center;background:${R};font-size:56px;font-weight:900;line-height:1.05;padding:26px 20px;border-radius:24px;border:6px solid #fff;text-transform:uppercase;box-shadow:0 20px 40px #0009}
.botao{left:110px;right:110px;top:1500px;text-align:center;background:linear-gradient(180deg,#f0353d,#b5121b);font-size:60px;font-weight:900;padding:34px 0;border-radius:90px;text-transform:uppercase;box-shadow:0 0 0 8px #e01e2640,0 24px 50px #e01e2690}
</style></head><body>
${cards.map(cardHtml).join('')}<div class="pipf"></div>${extras.map(fxHtml).join('')}<div id="cap"></div>
<script>
const C=${JSON.stringify(cards)}, X=${JSON.stringify(extras)}, K=${JSON.stringify(caps)}, RED=${JSON.stringify(plano.vermelho || [])};
const mola=x=>x<=0?0:x>=1?1:1-Math.exp(-7*x)*Math.cos(9*x);
const ease=x=>x<=0?0:x>=1?1:1-Math.pow(1-x,3);
const lim=w=>w.toLowerCase().replace(/[.,!?;:]/g,'');
let cur=-2;
window.render=t=>{
  let emCard=false, emAny=false;
  C.forEach((c,k)=>{const el=document.querySelector('.card[data-k="'+k+'"]'); const on=t>=c.ini&&t<c.fim; if(on) emAny=true; if(on&&!['final','pergunta'].includes(c.tipo)) emCard=true;
    const vi=(t-c.ini)/0.28; el.style.opacity=on?1:0; el.style.transform='scale('+(1.06-0.06*ease(vi))+')';
    const lt=t-c.ini;
    el.querySelectorAll('.perg,.sup,.mega,.big2,.big3,.dig,.recibo,.hora,.lista,.lab').forEach((e,j)=>{const m=mola((lt-0.06*j)/0.4); e.style.transform='translateY('+(50*(1-m))+'px)'; e.style.opacity=Math.min(1,ease((lt-0.06*j)/0.2));});
    el.querySelectorAll('.sub').forEach(e=>{e.style.opacity=ease((lt-0.5)/0.3);});
    el.querySelectorAll('.thumbs [data-j],.trio [data-j]').forEach(e=>{const j=+e.dataset.j; const at=c.tipo==='linha'?(c.extra.t||[0.3,1.5,2.7])[j]:0.35+0.15*j; const m=mola((lt-at)/0.4); e.style.opacity=lt<at?0:1; e.style.transform='translateY('+(90*(1-m))+'px) scale('+(0.7+0.3*m)+')';});
    el.querySelectorAll('.slots [data-j]').forEach(e=>{const j=+e.dataset.j; const at=0.35+0.32*j; const m=mola((lt-at)/0.4); const im=e.querySelector('img'), sp=e.querySelector('span'); im.style.opacity=lt<at?0:1; im.style.transform='scale('+(0.5+0.5*m)+') rotate('+(j===4?(-8*m):0)+'deg)'; sp.style.opacity=lt<at?0:1;});
    const c15=el.querySelector('[data-cont15]'); if(c15) c15.textContent=Math.round(15*ease(lt/0.9));
    el.querySelectorAll('.docs [data-j],.vs [data-j],.cmp [data-j],.frs [data-j]').forEach(e=>{const j=+e.dataset.j; const at=0.3+(c.tipo==='carrinho'||c.tipo==='fases'?0.7:0.3)*j; const m=mola((lt-at)/0.4); e.style.opacity=lt<at?0:1; e.style.transform='translateY('+(80*(1-m))+'px) scale('+(0.75+0.25*m)+')';});
    el.querySelectorAll('.kk,.nova').forEach(e=>{const m=mola((lt-0.35)/0.45); e.style.opacity=lt<0.35?0:1; e.style.transform='scale('+(0.6+0.4*m)+')';});
    const cn=el.querySelector('[data-cont]'); if(cn) cn.textContent=Math.round(300*ease(lt/1.1));
    const som=el.querySelector('.som'); if(som){const p=ease(lt/(c.fim-c.ini)); som.style.left=(420-430*p*0.92)+'px';}
    const btn=el.querySelector('.btn'); if(btn){const s=1+0.04*Math.sin(lt*6); btn.style.transform='scale('+s+')'; btn.style.opacity=ease((lt-0.6)/0.3);}
    const kit=el.querySelector('.kit'); if(kit){const m=mola((lt-0.4)/0.5); kit.style.opacity=lt<0.4?0:1; kit.style.transform='scale('+(0.6+0.4*m)+')';}
  });
  document.querySelector('.pipf').style.opacity=emCard?1:0;
  X.forEach((f,k)=>{const el=document.querySelector('[data-f="'+k+'"]'); const on=t>=f.ini&&t<f.fim; const m=mola((t-f.ini)/0.35);
    el.style.opacity=on?Math.min(1,ease((t-f.ini)/0.15)):0;
    if(f.tipo==='selo') el.style.transform='scale('+(1.6-0.6*m)+') rotate('+(-8+0*m)+'deg)';
    else if(f.tipo==='botao') el.style.transform='translateY('+(120*(1-m))+'px) scale('+(1+0.035*Math.sin((t-f.ini)*6))+')';
    else if(f.itens){ el.style.transform='none'; f.itens.forEach((it,j)=>{const e=el.querySelector('[data-j="'+j+'"]'); const lt=t-f.ini-(it.t||0.15*j); const mm=mola(lt/0.35); e.style.opacity=lt<0?0:1; e.style.transform='translateY('+(60*(1-mm))+'px) scale('+(0.6+0.4*mm)+')'; const r=e.querySelector('i'); if(r) r.style.transform='scaleX('+(f.risca!==undefined?ease((t-f.ini-f.risca-0.1*j)/0.25):0)+')';}); }
    else el.style.transform='translateY('+(40*(1-m))+'px) scale('+(0.85+0.15*m)+')';});
  const cap=document.querySelector('#cap'); const i=K.findIndex(b=>t>=b.ini&&t<b.fim);
  if(i!==cur){cur=i; cap.innerHTML=i<0?'':K[i].p.map(w=>'<span class="'+(RED.includes(lim(w))?'r':'')+'">'+w+'</span>').join(' ');}
  const emG=X.some(f=>f.tipo==='gancho'&&t>=f.ini&&t<f.fim); cap.style.opacity=(i<0||emAny||emG)?0:1; if(i>=0){const k=mola((t-K[i].ini)/0.22); cap.style.transform='translateY('+(26*(1-k))+'px) scale('+(0.9+0.1*k)+')';}
};
</script></body></html>`;
const hf = path.join(work, 'overlay.html');
fs.writeFileSync(hf, html);

(async () => {
  const so = process.argv[3] ? process.argv[3].split(',').map(Number) : null;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: W, height: H } });
  await p.goto('file://' + hf); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  if (so) { // só quadros de amostra
    for (const s of so) { await p.evaluate(x => window.render(x), s); await p.screenshot({ path: path.join(work, `amostra-${s}.png`), omitBackground: true }); }
    await b.close(); return;
  }
  if (!process.env.SO_COMPOR) for (let f = 0; f < N; f++) {
    await p.evaluate(x => window.render(x), f / FPS);
    await p.screenshot({ path: path.join(work, String(f).padStart(5, '0') + '.png'), omitBackground: true });
  }
  await b.close();
  // 4) composição: base + camada + janela da apresentadora nos cartões
  const en = cards.filter(c => !SEMPIP.includes(c.tipo)).map(c => `between(t,${c.ini.toFixed(3)},${(c.fim - 0.001).toFixed(3)})`).join('+') || '0';
  const P = plano.pip;
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(work, '%05d.png'), '-c:v', 'qtrle', '-pix_fmt', 'argb', path.join(work, 'overlay.mov')]);
  const vf = `[0:v]split[b0][b1];[b1]crop=iw*0.82:iw*0.82*${P.h}/${P.w}:(iw-iw*0.82)/2:ih*0.08,scale=${P.w}:${P.h}[pip];` +
    `[b0][1:v]overlay=0:0:format=auto:shortest=1[o1];[o1][pip]overlay=${P.x}:${P.y}:enable='${en}',format=yuv420p[v]`;
  const out = path.join(D, 'final', plano.saida);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', base.replace('.mp4', '.mov'), '-i', path.join(work, 'overlay.mov'),
    '-filter_complex', vf, '-map', '[v]', '-map', '0:a', '-t', String(DUR),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-c:a', 'aac', '-b:a', '192k', '-af', 'loudnorm=I=-14:TP=-1:LRA=11', '-movflags', '+faststart', out], { stdio: 'inherit' });
  console.log('ok', out);
})();
