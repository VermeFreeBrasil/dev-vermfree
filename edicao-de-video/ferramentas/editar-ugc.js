// Edição UGC captação 11/11: overlays (gancho, legendas, selo 11.11, CTA) renderizados quadro a quadro
// no Chromium com fundo transparente, depois compostos no ffmpeg com zoom por frase.
// Uso: node editar.js <plano.json>
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const plano = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const D = path.dirname(path.resolve(process.argv[2]));
const FPS = 30, W = 1080, H = 1920;
const dur = plano.duracao;
const N = Math.round(dur * FPS);
const work = path.join(D, 'tmp-' + plano.id);
fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(work, { recursive: true });

// Quebra cada frase em blocos de até 4 palavras, com tempo proporcional ao tamanho.
const blocos = [];
for (const s of plano.frases) {
  const w = s.texto.split(/\s+/);
  const grupos = [];
  for (let i = 0; i < w.length; i += 4) grupos.push(w.slice(i, i + 4));
  if (grupos.length > 1 && grupos[grupos.length - 1].length === 1) { const u = grupos.pop(); grupos[grupos.length - 1].push(...u); }
  const total = grupos.reduce((a, g) => a + g.join(' ').length, 0);
  let t = s.ini;
  for (const g of grupos) {
    const len = (s.fim - s.ini) * g.join(' ').length / total;
    blocos.push({ ini: t, fim: t + len, palavras: g });
    t += len;
  }
}
const destaque = new Set(plano.destaques.map(x => x.toLowerCase()));

const logo = 'file://' + path.join(D, '..', 'art', 'logo-shopify-medium.png');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;background:transparent;overflow:hidden;font-family:Inter,sans-serif}
#hook{position:absolute;left:60px;right:60px;top:250px;text-align:center}
#hook p{display:inline;font-size:76px;line-height:1.12;font-weight:900;color:#fff;letter-spacing:-.03em;
  background:#173e2d;box-decoration-break:clone;-webkit-box-decoration-break:clone;padding:6px 20px;border-radius:16px}
#hook p b{color:#c0de96}
#cap{position:absolute;left:50px;right:50px;top:1400px;text-align:center}
#cap span{display:inline-block;font-size:66px;font-weight:900;color:#fff;letter-spacing:-.02em;margin:0 9px;
  -webkit-text-stroke:2px #102e21;text-shadow:0 6px 0 #102e21,0 10px 24px #000a;paint-order:stroke fill}
#cap span.hl{color:#c0de96}
#cap span.red{color:#ff5a5f}
#selo{position:absolute;left:50%;top:230px;transform:translateX(-50%);display:flex;align-items:center;gap:22px;
  background:#d7262f;color:#fff;padding:22px 36px;border-radius:28px;box-shadow:0 18px 40px #0007;white-space:nowrap}
