// Reconstrói a coluna de compra da PDP com o CSS REAL do tema, para medir
// overflow horizontal no celular. Não é maquete de aparência: é o mesmo
// grid, as mesmas classes e a mesma folha de estilo da seção.
const fs = require('fs');
const path = require('path');

const SECAO = '/home/user/dev-vermfree/shopify-theme/sections/vf-pdp-main.liquid';
const RAIL = '/home/user/dev-vermfree/shopify-theme/snippets/vf-stories-rail.liquid';

const semComentario = (t) => t.replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '');

const secao = fs.readFileSync(SECAO, 'utf8');
const cssSecao = secao.match(/\{% stylesheet %\}([\s\S]*?)\{% endstylesheet %\}/)[1];

const rail = semComentario(fs.readFileSync(RAIL, 'utf8')).replace(/\{\{\s*uid\s*\}\}/g, 'teste');
const cssRail = rail.match(/<style>([\s\S]*?)<\/style>/)[1];

const N = 8;
const rotulos = ['Os sinais', 'Na prática', '12 sinais', 'Depoimento', 'Como age', 'Grávidas', 'Unboxing', 'Dúvidas'];
const circulos = rotulos.slice(0, N).map((r, i) => `
        <button type="button" class="vfsr__item" data-vfsr-open="${i}">
          <span class="vfsr__ring"><span class="vfsr__avatar"><span class="vfsr__ph"></span></span></span>
          <span class="vfsr__label">${r}</span>
        </button>`).join('');

const depoimentos = [1, 2, 3, 4].map(() => `
        <div class="vf-pdp__dep-card"><div class="vf-pdp__dep-media"></div></div>`).join('');

const page = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>Repro — coluna de compra da PDP</title>
<style>
  :root {
    --vf-green: #5EBC43; --vf-green-dark: #1B5E20; --vf-green-light: #C0DE96;
    --vf-bg: #FAFAFA; --vf-text: #1A1A1A; --vf-surface: #FFFFFF;
    --container: 1280px; --section-padding: 80px 16px;
    --button-radius: 10px; --button-padding-y: 12px; --card-radius: 16px;
  }
  body { margin: 0; font-family: 'Inter', sans-serif; }
${cssSecao}
${cssRail}
</style>
</head><body>
<section class="vf-pdp">
  <div class="vf-pdp__container">
    <div class="vf-pdp__gallery">
      <div class="vf-pdp__main-image"></div>
    </div>

    <div class="vf-pdp__buy">
      <div class="vf-pdp__buy-inner">
        <h1 class="vf-pdp__title">Protocolo de Desparasitação Natural | VermeFree Adulto</h1>

        <form class="vf-pdp__form">
          <button type="button" class="vf-pdp__cta vf-pdp__cta--primary">Adicionar ao carrinho <span>&rarr;</span></button>
          <button type="button" class="vf-pdp__cta vf-pdp__cta--secondary">Comprar agora</button>
        </form>

        <div class="vfsr" data-vfsr="teste">
          <h3 class="vfsr__heading">Tire suas dúvidas</h3>
          <div class="vfsr__row">${circulos}</div>
        </div>

        <div class="vf-pdp__dep">
          <h3 class="vf-pdp__dep-title">O que dizem nossos clientes</h3>
          <div class="vf-pdp__dep-row">${depoimentos}</div>
        </div>

        <div class="vf-pdp__accordions">
          <details class="vf-pdp__accordion"><summary>Como tomar</summary></details>
        </div>
      </div>
    </div>
  </div>
</section>
</body></html>
`;

fs.writeFileSync(path.join(__dirname, 'pdp.html'), page);
console.log('pdp.html gerado com o CSS real da seção');
