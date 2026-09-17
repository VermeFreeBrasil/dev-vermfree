const http = require('http'); const fs = require('fs'); const path = require('path');
const { chromium } = require('playwright');
const DIR = __dirname;
const TIPOS = { '.html': 'text/html', '.webm': 'video/webm', '.png': 'image/png' };
const servidor = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  const f = path.join(DIR, url === '/' ? 'index.html' : url);
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
(async () => {
  await new Promise((r) => servidor.listen(0, r));
  const base = 'http://127.0.0.1:' + servidor.address().port;
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

  for (const [nome, vw, vh] of [['celular', 390, 844], ['desktop', 1280, 800]]) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, hasTouch: true });
    const page = await ctx.newPage();
    await page.route('**/cart/add.js', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"items":[{"id":1}]}' }));
    await page.route('**/cart.js', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"item_count":1}' }));
    await page.goto(base + '/index.html');
    await page.click('#abrir-0');
    await page.waitForFunction(() => !document.querySelector('[data-vfst-video]').paused, null, { timeout: 6000 });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(DIR, 'shot-' + nome + '.png') });

    if (nome === 'celular') {
      await page.click('[data-vfst-cta]');
      await page.waitForFunction(() => !document.querySelector('[data-vfst-toast]').hidden, null, { timeout: 5000 });
      await page.screenshot({ path: path.join(DIR, 'shot-celular-adicionado.png') });
    }
    await ctx.close();
  }
  await browser.close(); servidor.close();
  console.log('capturas prontas');
})();
