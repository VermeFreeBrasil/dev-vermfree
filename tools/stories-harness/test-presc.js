// Dirige a seção de prescritores num Chromium real. Cobre os quatro defeitos
// que a v1 tinha: botões desalinhados, @ vazando, foto sem enquadramento e
// grade que só servia pra 4.
const http = require('http'); const fs = require('fs'); const path = require('path');
const { chromium } = require('playwright');
const DIR = __dirname;
const TIPOS = { '.html': 'text/html', '.png': 'image/png', '.webm': 'video/webm' };

const resultados = [];
const conferir = (n, c, d) => resultados.push([c ? 'PASSOU' : 'FALHOU', c ? n : n + ' — ' + (d || 'condição falsa')]);

function servir(req, res) {
  const url = req.url.split('?')[0];
  const arquivo = path.join(DIR, url === '/' ? 'presc.html' : url);
  if (!arquivo.startsWith(DIR) || !fs.existsSync(arquivo)) { res.writeHead(404); return res.end(); }
  const tipo = TIPOS[path.extname(arquivo)] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': tipo });
  fs.createReadStream(arquivo).pipe(res);
}
const servidor = http.createServer(servir);

(async () => {
  await new Promise((r) => servidor.listen(0, r));
  const base = 'http://127.0.0.1:' + servidor.address().port;
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

  // ---------- responsividade ----------
  for (const w of [320, 360, 390, 414, 768, 1280, 1600]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 800 } });
    const p = await ctx.newPage();
    await p.goto(base + '/presc.html');
    await p.waitForTimeout(150);
    const m = await p.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }));
    conferir('sem overflow horizontal em ' + w + 'px', m.s <= m.c, 'página ' + m.s + '/' + m.c);
    await ctx.close();
  }

  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  const erros = [];
  p.on('pageerror', (e) => erros.push(String(e)));
  await p.goto(base + '/presc.html');
  await p.waitForTimeout(400);

  conferir('nenhum erro de JS', erros.length === 0, erros.join(' | '));

  // ---------- o defeito nº1 da v1: botões do Instagram desalinhados ----------
  const topos = await p.evaluate(() => {
    var cards = [...document.querySelectorAll('.vf-presc__card')];
    return cards.map((c) => {
      var a = c.querySelector('.vf-presc__ig');
      var r = c.getBoundingClientRect();
      return a ? Math.round(r.bottom - a.getBoundingClientRect().bottom) : null;
    }).filter((v) => v !== null);
  });
  const espalhamento = Math.max(...topos) - Math.min(...topos);
  conferir('botões do Instagram alinhados no rodapé', espalhamento <= 1, 'variação de ' + espalhamento + 'px: ' + topos.join(','));

  // ---------- os cards têm a mesma altura ----------
  const alturas = await p.evaluate(() =>
    [...document.querySelectorAll('.vf-presc__card')].map((c) => Math.round(c.getBoundingClientRect().height)));
  conferir('todos os cards com a mesma altura', new Set(alturas).size === 1, 'alturas: ' + alturas.join(','));

  // ---------- o defeito nº2: @ comprido vazando do card ----------
  const vazando = await p.evaluate(() => {
    var fora = [];
    document.querySelectorAll('.vf-presc__card').forEach((c) => {
      var r = c.getBoundingClientRect();
      c.querySelectorAll('.vf-presc__ig, .vf-presc__selo, .vf-presc__fita').forEach((e) => {
        var er = e.getBoundingClientRect();
        if (er.right > r.right + 0.5 || er.left < r.left - 0.5) fora.push(e.className + ' em ' + (c.querySelector('.vf-presc__name') || {}).textContent);
      });
    });
    return fora;
  });
  conferir('nada vaza pela borda do card (@ comprido, selo, fita)', vazando.length === 0, vazando.join(' | '));

  // ---------- frase neutra no card sem frase própria ----------
  const frases = await p.evaluate(() =>
    [...document.querySelectorAll('.vf-presc__quote')].map((q) => q.textContent.trim()));
  conferir('todo card tem frase', frases.length === 6 && frases.every((f) => f.length > 10), frases.length + ' frases');
  conferir('card sem frase própria cai na neutra', /indico aos meus pacientes/.test(frases[1]), frases[1]);
  conferir('card com frase própria mantém a dele', /Acompanho a formulação/.test(frases[0]), frases[0]);

  // ---------- o defeito nº3: enquadramento da foto ----------
  const foco = await p.evaluate(() => {
    var img = document.querySelectorAll('.vf-presc__img')[2];
    var cs = getComputedStyle(img);
    return { pos: cs.objectPosition, t: cs.transform };
  });
  conferir('zoom e foco aplicados na foto', foco.pos === '60% 18%' && foco.t !== 'none', JSON.stringify(foco));

  // ---------- o defeito nº4: escala além de 4 médicos ----------
  const rola = await p.evaluate(() => {
    var t = document.querySelector('[data-vf-presc-track]');
    return { sw: t.scrollWidth, cw: t.clientWidth, cards: t.querySelectorAll('.vf-presc__card').length };
  });
  conferir('6 médicos cabem no trilho e ele rola', rola.cards === 6 && rola.sw > rola.cw, JSON.stringify(rola));

  const setasVisiveis = await p.evaluate(() => {
    var pv = document.querySelector('[data-vf-presc-prev]');
    return !pv.hidden;
  });
  conferir('com transbordo, as setas aparecem', setasVisiveis);

  // ---------- a seta anda mesmo ----------
  const antes = await p.evaluate(() => document.querySelector('[data-vf-presc-track]').scrollLeft);
  await p.click('[data-vf-presc-next]');
  await p.waitForTimeout(600);
  const depois = await p.evaluate(() => document.querySelector('[data-vf-presc-track]').scrollLeft);
  conferir('seta avança o trilho', depois > antes, antes + ' -> ' + depois);

  // ---------- poucos médicos: sem seta inútil, sem corte ----------
  await p.goto(base + '/presc-poucos.html');
  await p.waitForTimeout(400);
  const poucos = await p.evaluate(() => {
    var t = document.querySelector('[data-vf-presc-track]');
    var pv = document.querySelector('[data-vf-presc-prev]');
    var cards = [...t.querySelectorAll('.vf-presc__card')];
    var tr = t.getBoundingClientRect();
    var cortado = cards.some((c) => {
      var r = c.getBoundingClientRect();
      return r.left < tr.left - 0.5 || r.right > tr.right + 0.5;
    });
    return { escondida: pv.hidden, transbordo: t.scrollWidth - t.clientWidth, cortado: cortado };
  });
  conferir('sem transbordo, as setas somem', poucos.escondida, JSON.stringify(poucos));
  conferir('com 2 médicos nenhum card fica cortado', !poucos.cortado, JSON.stringify(poucos));

  conferir('nenhum erro de JS no fim', erros.length === 0, erros.join(' | '));

  await b.close();
  servidor.close();

  let falhou = 0;
  for (const [st, n] of resultados) {
    console.log((st === 'PASSOU' ? '  ok  ' : '  XX  ') + n);
    if (st !== 'PASSOU') falhou++;
  }
  console.log('\n' + (resultados.length - falhou) + '/' + resultados.length + ' passaram');
  process.exit(falhou ? 1 : 0);
})();
