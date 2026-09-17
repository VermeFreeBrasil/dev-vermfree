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
    [...document.querySelectorAll('.vf-presc__card:not([data-vf-presc-clone]) .vf-presc__quote')]
      .map((q) => q.textContent.trim()));
  conferir('sem frase neutra, só quem tem frase própria mostra frase', frases.length === 1, frases.length + ' frases: ' + frases.join(' | '));
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
  conferir('os 9 médicos rolam no trilho', rola.cards >= 9 && rola.sw > rola.cw, JSON.stringify(rola));

  conferir('nenhuma seta na página', await p.evaluate(() => document.querySelectorAll('.vf-presc__nav').length) === 0);

  // ---------- laço infinito ----------
  const laco = await p.evaluate(() => {
    var t = document.querySelector('[data-vf-presc-track]');
    var clones = t.querySelectorAll('[data-vf-presc-clone]');
    var reais = t.children.length - clones.length;
    return {
      total: t.children.length, reais: reais, clones: clones.length,
      scroll: t.scrollLeft,
      cloneEscondido: [].every.call(clones, (c) => c.getAttribute('aria-hidden') === 'true'),
      cloneForaDoTab: [].every.call(t.querySelectorAll('[data-vf-presc-clone] a'), (a) => a.tabIndex === -1),
    };
  });
  conferir('um conjunto clonado de cada lado', laco.reais === 9 && laco.clones === 18, JSON.stringify(laco));
  conferir('começa no conjunto do meio, não na ponta', laco.scroll > 100, 'scrollLeft ' + laco.scroll);
  conferir('clone não é lido nem tabulável', laco.cloneEscondido && laco.cloneForaDoTab, JSON.stringify(laco));

  // Rolar até quase o fim tem de voltar para o meio, sem bater na ponta.
  const volta = await p.evaluate(async () => {
    var t = document.querySelector('[data-vf-presc-track]');
    var w = t.children[9].offsetLeft - t.children[0].offsetLeft;
    t.scrollLeft = w * 1.9;
    await new Promise((r) => setTimeout(r, 400));
    return { w: Math.round(w), depois: Math.round(t.scrollLeft), max: t.scrollWidth - t.clientWidth };
  });
  conferir('perto do fim, a rolagem volta um conjunto', volta.depois < volta.w * 1.5, JSON.stringify(volta));
  conferir('nunca encosta no fim do trilho', volta.depois < volta.max - 10, JSON.stringify(volta));

  const inicio = await p.evaluate(async () => {
    var t = document.querySelector('[data-vf-presc-track]');
    var w = t.children[9].offsetLeft - t.children[0].offsetLeft;
    t.scrollLeft = w * 0.1;
    await new Promise((r) => setTimeout(r, 400));
    return { w: Math.round(w), depois: Math.round(t.scrollLeft) };
  });
  conferir('perto do começo, avança um conjunto', inicio.depois > inicio.w * 0.5, JSON.stringify(inicio));

  // ---------- arrastar com o mouse ----------
  const antes = await p.evaluate(() => document.querySelector('[data-vf-presc-track]').scrollLeft);
  const cx = await p.evaluate(() => {
    var r = document.querySelector('[data-vf-presc-track]').getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  await p.mouse.move(cx.x, cx.y);
  await p.mouse.down();
  for (let i = 1; i <= 8; i++) await p.mouse.move(cx.x - i * 30, cx.y);
  await p.mouse.up();
  await p.waitForTimeout(400);
  const depois = await p.evaluate(() => document.querySelector('[data-vf-presc-track]').scrollLeft);
  conferir('arrastar com o mouse rola o trilho', depois > antes + 100, antes + ' -> ' + depois);

  // Um arrasto que termina em cima do card não pode virar clique no @.
  const abriu = await p.evaluate(() => {
    var a = document.querySelector('.vf-presc__ig');
    var r = a.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  let navegou = false;
  p.once('popup', () => { navegou = true; });
  await p.mouse.move(abriu.x + 200, abriu.y);
  await p.mouse.down();
  for (let i = 1; i <= 8; i++) await p.mouse.move(abriu.x + 200 - i * 25, abriu.y);
  await p.mouse.up();
  await p.waitForTimeout(500);
  conferir('arrastar e soltar em cima do card não abre o Instagram', !navegou);

  // ---------- 4 médicos: grade, todos visíveis de uma vez ----------
  // Era a queixa: o carrossel escondia o quarto card no desktop.
  await p.goto(base + '/presc-quatro.html');
  await p.waitForTimeout(400);
  const quatro = await p.evaluate(() => {
    var t = document.querySelector('[data-vf-presc-track]');
    var tr = t.getBoundingClientRect();
    var cards = [...t.querySelectorAll('.vf-presc__card')];
    var vw = document.documentElement.clientWidth;
    return {
      n: cards.length,
      display: getComputedStyle(t).display,
      transbordo: t.scrollWidth - t.clientWidth,
      semSeta: document.querySelectorAll('.vf-presc__nav').length === 0,
      semClone: t.querySelectorAll('[data-vf-presc-clone]').length === 0,
      todosNaTela: cards.every((c) => {
        var r = c.getBoundingClientRect();
        return r.left >= -0.5 && r.right <= vw + 0.5 && r.width > 100;
      }),
      larguras: cards.map((c) => Math.round(c.getBoundingClientRect().width)),
    };
  });
  conferir('com 4 médicos o trilho vira grade', quatro.display === 'grid', JSON.stringify(quatro));
  conferir('os 4 aparecem de uma vez, nenhum fora da tela', quatro.todosNaTela && quatro.n === 4, JSON.stringify(quatro));
  conferir('grade não transborda', quatro.transbordo <= 0, JSON.stringify(quatro));
  conferir('grade não tem seta nem clone', quatro.semSeta && quatro.semClone, JSON.stringify(quatro));

  // ---------- poucos médicos: sem seta inútil, sem corte ----------
  await p.goto(base + '/presc-poucos.html');
  await p.waitForTimeout(400);
  const poucos = await p.evaluate(() => {
    var t = document.querySelector('[data-vf-presc-track]');
    var cards = [...t.querySelectorAll('.vf-presc__card')];
    var tr = t.getBoundingClientRect();
    var cortado = cards.some((c) => {
      var r = c.getBoundingClientRect();
      return r.left < tr.left - 0.5 || r.right > tr.right + 0.5;
    });
    return {
      escondida: document.querySelectorAll('.vf-presc__nav').length === 0,
      transbordo: t.scrollWidth - t.clientWidth, cortado: cortado,
    };
  });
  conferir('sem transbordo, nada de seta', poucos.escondida, JSON.stringify(poucos));
  conferir('com 2 médicos nenhum card fica cortado', !poucos.cortado, JSON.stringify(poucos));
  const larg2 = await p.evaluate(() =>
    [...document.querySelectorAll('.vf-presc__card')].map((c) => Math.round(c.getBoundingClientRect().width)));
  conferir('com 2 médicos o card não estica pra meia tela', Math.max(...larg2) <= 320, 'larguras: ' + larg2.join(','));

  // ---------- prescritor sem foto ainda ----------
  await p.goto(base + '/presc.html');
  await p.waitForTimeout(400);
  const semFoto = await p.evaluate(() => {
    var phs = [...document.querySelectorAll('.vf-presc__card:not([data-vf-presc-clone]) .vf-presc__img--placeholder')];
    return {
      n: phs.length,
      textos: phs.map((e) => e.textContent.trim()),
      preenche: phs.every((e) => {
        var r = e.getBoundingClientRect();
        var c = e.closest('.vf-presc__media').getBoundingClientRect();
        return Math.abs(r.width - c.width) < 1 && Math.abs(r.height - c.height) < 1;
      }),
    };
  });
  conferir('card sem foto mostra iniciais', semFoto.n === 5 && semFoto.textos.join(',') === 'EB,KG,CM,GD,TB', JSON.stringify(semFoto));
  conferir('placeholder ocupa a área da foto inteira', semFoto.preenche, JSON.stringify(semFoto));

  // ---------- deslize com o dedo ----------
  // O pedido era este: arrastar com o dedo, sem seta. Quem rola aqui é o
  // navegador; o que se testa é que o laço infinito não atrapalha.
  const ctxT = await b.newContext({ viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true });
  const pt = await ctxT.newPage();
  const errosT = [];
  pt.on('pageerror', (e) => errosT.push(String(e)));
  await pt.goto(base + '/presc.html');
  await pt.waitForTimeout(500);

  const caixa = await pt.evaluate(() => {
    var r = document.querySelector('[data-vf-presc-track]').getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  const antesT = await pt.evaluate(() => document.querySelector('[data-vf-presc-track]').scrollLeft);
  await pt.touchscreen.tap(caixa.x, caixa.y);
  // Um deslize curto primeiro: tem de andar e ficar andado.
  await pt.evaluate(() => { document.querySelector('[data-vf-presc-track]').scrollLeft += 700; });
  await pt.waitForTimeout(300);
  const curto = await pt.evaluate(() => document.querySelector('[data-vf-presc-track]').scrollLeft);

  // Depois vários deslizes longos, para provar que não encalha na ponta.
  for (let volta = 0; volta < 4; volta++) {
    await pt.evaluate(() => { document.querySelector('[data-vf-presc-track]').scrollLeft += 900; });
    await pt.waitForTimeout(250);
  }
  const depoisT = await pt.evaluate(() => {
    var t = document.querySelector('[data-vf-presc-track]');
    var w = t.children[9].offsetLeft - t.children[0].offsetLeft;
    return { x: t.scrollLeft, w: Math.round(w), max: t.scrollWidth - t.clientWidth };
  });
  conferir('no celular o trilho anda com o deslize', curto > antesT + 500, antesT + ' -> ' + curto);
  conferir('deslizando muito, continua longe das duas pontas',
    depoisT.x > 20 && depoisT.x < depoisT.max - 20, JSON.stringify(depoisT));
  conferir('nenhum erro de JS no celular', errosT.length === 0, errosT.join(' | '));
  await ctxT.close();

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
