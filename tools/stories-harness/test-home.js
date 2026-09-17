// Dirige o carrossel de stories da home num Chromium real.
const http = require('http'); const fs = require('fs'); const path = require('path');
const { chromium } = require('playwright');
const DIR = __dirname;
const PADRAO = 'home.html';
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

  // ---------- responsividade ----------
  for (const w of [320, 360, 390, 414, 768, 1280]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 800 } });
    const p = await ctx.newPage();
    await p.goto(base + '/home.html');
    await p.waitForTimeout(200);
    const m = await p.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }));
    conferir('sem overflow horizontal em ' + w + 'px', m.s <= m.c, 'página ' + m.s + '/' + m.c);
    await ctx.close();
  }

  // ---------- comportamento (celular) ----------
  const ctx = await b.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true });
  const page = await ctx.newPage();
  let postsDeAdd = [];
  let itensNoCarrinho = 0;
  await page.route('**/cart/add.js', async (r) => {
    postsDeAdd.push(JSON.parse(r.request().postData() || '{}'));
    itensNoCarrinho += 1;
    await r.fulfill({ status: 200, contentType: 'application/json', body: '{"items":[{"id":1}]}' });
  });
  await page.route('**/cart.js', (r) => r.fulfill({ status: 200, contentType: 'application/json',
    body: JSON.stringify({ item_count: itensNoCarrinho }) }));
  await page.route('**/products/**', (r) => r.fulfill({ status: 200, contentType: 'text/html', body: '<html><body>PDP</body></html>' }));

  await page.goto(base + '/home.html');
  await page.waitForTimeout(1500);

  const cards = () => page.evaluate(() => Array.from(document.querySelectorAll('video[data-vfu-video]')).map((v) => {
    const r = v.getBoundingClientRect();
    const h = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
    const w = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0));
    return { paused: v.paused, muted: v.muted,
      dentro: r.width && r.height ? (h * w) / (r.width * r.height) >= 0.6 : false };
  }));

  let c = await cards();
  conferir('três cards de vídeo no carrossel', c.length === 3, 'achei ' + c.length);
  conferir('cards visíveis tocando', c.filter((x) => x.dentro).every((x) => !x.paused),
    JSON.stringify(c.map((x) => x.dentro + ':' + x.paused)));
  conferir('cards fora da vista pausados', c.filter((x) => !x.dentro).every((x) => x.paused),
    JSON.stringify(c.map((x) => x.dentro + ':' + x.paused)));
  conferir('todos mudos', c.every((x) => x.muted));

  // o carrossel não desliza enquanto um vídeo toca
  const antes = await page.evaluate(() => document.querySelector('[data-vf-ugc-track]').scrollLeft);
  await page.waitForTimeout(3800);
  const depois = await page.evaluate(() => document.querySelector('[data-vf-ugc-track]').scrollLeft);
  conferir('autoplay não arranca o vídeo da vista', antes === depois, antes + ' -> ' + depois);

  // abrir pelo primeiro card de vídeo
  await page.click('[data-vfu-open="0"]');
  await page.waitForFunction(() => !document.querySelector('[data-vfst-root]').hidden, null, { timeout: 5000 });
  await page.waitForTimeout(600);
  conferir('card abre a tela cheia', true);
  conferir('tela cheia abriu no vídeo certo',
    await page.evaluate(() => (document.querySelector('[data-vfst-video]').currentSrc || '').includes('clip1')));
  conferir('cards do carrossel param atrás da sobreposição',
    (await cards()).every((x) => x.paused), JSON.stringify((await cards()).map((x) => x.paused)));

  let cartao = await page.evaluate(() => ({
    escondido: document.querySelector('[data-vfst-card]').hidden,
    nome: document.querySelector('[data-vfst-name]').textContent,
    oferta: document.querySelector('[data-vfst-offer]').textContent
  }));
  conferir('cartão mostra o produto DESTE vídeo (Adulto)',
    !cartao.escondido && cartao.nome.includes('Adulto') && cartao.oferta === 'R$ 347,00', JSON.stringify(cartao));

  // avançar: o segundo vídeo tem OUTRO produto
  await page.click('[data-vfst-next]');
  await page.waitForFunction(() => (document.querySelector('[data-vfst-video]').currentSrc || '').includes('clip2'), null, { timeout: 5000 });
  await page.waitForTimeout(300);
  cartao = await page.evaluate(() => ({
    nome: document.querySelector('[data-vfst-name]').textContent,
    oferta: document.querySelector('[data-vfst-offer]').textContent
  }));
  conferir('cada vídeo tem o seu próprio produto (Kids no segundo)',
    cartao.nome.includes('Kids 2 a 4') && cartao.oferta === 'R$ 270,00', JSON.stringify(cartao));

  // terceiro vídeo não tem produto: abre sem cartão
  await page.click('[data-vfst-next]');
  await page.waitForFunction(() => (document.querySelector('[data-vfst-video]').currentSrc || '').includes('clip3'), null, { timeout: 5000 });
  await page.waitForTimeout(300);
  conferir('vídeo sem produto abre sem cartão, sem quebrar',
    await page.evaluate(() => document.querySelector('[data-vfst-card]').hidden));
  conferir('vídeo sem produto continua tocando',
    await page.evaluate(() => !document.querySelector('[data-vfst-video]').paused));

  // voltar e comprar
  await page.click('[data-vfst-prev]');
  await page.click('[data-vfst-prev]');
  await page.waitForFunction(() => (document.querySelector('[data-vfst-video]').currentSrc || '').includes('clip1'), null, { timeout: 5000 });
  await page.click('[data-vfst-cta]');
  await page.waitForFunction(() => !document.querySelector('[data-vfst-toast]').hidden, null, { timeout: 5000 });
  conferir('botão adiciona o produto do vídeo',
    postsDeAdd.length === 1 && postsDeAdd[0].items[0].id === '48772143415515', JSON.stringify(postsDeAdd));
  await page.waitForFunction(() => document.querySelector('[data-vf-cart-count]').textContent === '1', null, { timeout: 5000 });
  conferir('contador do header sobe', true);

  await page.keyboard.press('Escape');
  await page.waitForTimeout(900);
  conferir('fechar retoma os cards visíveis',
    (await cards()).filter((x) => x.dentro).every((x) => !x.paused));

  // ---------- fora da home ----------
  await page.goto(base + '/home-fora.html');
  await page.waitForTimeout(1200);
  const fora = await page.evaluate(() => ({
    taps: document.querySelectorAll('[data-vfu-open]').length,
    visualizador: !!document.querySelector('[data-vfst-root]'),
    payload: !!document.querySelector('[data-vfu-data]'),
    videos: document.querySelectorAll('video[data-vfu-video]').length,
    tocando: Array.from(document.querySelectorAll('video[data-vfu-video]')).filter((v) => !v.paused).length
  }));
  conferir('fora da home: nenhum card clicável', fora.taps === 0, 'achei ' + fora.taps);
  conferir('fora da home: visualizador não é renderizado', !fora.visualizador);
  conferir('fora da home: nenhum payload de stories', !fora.payload);
  conferir('fora da home: os vídeos continuam aparecendo e tocando',
    fora.videos === 3 && fora.tocando > 0, JSON.stringify(fora));

  await b.close(); servidor.close();
  const falhas = resultados.filter((r) => r[0] === 'FALHOU');
  resultados.forEach((r) => console.log((r[0] === 'PASSOU' ? '  ok  ' : '  XX  ') + r[1]));
  console.log('\n' + (resultados.length - falhas.length) + '/' + resultados.length + ' passaram');
  process.exit(falhas.length ? 1 : 0);
})().catch((e) => { console.error('ERRO:', e); process.exit(1); });
