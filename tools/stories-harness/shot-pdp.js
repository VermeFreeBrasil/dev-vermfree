const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const [nome, w] of [['390', 390], ['320', 320]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 2 });
    const p = await ctx.newPage();
    await p.goto('file://' + path.join(__dirname, 'pdp.html'));
    await p.waitForTimeout(200);
    const el = await p.$('.vf-pdp__buy-inner');
    await el.screenshot({ path: path.join(__dirname, 'pdp-' + nome + '.png') });
    await ctx.close();
  }
  await b.close(); console.log('ok');
})();
