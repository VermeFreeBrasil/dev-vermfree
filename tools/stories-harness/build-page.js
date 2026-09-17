// Monta a pagina de teste a partir do arquivo .liquid REAL (renderizando as
// poucas saidas Liquid que ele usa), para o teste nunca validar uma copia.
const fs = require('fs');
const path = require('path');

const SNIPPET = '/home/user/dev-vermfree/shopify-theme/snippets/vf-stories-viewer.liquid';

let liquid = fs.readFileSync(SNIPPET, 'utf8');
liquid = liquid.replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '');
liquid = liquid.replace(/\{\{\s*routes\.cart_url\s*\}\}/g, '/cart');

const left = liquid.match(/\{[{%]/);
if (left) throw new Error('sobrou Liquid nao renderizado: ' + liquid.slice(left.index, left.index + 60));

const page = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Harness — vf-stories-viewer</title>
<script>
  // Permite simular a recusa de autoplay do navegador.
  (function () {
    var realPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.__playCalls = (window.__playCalls || 0) + 1;
      if (window.__failUnmutedPlay && !this.muted) {
        return Promise.reject(new DOMException('bloqueado', 'NotAllowedError'));
      }
      return realPlay.apply(this, arguments);
    };
  })();
</script>
<style> body { margin: 0; height: 4000px; font-family: sans-serif; } </style>
</head>
<body>
  <header>
    <span class="vf-header__cart-count" data-vf-cart-count hidden>0</span>
    <span class="vf-cart-icon__count is-empty" data-cart-count>0</span>
  </header>

  <button id="abrir-0" type="button">abrir story 0</button>
  <button id="abrir-1" type="button">abrir story 1</button>
  <button id="abrir-sem-produto" type="button">abrir lista sem produto</button>
  <button id="abrir-esgotado" type="button">abrir lista esgotado</button>
  <button id="abrir-multi-pdp" type="button">abrir multivariante pdp</button>
  <button id="abrir-multi-home" type="button">abrir multivariante home</button>
  <button id="abrir-fonte-quebrada" type="button">abrir com story sem fonte</button>

${liquid}

<script>
  function fonte(nome) { return [{ src: '/media/' + nome + '.webm', type: 'video/webm' }]; }

  var produto = {
    title: 'Protocolo de Desparasitação Natural | VermeFree Adulto',
    url: '/products/protocolo-desparasitacao-adulto-vermefree',
    image: '/media/thumb.png',
    price: 'R$ 347,00',
    variants: 1,
    vid: '51234567890',
    available: true
  };

  window.VFStories.register('pdp', [
    { sources: fonte('clip1'), eyebrow: 'MAIS VENDIDO', offer: '', badge: 'NOVO', cta: 'Adicionar ao carrinho', mode: 'pdp', product: produto },
    { sources: fonte('clip2'), eyebrow: '', offer: 'Ganhe 5 sachês', badge: '', cta: 'Adicionar ao carrinho', mode: 'pdp', product: produto },
    { sources: fonte('clip3'), eyebrow: '', offer: '', badge: '', cta: 'Adicionar ao carrinho', mode: 'pdp', product: produto }
  ]);

  window.VFStories.register('sem-produto', [
    { sources: fonte('clip1'), mode: 'home', product: null }
  ]);

  window.VFStories.register('esgotado', [
    { sources: fonte('clip1'), mode: 'pdp', product: Object.assign({}, produto, { available: false }) }
  ]);

  window.VFStories.register('multi-pdp', [
    { sources: fonte('clip1'), mode: 'pdp', product: Object.assign({}, produto, { variants: 3 }) }
  ]);

  window.VFStories.register('multi-home', [
    { sources: fonte('clip1'), mode: 'home', product: Object.assign({}, produto, { variants: 3 }) }
  ]);

  window.VFStories.register('fonte-quebrada', [
    { sources: [], mode: 'pdp', product: produto },
    { sources: fonte('clip2'), mode: 'pdp', product: produto }
  ]);

  function liga(id, lista, indice) {
    document.getElementById(id).addEventListener('click', function (e) {
      window.VFStories.open(lista, indice, e.currentTarget);
    });
  }
  liga('abrir-0', 'pdp', 0);
  liga('abrir-1', 'pdp', 1);
  liga('abrir-sem-produto', 'sem-produto', 0);
  liga('abrir-esgotado', 'esgotado', 0);
  liga('abrir-multi-pdp', 'multi-pdp', 0);
  liga('abrir-multi-home', 'multi-home', 0);
  liga('abrir-fonte-quebrada', 'fonte-quebrada', 0);
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), page);
console.log('index.html gerado a partir do snippet real');
