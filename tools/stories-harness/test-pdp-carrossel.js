// PDP com as duas superfícies de stories na mesma página. O risco novo é o
// visualizador vir renderizado duas vezes (a régua pede um, o carrossel pede
// outro): IDs duplicados, dois roots, registros se atropelando.
const http = require('http'); const fs = require('fs'); const path = require('path');
const { chromium } = require('playwright');
const DIR = __dirname;
const PADRAO = 'pdp-carrossel.html';
const TIPOS = { '.html': 'text/html', '.webm': 'video/webm', '.png': 'image/png' };

const resultados = [];
const conferir = (n, c, d) => resultados.push([c ? 'PASSOU' : 'FALHOU', c ? n : n + ' — ' + (d || 'condição falsa')]);

function servir(req, res) {
  const url = req.url.split('?')[0];
  const arquivo = path.join(DIR, url === '/' ? PADRAO : url);
  if (!arquivo.startsWith(DIR) || !fs.existsSync(arquivo)) { res.writeHead(404); return res.end(); }
  const tipo = TIPOS[path.extname(arquivo)] || 'application/octet-stream';
  const tamanho = fs.statSync(arquivo).size;
  const faixa = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
  if (faixa) {
    const inicio = faixa[1] ? parseInt(faixa[1], 10) : 0;
    const fim = faixa[2] ? parseInt(faixa[2], 10) : tamanho - 1;
    res.writeHead(206, { 'Content-Type': tipo, 'Accept-Ranges': 'bytes',
      'Content-Range': 'bytes ' + inicio + '-' + fim + '/' + tamanho, 'Content-Length': fim - inicio + 1 });
    return fs.createReadStream(arquivo, { start: inicio, end: fim }).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': tipo, 'Accept-Ranges': 'bytes', 'Content-Length': tamanho });
  fs.createReadStream(arquivo).pipe(res);
}
const servidor = http.createServer(servir);

(async () => {
  await new Promise((r) => servidor.listen(0, r));
  const base = 'http://127.0.0.1:' + servidor.address().port;
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

  // ---------- responsividade com as duas seções juntas ----------
  for (const w of [320, 360, 390, 414, 768, 1280]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 800 } });
    const p = await ctx.newPage();
    await p.goto(base + '/' + PADRAO);
    await p.waitForTimeout(200);
    const m = await p.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }));
    conferir('sem overflow horizontal em ' + w + 'px', m.s <= m.c, 'página ' + m.s + '/' + m.c);
    await ctx.close();
  }

  const ctx = await b.newContext({ viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  const erros = [];
  p.on('pageerror', (e) => erros.push(String(e)));
  await p.goto(base + '/' + PADRAO);
  await p.waitForTimeout(700);

  conferir('nenhum erro de JS na carga', erros.length === 0, erros.join(' | '));

  // ---------- o visualizador duplicado some ----------
  const roots = await p.evaluate(() => document.querySelectorAll('[data-vfst-root]').length);
  conferir('sobra um único visualizador no DOM', roots === 1, 'achei ' + roots);

  const api = await p.evaluate(() => !!(window.VFStories && window.VFStories.open));
  conferir('API window.VFStories disponível', api);

  const vivo = await p.evaluate(() => {
    var r = document.querySelector('[data-vfst-root]');
    return !!(r && window.VFStories._root === r && r.isConnected);
  });
  conferir('o root que sobrou é o que a API usa', vivo);

  // ---------- abrir pela régua ----------
  await p.evaluate(() => document.querySelector('[data-vfsr-open]').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(300);
  await p.click('[data-vfsr-open="1"]');
  await p.waitForTimeout(600);
  let aberto = await p.evaluate(() => document.querySelector('[data-vfst-root]').classList.contains('is-open')
    || document.querySelector('[data-vfst-root]').hasAttribute('data-open')
    || getComputedStyle(document.querySelector('[data-vfst-root]')).display !== 'none');
  conferir('régua abre a tela cheia', aberto);

  let card = await p.evaluate(() => {
    var t = document.querySelector('[data-vfst-name]');
    return t ? t.textContent.trim() : '';
  });
  conferir('cartão da régua traz o produto da página', /Adulto/.test(card), 'título: ' + card);

  await p.keyboard.press('Escape');
  await p.waitForTimeout(400);
  const fechou = await p.evaluate(() => {
    var r = document.querySelector('[data-vfst-root]');
    return !r.classList.contains('is-open') && getComputedStyle(r).display === 'none';
  });
  conferir('Esc fecha', fechou);

  // ---------- abrir pelo carrossel, na mesma página ----------
  await p.evaluate(() => document.querySelector('[data-vfu-open]').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(400);
  await p.click('[data-vfu-open="1"]');
  await p.waitForTimeout(700);
  aberto = await p.evaluate(() => document.querySelector('[data-vfst-root]').classList.contains('is-open')
    || getComputedStyle(document.querySelector('[data-vfst-root]')).display !== 'none');
  conferir('carrossel abre a tela cheia na mesma página', aberto);

  card = await p.evaluate(() => {
    var t = document.querySelector('[data-vfst-name]');
    return t ? t.textContent.trim() : '';
  });
  conferir('cartão do carrossel traz o produto DAQUELE vídeo (Kids)', /Kids/.test(card), 'título: ' + card);

  // ---------- comprar a partir do carrossel ----------
  await p.route('**/cart/add.js', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ items: [{ id: 1 }] }) }));
  await p.route('**/cart.js', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ item_count: 1 }) }));

  const temBotao = await p.evaluate(() => !!document.querySelector('[data-vfst-cta]'));
  conferir('botão de compra presente', temBotao);
  if (temBotao) {
    await p.click('[data-vfst-cta]');
    await p.waitForTimeout(800);
    const conta = await p.evaluate(() => {
      var e = document.querySelector('[data-vf-cart-count]');
      return e ? e.textContent.trim() : '';
    });
    conferir('contador do carrinho sobe', conta === '1', 'contador: ' + conta);
  }

  conferir('nenhum erro de JS no fim', erros.length === 0, erros.join(' | '));

  await b.close();
  servidor.close();

  let falhou = 0;
  for (const [s, n] of resultados) {
    console.log((s === 'PASSOU' ? '  ok  ' : '  XX  ') + n);
    if (s !== 'PASSOU') falhou++;
  }
  console.log('\n' + (resultados.length - falhou) + '/' + resultados.length + ' passaram');
  process.exit(falhou ? 1 : 0);
})();
