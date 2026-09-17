// Reconstrói o seletor de kits com o CSS e o JS REAIS da seção. O JS é o
// mesmo arquivo do tema, com as duas condicionais Liquid renderizadas para
// o handle do Adulto — é ele que decide qual card fica ativo, a quantidade
// enviada no form e a barra de vantagem.
const fs = require('fs');
const path = require('path');

const SECAO = '/home/user/dev-vermfree/shopify-theme/sections/vf-pdp-main.liquid';
const HANDLE = 'protocolo-desparasitacao-adulto-vermefree';
const UNIT = 34700;

const secao = fs.readFileSync(SECAO, 'utf8');
const css = secao.match(/\{% stylesheet %\}([\s\S]*?)\{% endstylesheet %\}/)[1];

const lista = (n) => secao.match(new RegExp("assign " + n + " = '([^']*)'"))[1].split(',');
const qtys = lista('kit_proto_qtys').map(Number);
const titles = lista('kit_proto_titles');
const discs = [...secao.matchAll(/assign kit_proto_discs = '([^']*)'/g)][0][1].split(',').map(Number);

const brl = (c) => 'R$ ' + (c / 100).toFixed(2).replace('.', ',');
const cards = qtys.map((q, i) => {
  const d = discs[i];
  const total = UNIT * q, desc = Math.floor(total * d / 100), preco = total - desc;
  const badges = q === 3 ? ['Mais vantajoso', 'Frete grátis'] : (q === 2 ? ['Frete grátis'] : []);
  return `
    <div class="vf-pdp__kit-card${i === 0 ? ' is-active' : ''}" data-qty="${q}" data-discount="${d}"
         role="radio" aria-checked="${i === 0}" tabindex="0">
      <div class="vf-pdp__kit-badges">${badges.map((b) => `<span class="vf-pdp__kit-badge">${b}</span>`).join('')}</div>
      <div class="vf-pdp__kit-row">
        <span class="vf-pdp__kit-radio"></span>
        <div class="vf-pdp__kit-info">
          <span class="vf-pdp__kit-title">${titles[i]}</span>
          <span class="vf-pdp__kit-cash-value" data-total>${brl(preco)}</span>
          ${d > 0 ? `<s class="vf-pdp__kit-compare" data-compare>${brl(total)}</s>
                     <span class="vf-pdp__kit-discount">${d}% OFF · você economiza <span data-save>${brl(desc)}</span></span>` : ''}
          <span class="vf-pdp__kit-installment-value" data-installment>—</span>
        </div>
      </div>
    </div>`;
}).join('');

// Só as duas condicionais Liquid que o script do seletor usa.
let js = [...secao.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n');
js = js.replace(/\{%\s*if product\.handle == '([^']*)'\s*%\}([\s\S]*?)\{%\s*else\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g,
  (_, h, a, b) => (h === HANDLE ? a : b));
js = js.replace(/\{\{[^}]*\}\}/g, '0').replace(/\{%[^%]*%\}/g, '');

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Harness — seletor de kits</title>
<style>:root{--vf-green:#5EBC43;--vf-green-dark:#1B5E20;--vf-text:#1A1A1A;--vf-surface:#fff}
body{margin:0;font-family:sans-serif}
${css}</style></head><body>
<section class="vf-pdp"><div class="vf-pdp__container"><div class="vf-pdp__buy"><div class="vf-pdp__buy-inner">
  <form class="vf-pdp__form">
    <input type="hidden" id="vf-pdp-qty" name="quantity" value="1">
    <div class="vf-pdp__kits" role="radiogroup">
      <p class="vf-pdp__kits-legend">Escolha a quantidade: <strong id="vf-pdp-kits-legend-value">1 Kit</strong></p>
      <div class="vf-pdp__kitbar" id="vf-pdp-kitbar">
        <div class="vf-pdp__kitbar-track"><div class="vf-pdp__kitbar-fill" id="vf-pdp-kitbar-fill"></div></div>
        <p class="vf-pdp__kitbar-msg" id="vf-pdp-kitbar-msg"></p>
      </div>
      <div class="vf-pdp__kits-grid" id="vf-pdp-kits-grid">${cards}</div>
    </div>
    <button type="submit" class="vf-pdp__cta vf-pdp__cta--primary">Adicionar ao carrinho</button>
  </form>
</div></div></div></section>
<input type="hidden" name="quantity" id="vf-pdp-sticky-qty-hidden" value="1">
<script>${js}</script>
</body></html>`;

fs.writeFileSync(path.join(__dirname, 'kits.html'), html);
console.log('kits.html gerado — ordem renderizada: ' + titles.join(' · '));
