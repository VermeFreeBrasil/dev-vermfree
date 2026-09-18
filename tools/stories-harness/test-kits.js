// Dirige o seletor de kits com o JS real da seção.
const { chromium } = require('playwright');
const path = require('path');

const resultados = [];
const conferir = (n, c, d) => resultados.push([c ? 'PASSOU' : 'FALHOU', c ? n : n + ' — ' + (d || 'condição falsa')]);

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: 390, height: 900 } });
  const p = await ctx.newPage();
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto('file://' + path.join(__dirname, 'kits.html'));
  await p.waitForTimeout(400);

  conferir('o JS da seção roda sem erro', erros.length === 0, erros.join(' | '));

  const estado = () => p.evaluate(() => ({
    ordem: Array.from(document.querySelectorAll('.vf-pdp__kit-title')).map((t) => t.textContent.trim()),
    ativo: (document.querySelector('.vf-pdp__kit-card.is-active .vf-pdp__kit-title') || {}).textContent,
    ativos: document.querySelectorAll('.vf-pdp__kit-card.is-active').length,
    aria: Array.from(document.querySelectorAll('.vf-pdp__kit-card')).map((c) => c.getAttribute('aria-checked')),
    qty: document.getElementById('vf-pdp-qty').value,
    stickyQty: document.getElementById('vf-pdp-sticky-qty-hidden').value,
    legenda: document.getElementById('vf-pdp-kits-legend-value').textContent.trim(),
    barra: document.getElementById('vf-pdp-kitbar-fill').style.width,
    msg: document.getElementById('vf-pdp-kitbar-msg').textContent.trim(),
  }));

  let e = await estado();
  conferir('ordem crescente na tela', JSON.stringify(e.ordem) === JSON.stringify(['1 Kit', '2 Kits', '3 Kits']), JSON.stringify(e.ordem));
  conferir('1 Kit vem pré-selecionado', (e.ativo || '').trim() === '1 Kit', e.ativo);
  conferir('só um card ativo', e.ativos === 1, 'ativos=' + e.ativos);
  conferir('aria-checked no card certo', JSON.stringify(e.aria) === JSON.stringify(['true', 'false', 'false']), JSON.stringify(e.aria));
  conferir('quantidade do form começa em 1', e.qty === '1', 'qty=' + e.qty);
  conferir('quantidade da barra fixa começa em 1', e.stickyQty === '1', e.stickyQty);
  conferir('legenda diz 1 Kit', e.legenda === '1 Kit', e.legenda);
  // A régua de desconto muda por campanha (a Semana do Cliente vai até 5
  // unidades, 5/7/9%). Então aqui se afere comportamento, não a cópia exata:
  // a barra cresce com a quantidade e a mensagem sempre aponta pra cima.
  const pct = (v) => parseInt(String(v), 10);
  const barra1 = e.barra;
  conferir('barra de vantagem começa baixa', pct(e.barra) < 40, e.barra);
  conferir('mensagem de 1 Kit aponta pra cima', /leve|suba|falta/i.test(e.msg), e.msg);
  conferir('nenhuma mensagem manda "voltar"', !/volte/i.test(e.msg), e.msg);

  // subir para 3 Kits
  await p.click('.vf-pdp__kit-card[data-qty="3"]');
  await p.waitForTimeout(250);
  e = await estado();
  conferir('clicar em 3 Kits seleciona 3 Kits', (e.ativo || '').trim() === '3 Kits', e.ativo);
  conferir('quantidade vai para 3', e.qty === '3', e.qty);
  conferir('barra fixa acompanha', e.stickyQty === '3', e.stickyQty);
  conferir('legenda acompanha', e.legenda === '3 Kits', e.legenda);
  const barra3 = e.barra;
  conferir('barra de vantagem sobe com 3 Kits', pct(barra3) > pct(barra1), barra1 + ' -> ' + barra3);
  conferir('mensagem de 3 Kits comemora o desconto', /%\s*OFF/i.test(e.msg) && /🎉/.test(e.msg), e.msg);
  conferir('3 Kits não manda "voltar"', !/volte/i.test(e.msg), e.msg);

  // 2 Kits
  await p.click('.vf-pdp__kit-card[data-qty="2"]');
  await p.waitForTimeout(250);
  e = await estado();
  conferir('clicar em 2 Kits seleciona 2 Kits', (e.ativo || '').trim() === '2 Kits', e.ativo);
  conferir('quantidade vai para 2', e.qty === '2', e.qty);
  conferir('barra de 2 Kits fica entre 1 e 3', pct(e.barra) > pct(barra1) && pct(e.barra) < pct(barra3),
    barra1 + ' < ' + e.barra + ' < ' + barra3);
  conferir('mensagem de 2 Kits convida a subir, não a voltar',
    /leve|falta|suba/i.test(e.msg) && !/volte/i.test(e.msg), e.msg);

  // voltar para 1 Kit
  await p.click('.vf-pdp__kit-card[data-qty="1"]');
  await p.waitForTimeout(250);
  e = await estado();
  conferir('dá para voltar para 1 Kit', (e.ativo || '').trim() === '1 Kit' && e.qty === '1', JSON.stringify(e));

  // teclado
  await p.evaluate(() => document.querySelector('.vf-pdp__kit-card[data-qty="3"]').focus());
  await p.keyboard.press('Enter');
  await p.waitForTimeout(250);
  e = await estado();
  conferir('Enter seleciona pelo teclado', (e.ativo || '').trim() === '3 Kits' && e.qty === '3', JSON.stringify(e));

  conferir('nenhum erro de JS no caminho todo', erros.length === 0, erros.join(' | '));

  await b.close();
  const falhas = resultados.filter((r) => r[0] === 'FALHOU');
  resultados.forEach((r) => console.log((r[0] === 'PASSOU' ? '  ok  ' : '  XX  ') + r[1]));
  console.log('\n' + (resultados.length - falhas.length) + '/' + resultados.length + ' passaram');
  process.exit(falhas.length ? 1 : 0);
})().catch((e) => { console.error('ERRO:', e); process.exit(1); });
