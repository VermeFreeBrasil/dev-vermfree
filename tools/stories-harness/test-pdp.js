// Mede overflow horizontal da PDP em larguras de celular.
const { chromium } = require('playwright');
const path = require('path');

const LARGURAS = [320, 360, 390, 414, 768, 1280];

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  let falhou = 0;
  for (const w of LARGURAS) {
    const ctx = await b.newContext({ viewport: { width: w, height: 800 } });
    const p = await ctx.newPage();
    await p.goto('file://' + path.join(__dirname, 'pdp.html'));
    await p.waitForTimeout(150);
    const m = await p.evaluate(() => {
      const d = document.documentElement;
      const regua = document.querySelector('.vfsr__row');
      const coluna = document.querySelector('.vf-pdp__buy');
      return {
        scrollW: d.scrollWidth,
        clientW: d.clientWidth,
        colunaW: Math.round(coluna.getBoundingClientRect().width),
        reguaW: Math.round(regua.getBoundingClientRect().width),
        reguaRolaSozinha: regua.scrollWidth > regua.clientWidth
      };
    });
    const vazou = m.scrollW > m.clientW;
    if (vazou) falhou++;
    console.log(
      (vazou ? '  XX  ' : '  ok  ') +
      String(w).padStart(4) + 'px — página ' + m.scrollW + '/' + m.clientW +
      (vazou ? ' VAZOU ' + (m.scrollW - m.clientW) + 'px' : '') +
      ' · coluna ' + m.colunaW + ' · régua ' + m.reguaW +
      (m.reguaRolaSozinha ? ' (rola internamente)' : ' (NÃO rola internamente)')
    );
    await ctx.close();
  }
  await b.close();
  console.log(falhou ? '\n' + falhou + ' largura(s) com overflow horizontal' : '\nnenhum overflow horizontal');
  process.exit(falhou ? 1 : 0);
})();
