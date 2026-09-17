// Dirige a régua de stories num Chromium real.
const http = require('http'); const fs = require('fs'); const path = require('path');
const { chromium } = require('playwright');
const DIR = __dirname;
const PADRAO = 'rail.html';
const TIPOS = { '.html': 'text/html', '.webm': 'video/webm', '.png': 'image/png' };

const resultados = [];
const conferir = (nome, cond, det) => resultados.push([cond ? 'PASSOU' : 'FALHOU', cond ? nome : nome + ' — ' + (det || 'condição falsa')]);

function servir(req, res) {
  const url = req.url.split('?')[0];
  const arquivo = path.join(DIR, url === '/' ? PADRAO : url);
  if (!arquivo.startsWith(DIR) || !fs.existsSync(arquivo)) { res.writeHead(404); return res.end(); }
  const tipo = TIPOS[path.extname(arquivo)] || 'application/octet-stream';
  const tamanho = fs.statSync(arquivo).size;
  // Range é obrigatório: sem ele o Chrome trata o vídeo como não-buscável e
  // prende currentTime em zero. A CDN da Shopify atende Range.
  const faixa = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
  if (faixa) {
    const inicio = faixa[1] ? parseInt(faixa[1], 10) : 0;
    const fim = faixa[2] ? parseInt(faixa[2], 10) : tamanho - 1;
    res.writeHead(206, {
      'Content-Type': tipo, 'Accept-Ranges': 'bytes',
      'Content-Range': 'bytes ' + inicio + '-' + fim + '/' + tamanho,
      'Content-Length': fim - inicio + 1
    });
    return fs.createReadStream(arquivo, { start: inicio, end: fim }).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': tipo, 'Accept-Ranges': 'bytes', 'Content-Length': tamanho });
  fs.createReadStream(arquivo).pipe(res);
}

const servidor = http.createServer(servir);

(async () => {
  await new Promise((r) => servidor.listen(0, r));
  const base = 'http://127.0.0.1:' + servidor.address().port;
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  // viewport estreito: os últimos círculos ficam fora da rolagem horizontal
  const ctx = await browser.newContext({ viewport: { width: 380, height: 700 }, hasTouch: true });
  const page = await ctx.newPage();
  await page.route('**/cart/add.js', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"items":[{"id":1}]}' }));
  await page.route('**/cart.js', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"item_count":1}' }));

  const estados = () => page.evaluate(() => Array.from(document.querySelectorAll('video[data-vfsr-thumb]')).map((v) => ({
    paused: v.paused, muted: v.muted, t: v.currentTime,
    // mesma régua do IntersectionObserver: metade do círculo visível
    dentro: (function () {
      const r = v.getBoundingClientRect();
      const h = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
      const w = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0));
      if (!r.width || !r.height) return false;
      return (h * w) / (r.width * r.height) >= 0.5;
    })()
  })));

  await page.goto(base + '/rail.html');
  await page.waitForTimeout(1600);

  let e = await estados();
  conferir('seis círculos na régua', e.length === 6, 'tinha ' + e.length);
  conferir('círculos visíveis estão tocando', e.filter((x) => x.dentro).every((x) => !x.paused),
    JSON.stringify(e.map((x) => x.dentro + ':' + x.paused)));
  conferir('mais de um círculo toca ao mesmo tempo (não só o primeiro)',
    e.filter((x) => !x.paused).length > 1, 'tocando ' + e.filter((x) => !x.paused).length);
  conferir('círculos fora da rolagem horizontal estão pausados',
    e.filter((x) => !x.dentro).every((x) => x.paused),
    JSON.stringify(e.map((x) => x.dentro + ':' + x.paused)));
  conferir('todos mudos', e.every((x) => x.muted));

  // rolar a régua horizontalmente traz os últimos para dentro
  await page.evaluate(() => {
    const row = document.querySelector('.vfsr__row');
    row.scrollLeft = row.scrollWidth;
  });
  await page.waitForTimeout(1400);
  e = await estados();
  conferir('círculos trazidos pela rolagem horizontal passam a tocar',
    e[e.length - 1].dentro && !e[e.length - 1].paused, JSON.stringify(e[e.length - 1]));

  // rolar a página para longe pausa tudo
  await page.evaluate(() => window.scrollTo(0, 1800));
  await page.waitForTimeout(900);
  e = await estados();
  conferir('régua fora da tela pausa tudo', e.every((x) => x.paused),
    JSON.stringify(e.map((x) => x.paused)));

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
  e = await estados();
  conferir('voltar para a régua retoma os visíveis', e.filter((x) => x.dentro).every((x) => !x.paused),
    JSON.stringify(e.map((x) => x.dentro + ':' + x.paused)));

  // abrir a tela cheia pausa os círculos atrás dela
  await page.click('.vfsr__item[data-vfsr-open="0"]');
  await page.waitForFunction(() => !document.querySelector('[data-vfsr-root], [data-vfst-root]').hidden, null, { timeout: 5000 });
  await page.waitForTimeout(700);
  e = await estados();
  conferir('tela cheia aberta pausa todos os círculos', e.every((x) => x.paused),
    JSON.stringify(e.map((x) => x.paused)));
  conferir('tela cheia abriu no story clicado',
    await page.evaluate(() => (document.querySelector('[data-vfst-video]').currentSrc || '').includes('clip1')));

  // fechar retoma
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1200);
  e = await estados();
  conferir('fechar a tela cheia retoma os círculos visíveis',
    e.filter((x) => x.dentro).every((x) => !x.paused), JSON.stringify(e.map((x) => x.dentro + ':' + x.paused)));

  // abrir pelo terceiro círculo
  await page.click('.vfsr__item[data-vfsr-open="2"]');
  await page.waitForTimeout(900);
  conferir('cada círculo abre o seu próprio story',
    await page.evaluate(() => (document.querySelector('[data-vfst-video]').currentSrc || '').includes('clip3')));
  await page.keyboard.press('Escape');

  // autoplay recusado até para vídeo mudo: a capa avança ~1s (armadilha 4)
  await page.addInitScript(() => { window.__recusarTudo = true; });
  await page.goto(base + '/rail.html');
  await page.waitForTimeout(2600);
  e = await estados();
  const avancados = e.filter((x) => x.dentro && x.t > 0.2).length;
  const visiveis = e.filter((x) => x.dentro).length;
  conferir('autoplay recusado: capa avança do quadro preto (armadilha 4)',
    visiveis > 0 && avancados === visiveis, avancados + ' de ' + visiveis + ' avançaram: ' + JSON.stringify(e.map((x) => x.dentro + ':' + x.t.toFixed(2))));

  await browser.close(); servidor.close();
  const falhas = resultados.filter((r) => r[0] === 'FALHOU');
  resultados.forEach((r) => console.log((r[0] === 'PASSOU' ? '  ok  ' : '  XX  ') + r[1]));
  console.log('\n' + (resultados.length - falhas.length) + '/' + resultados.length + ' passaram');
  process.exit(falhas.length ? 1 : 0);
})().catch((e) => { console.error('ERRO:', e); process.exit(1); });
