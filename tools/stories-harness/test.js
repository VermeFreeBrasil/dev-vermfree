// Dirige o visualizador de stories num Chromium real.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const DIR = __dirname;
const TIPOS = { '.html': 'text/html', '.webm': 'video/webm', '.png': 'image/png' };

const resultados = [];
function ok(nome) { resultados.push(['PASSOU', nome]); }
function falhou(nome, detalhe) { resultados.push(['FALHOU', nome + ' — ' + detalhe]); }
function conferir(nome, condicao, detalhe) {
  if (condicao) ok(nome); else falhou(nome, detalhe || 'condição falsa');
}

const servidor = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  const arquivo = path.join(DIR, url === '/' ? 'index.html' : url);
  if (!arquivo.startsWith(DIR) || !fs.existsSync(arquivo)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arquivo)] || 'application/octet-stream' });
  fs.createReadStream(arquivo).pipe(res);
});

const estado = () => ({});

(async () => {
  await new Promise((r) => servidor.listen(0, r));
  const base = 'http://127.0.0.1:' + servidor.address().port;

  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const context = await browser.newContext({ hasTouch: true, viewport: { width: 900, height: 700 } });
  const page = await context.newPage();

  // ---- carrinho falso ----
  let itensNoCarrinho = 0;
  const postsDeAdd = [];

  await page.route('**/cart/add.js', async (route) => {
    postsDeAdd.push(JSON.parse(route.request().postData() || '{}'));
    itensNoCarrinho += 1;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ items: [{ id: 1 }] }) });
  });
  await page.route('**/cart.js', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ item_count: itensNoCarrinho }) });
  });
  await page.route('**/products/**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'text/html', body: '<html><body>PDP</body></html>' });
  });

  const visivel = () => page.evaluate(() => !document.querySelector('[data-vfst-root]').hidden);
  const video = () => page.evaluate(() => {
    const v = document.querySelector('[data-vfst-video]');
    return { paused: v.paused, muted: v.muted, src: (v.currentSrc || ''), duration: v.duration, tempo: v.currentTime };
  });
  const esperar = (ms) => page.waitForTimeout(ms);
  const comDuracao = () => page.waitForFunction(
    () => { const v = document.querySelector('[data-vfst-video]'); return isFinite(v.duration) && v.duration > 0; },
    null, { timeout: 8000 });
  const pularParaOFim = async () => {
    await comDuracao();
    await page.evaluate(() => {
      const v = document.querySelector('[data-vfst-video]');
      v.currentTime = Math.max(0, v.duration - 0.15);
    });
  };

  await page.goto(base + '/index.html');

  // ---------- 1. o snippet vive uma vez só ----------
  const nos = await page.evaluate(() => document.querySelectorAll('[data-vfst-root]').length);
  conferir('snippet renderiza um nó único', nos === 1, 'encontrou ' + nos);

  const noBody = await page.evaluate(() => document.querySelector('[data-vfst-root]').parentElement === document.body);
  conferir('nó movido para o <body> (armadilha 3)', noBody, 'não está no body');

  // ---------- 2. abrir ----------
  await page.click('#abrir-0');
  await page.waitForFunction(() => !document.querySelector('[data-vfst-video]').paused, null, { timeout: 5000 });
  conferir('abre em tela cheia', await visivel());

  const barras = await page.evaluate(() => document.querySelectorAll('.vfst__bar').length);
  conferir('uma barra por story', barras === 3, 'tinha ' + barras);

  await comDuracao();
  let v = await video();
  conferir('story 0 tocando', !v.paused && v.src.includes('clip1'), JSON.stringify(v));
  conferir('duração real no vídeo de teste', isFinite(v.duration) && v.duration > 1, 'duration=' + v.duration);

  // ---------- 3. trava de rolagem ----------
  const travado = await page.evaluate(() => document.documentElement.style.overflow + '|' + document.body.style.overflow);
  conferir('rolagem travada ao abrir', travado === 'hidden|hidden', travado);

  // ---------- 4. cartão de compra ----------
  const cartao = await page.evaluate(() => ({
    escondido: document.querySelector('[data-vfst-card]').hidden,
    eyebrow: document.querySelector('[data-vfst-eyebrow]').textContent,
    eyebrowEscondido: document.querySelector('[data-vfst-eyebrow]').hidden,
    nome: document.querySelector('[data-vfst-name]').textContent,
    oferta: document.querySelector('[data-vfst-offer]').textContent,
    selo: document.querySelector('[data-vfst-badge]').textContent,
    cta: document.querySelector('[data-vfst-cta]').textContent
  }));
  conferir('cartão visível', !cartao.escondido);
  conferir('linha de cima preenchida', cartao.eyebrow === 'MAIS VENDIDO' && !cartao.eyebrowEscondido, JSON.stringify(cartao));
  conferir('nome do produto', cartao.nome.includes('VermeFree Adulto'), cartao.nome);
  conferir('oferta vazia cai no preço', cartao.oferta === 'R$ 347,00', cartao.oferta);
  conferir('selo do canto', cartao.selo === 'NOVO', cartao.selo);
  conferir('texto do botão', cartao.cta === 'Adicionar ao carrinho', cartao.cta);

  // ---------- 5. barra preenche ----------
  await esperar(900);
  const largura = await page.evaluate(() => parseFloat(document.querySelectorAll('.vfst__bar-fill')[0].style.width));
  conferir('barra do story atual preenche', largura > 5, 'largura=' + largura);

  // ---------- 6. avançar e voltar ----------
  await page.click('[data-vfst-next]');
  await page.waitForFunction(() => (document.querySelector('[data-vfst-video]').currentSrc || '').includes('clip2'), null, { timeout: 5000 });
  const apos = await page.evaluate(() => ({
    anteriorCheia: document.querySelectorAll('.vfst__bar-fill')[0].style.width,
    oferta: document.querySelector('[data-vfst-offer]').textContent,
    eyebrowEscondido: document.querySelector('[data-vfst-eyebrow]').hidden,
    seloEscondido: document.querySelector('[data-vfst-badge]').hidden
  }));
  conferir('avança para o story 1', true);
  conferir('barra anterior fica cheia', apos.anteriorCheia === '100%', apos.anteriorCheia);
  conferir('oferta própria do story', apos.oferta === 'Ganhe 5 sachês', apos.oferta);
  conferir('linha de cima vazia some', apos.eyebrowEscondido);
  conferir('selo vazio some', apos.seloEscondido);

  await page.click('[data-vfst-prev]');
  await page.waitForFunction(() => (document.querySelector('[data-vfst-video]').currentSrc || '').includes('clip1'), null, { timeout: 5000 });
  conferir('volta para o story 0', true);

  // ---------- 7. som ----------
  const antesSom = (await video()).muted;
  await page.click('[data-vfst-sound]');
  const depoisSom = (await video()).muted;
  conferir('botão de som alterna', antesSom !== depoisSom, antesSom + ' -> ' + depoisSom);
  const icone = await page.evaluate(() => {
    const b = document.querySelector('[data-vfst-sound]');
    const on = b.querySelector('.vfst__ic--on');
    const off = b.querySelector('.vfst__ic--off');
    return b.classList.contains('is-muted') + '|' +
      getComputedStyle(on).display + '|' + getComputedStyle(off).display;
  });
  conferir('ícone de som troca de SVG', icone === 'true|none|block', icone);
  await page.click('[data-vfst-sound]');

  // ---------- 8. Esc fecha e destrava ----------
  await page.keyboard.press('Escape');
  conferir('Esc fecha', !(await visivel()));
  const destravado = await page.evaluate(() => document.documentElement.style.overflow + '|' + document.body.style.overflow);
  conferir('rolagem destrava ao fechar', destravado === '|', destravado);
  conferir('vídeo pausa ao fechar', (await video()).paused);

  // ---------- 9. avanço automático no fim ----------
  await page.click('#abrir-1');
  await page.waitForFunction(() => (document.querySelector('[data-vfst-video]').currentSrc || '').includes('clip2'), null, { timeout: 5000 });
  await pularParaOFim();
  await page.waitForFunction(() => (document.querySelector('[data-vfst-video]').currentSrc || '').includes('clip3'), null, { timeout: 8000 });
  conferir('avança sozinho ao terminar', true);

  // ---------- 10. passar do último fecha ----------
  await pularParaOFim();
  await page.waitForFunction(() => document.querySelector('[data-vfst-root]').hidden, null, { timeout: 8000 });
  conferir('passar do último fecha', true);

  // ---------- 11. arrastar para baixo fecha ----------
  await page.click('#abrir-0');
  await page.waitForFunction(() => !document.querySelector('[data-vfst-video]').paused, null, { timeout: 5000 });
  const arrastar = (x1, y1, x2, y2) => page.evaluate(([x1, y1, x2, y2]) => {
    const raiz = document.querySelector('[data-vfst-root]');
    const toque = (tipo, x, y, comTouches) => {
      const t = new Touch({ identifier: 1, target: raiz, clientX: x, clientY: y });
      raiz.dispatchEvent(new TouchEvent(tipo, {
        bubbles: true, cancelable: true,
        touches: comTouches ? [t] : [], changedTouches: [t]
      }));
    };
    toque('touchstart', x1, y1, true);
    toque('touchend', x2, y2, false);
  }, [x1, y1, x2, y2]);

  await arrastar(200, 100, 400, 190); // diagonal: dx 200 > dy 90
  conferir('arrasto diagonal NÃO fecha', await visivel());

  await arrastar(200, 100, 210, 320); // vertical claro
  conferir('arrastar para baixo fecha', !(await visivel()));

  // ---------- 12. botão de compra, uma variante ----------
  await page.click('#abrir-0');
  await page.waitForFunction(() => !document.querySelector('[data-vfst-video]').paused, null, { timeout: 5000 });
  await page.click('[data-vfst-cta]');
  await page.waitForFunction(() => !document.querySelector('[data-vfst-toast]').hidden, null, { timeout: 5000 });

  conferir('POST em /cart/add.js aconteceu', postsDeAdd.length === 1, 'foram ' + postsDeAdd.length);
  conferir('payload correto',
    JSON.stringify(postsDeAdd[0]) === JSON.stringify({ items: [{ id: '51234567890', quantity: 1 }] }),
    JSON.stringify(postsDeAdd[0]));
  conferir('aviso "adicionado" aparece', true);
  conferir('story continua aberto depois de adicionar', await visivel());

  await page.waitForFunction(() => document.querySelector('[data-vf-cart-count]').textContent === '1', null, { timeout: 5000 });
  const contadores = await page.evaluate(() => ({
    header: document.querySelector('[data-vf-cart-count]').textContent,
    headerEscondido: document.querySelector('[data-vf-cart-count]').hidden,
    icone: document.querySelector('[data-cart-count]').textContent,
    iconeVazio: document.querySelector('[data-cart-count]').classList.contains('is-empty')
  }));
  conferir('contador do header sobe', contadores.header === '1' && !contadores.headerEscondido, JSON.stringify(contadores));
  conferir('contador do snippet cart-icon sobe', contadores.icone === '1' && !contadores.iconeVazio, JSON.stringify(contadores));

  const ctaVoltou = await page.evaluate(() => {
    const b = document.querySelector('[data-vfst-cta]');
    return b.textContent + '|' + b.disabled;
  });
  conferir('botão volta ao normal', ctaVoltou === 'Adicionar ao carrinho|false', ctaVoltou);

  // o botão não pode estar coberto pelas zonas de toque (armadilha 5)
  const porCima = await page.evaluate(() => {
    const b = document.querySelector('[data-vfst-cta]');
    const r = b.getBoundingClientRect();
    const alvo = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return alvo === b;
  });
  conferir('zonas de toque não cobrem o botão (armadilha 5)', porCima, 'algo está por cima do botão');
  await page.keyboard.press('Escape');

  // ---------- 13. esgotado ----------
  await page.click('#abrir-esgotado');
  await esperar(400);
  const esgotado = await page.evaluate(() => {
    const b = document.querySelector('[data-vfst-cta]');
    return b.textContent + '|' + b.disabled;
  });
  conferir('esgotado desabilita o botão', esgotado === 'Esgotado|true', esgotado);
  await page.keyboard.press('Escape');

  // ---------- 14. sem produto ----------
  await page.click('#abrir-sem-produto');
  await esperar(400);
  conferir('story sem produto esconde o cartão',
    await page.evaluate(() => document.querySelector('[data-vfst-card]').hidden));
  conferir('story sem produto abre normal', await visivel());
  await page.keyboard.press('Escape');

  // ---------- 15. multivariante ----------
  const antesMulti = postsDeAdd.length;
  await page.click('#abrir-multi-pdp');
  await esperar(400);
  const rotuloPdp = await page.evaluate(() => document.querySelector('[data-vfst-cta]').textContent);
  conferir('multivariante na PDP vira "Escolher opção"', rotuloPdp === 'Escolher opção', rotuloPdp);
  await page.click('[data-vfst-cta]');
  await esperar(300);
  conferir('multivariante na PDP fecha o story', !(await visivel()));
  conferir('multivariante na PDP não adiciona às cegas', postsDeAdd.length === antesMulti, 'postou ' + (postsDeAdd.length - antesMulti));

  await page.click('#abrir-multi-home');
  await esperar(400);
  const rotuloHome = await page.evaluate(() => document.querySelector('[data-vfst-cta]').textContent);
  conferir('multivariante na home vira "Ver produto"', rotuloHome === 'Ver produto', rotuloHome);
  await Promise.all([
    page.waitForURL('**/products/**', { timeout: 5000 }),
    page.click('[data-vfst-cta]')
  ]);
  conferir('multivariante na home leva para a PDP', page.url().includes('/products/'));
  conferir('multivariante na home não adiciona às cegas', postsDeAdd.length === antesMulti, 'postou ' + (postsDeAdd.length - antesMulti));

  await page.goto(base + '/index.html');

  // ---------- 16. story sem fonte é pulado ----------
  await page.click('#abrir-fonte-quebrada');
  await page.waitForFunction(() => (document.querySelector('[data-vfst-video]').currentSrc || '').includes('clip2'), null, { timeout: 5000 });
  conferir('story sem fonte é pulado, não trava', true);
  await page.keyboard.press('Escape');

  // ---------- 17. autoplay recusado (armadilha 2) ----------
  await page.evaluate(() => { window.__failUnmutedPlay = true; });
  await page.click('#abrir-0');
  await page.waitForFunction(() => !document.querySelector('[data-vfst-video]').paused, null, { timeout: 6000 });
  let rec = await video();
  conferir('autoplay recusado: cai para mudo e toca (story 0)', !rec.paused && rec.muted, JSON.stringify(rec));

  const iconeSom = await page.evaluate(() => document.querySelector('[data-vfst-sound]').getAttribute('aria-pressed'));
  conferir('ícone de som reflete o mudo forçado', iconeSom === 'false', iconeSom);

  // e os seguintes também tocam, não só o primeiro
  for (const clipe of ['clip2', 'clip3']) {
    await page.click('[data-vfst-next]');
    await page.waitForFunction((c) => {
      const v = document.querySelector('[data-vfst-video]');
      return (v.currentSrc || '').includes(c) && !v.paused;
    }, clipe, { timeout: 6000 });
    rec = await video();
    conferir('autoplay recusado: ' + clipe + ' também toca', !rec.paused, JSON.stringify(rec));
  }
  await page.keyboard.press('Escape');

  await browser.close();
  servidor.close();

  const falhas = resultados.filter((r) => r[0] === 'FALHOU');
  resultados.forEach((r) => console.log((r[0] === 'PASSOU' ? '  ok  ' : '  XX  ') + r[1]));
  console.log('\n' + (resultados.length - falhas.length) + '/' + resultados.length + ' passaram');
  process.exit(falhas.length ? 1 : 0);
})().catch((e) => { console.error('ERRO NO HARNESS:', e); process.exit(1); });