#selo b{font-size:92px;font-weight:900;letter-spacing:-.04em;line-height:1}
#selo span{font-size:30px;font-weight:800;line-height:1.15;text-transform:uppercase;letter-spacing:1px}
#cta{position:absolute;left:70px;right:70px;top:1330px;background:#fff;border-radius:34px;padding:34px 30px 30px;text-align:center;box-shadow:0 24px 60px #0008}
#cta img{height:54px}
#cta p{font-size:44px;font-weight:900;color:#173e2d;margin:14px 0 18px;letter-spacing:-.02em;line-height:1.1}
#cta div{background:linear-gradient(180deg,#e2333b,#b5121b);color:#fff;font-size:42px;font-weight:900;border-radius:80px;padding:24px 0}
</style></head><body>
<div id="hook"><p></p></div><div id="cap"></div>
<div id="selo"><b>11.11</b><span>condição especial<br>só no Grupo VIP</span></div>
<div id="cta"><img src="${logo}"><p>O maior desconto da história da VermeFree abre primeiro no grupo</p><div>Entre no Grupo VIP 👇</div></div>
<script>
const P=${JSON.stringify({ hook: plano.gancho, selo: plano.selo, cta: plano.cta })};
const B=${JSON.stringify(blocos)}; const HL=${JSON.stringify([...destaque])}; const RED=${JSON.stringify(plano.vermelho || [])};
// mola amortecida 0→1 (overshoot pequeno)
const mola=x=>x<=0?0:x>=1?1:1-Math.exp(-7*x)*Math.cos(9*x);
const ease=x=>x<=0?0:x>=1?1:1-Math.pow(1-x,3);
const limpa=w=>w.toLowerCase().replace(/[.,!?;:"“”]/g,'');
let atual=-1;
window.render=t=>{
  const hook=document.querySelector('#hook'); const hp=hook.querySelector('p');
  if(!hp.innerHTML) hp.innerHTML=P.hook.texto;
  const hi=(t-P.hook.ini)/0.35, ho=(P.hook.fim-t)/0.25;
  const hv=Math.min(mola(hi),ease(ho)); hook.style.opacity=t<P.hook.ini||t>P.hook.fim?0:Math.min(1,hv*1.3);
  hook.style.transform='scale('+(0.85+0.15*mola(hi))+')';
  const cap=document.querySelector('#cap');
  const i=B.findIndex(b=>t>=b.ini&&t<b.fim);
  const emCta=t>=P.cta.ini;
  if(i!==atual){atual=i;cap.innerHTML=i<0?'':B[i].palavras.map(w=>'<span class="'+(RED.includes(limpa(w))?'red':HL.includes(limpa(w))?'hl':'')+'">'+w+'</span>').join(' ');}
  cap.style.opacity=(i<0||emCta)?0:1;
  if(i>=0){const k=mola((t-B[i].ini)/0.22); cap.style.transform='translateY('+(30*(1-k))+'px) scale('+(0.9+0.1*k)+')';}
  const selo=document.querySelector('#selo'); const si=(t-P.selo.ini)/0.4, so=(P.selo.fim-t)/0.25;
  const sv=t<P.selo.ini||t>P.selo.fim?0:Math.min(mola(si),ease(so));
  selo.style.opacity=Math.min(1,sv*1.4); selo.style.transform='translateX(-50%) scale('+(0.6+0.4*mola(si))+') rotate('+(-4*(1-mola(si)))+'deg)';
  const cta=document.querySelector('#cta'); const ci=(t-P.cta.ini)/0.45;
  cta.style.opacity=t<P.cta.ini?0:Math.min(1,ci*2); cta.style.transform='translateY('+(160*(1-mola(ci)))+'px)';
};
</script></body></html>`;
const hf = path.join(work, 'overlay.html');
fs.writeFileSync(hf, html);

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: W, height: H } });
  await p.goto('file://' + hf);
  await p.evaluate(() => document.fonts.ready);
  for (let f = 0; f < N; f++) {
    await p.evaluate(t => window.render(t), f / FPS);
    await p.screenshot({ path: path.join(work, String(f).padStart(5, '0') + '.png'), omitBackground: true });
  }
  await b.close();

  // zoom por frase: alterna 1.00 / 1.07 nas trocas de frase
  let z = '1';
  plano.frases.forEach((s, k) => { if (k % 2 === 1) z = `if(between(in/${FPS},${s.ini},${s.fim}),1.07,${z})`; });
  const vf = `[0:v]fps=${FPS},scale=${W}:${H}:flags=lanczos,zoompan=z='${z}':x='iw/2-(iw/zoom/2)':y='ih*0.38-(ih/zoom*0.38)':d=1:s=${W}x${H}:fps=${FPS}[base];[base][1:v]overlay=0:0:format=auto,format=yuv420p[v]`;
  const out = path.join(D, 'final', plano.saida);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', plano.entrada, '-framerate', String(FPS), '-i', path.join(work, '%05d.png'),
    '-filter_complex', vf, '-map', '[v]', '-map', '0:a', '-t', String(dur),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-c:a', 'aac', '-b:a', '192k', '-af', 'loudnorm=I=-14:TP=-1:LRA=11', '-movflags', '+faststart', out], { stdio: 'inherit' });
  console.log('ok', out);
})();
