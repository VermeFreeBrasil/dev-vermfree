const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: 420, height: 1000 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto('file://' + path.join(__dirname, 'kits.html'));
  await p.waitForTimeout(400);
  await (await p.$('.vf-pdp__kits')).screenshot({ path: path.join(__dirname, 'kits-depois.png') });
  await b.close(); console.log('ok');
})();
