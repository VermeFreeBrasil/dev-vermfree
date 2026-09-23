// Página de teste da régua. O <style> e o <script> saem do arquivo .liquid
// real (é o JS que carrega o risco); a marcação dos círculos é montada aqui
// espelhando a do snippet, porque renderizar Liquid com objetos video da
// Shopify fora da loja não é possível.
const fs = require('fs');
const path = require('path');

// RAIL e N dão pra trocar por variável de ambiente: os temas divergem (o do
// Judge.me tem 16 espaços) e a régua cheia é outro caso de layout.
const RAIL = process.env.VF_RAIL || '/home/user/dev-vermfree/shopify-theme/snippets/vf-stories-rail.liquid';
const VIEWER = '/home/user/dev-vermfree/shopify-theme/snippets/vf-stories-viewer.liquid';
const UID = 'teste';
const N = Number(process.env.VF_N || 6);

const semComentario = (t) => t.replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '');

const rail = semComentario(fs.readFileSync(RAIL, 'utf8')).replace(/\{\{\s*uid\s*\}\}/g, UID);
const estiloRail = (rail.match(/<style>([\s\S]*?)<\/style>/) || [])[1];
const scriptRail = (rail.match(/<script>([\s\S]*?)<\/script>/) || [])[1];
if (!estiloRail || !scriptRail) throw new Error('não achei style/script na régua');
if (/\{[{%]/.test(scriptRail)) throw new Error('sobrou Liquid no script da régua');

const viewer = semComentario(fs.readFileSync(VIEWER, 'utf8'))
  .replace(/\{\{\s*routes\.cart_url\s*\}\}/g, '/cart');
if (/\{[{%]/.test(viewer)) throw new Error('sobrou Liquid no visualizador');

const clipes = Array.from({ length: N }, (_, i) => 'clip' + ((i % 3) + 1));

const circulos = clipes.slice(0, N).map((c, i) => `
  <button type="button" class="vfsr__item" data-vfsr-open="${i}">
    <span class="vfsr__ring"><span class="vfsr__avatar">
      <video class="vfsr__thumb" data-vfsr-thumb muted loop playsinline preload="none" tabindex="-1" aria-hidden="true">
        <source src="/media/${c}.webm" type="video/webm">
      </video>
    </span></span>
    <span class="vfsr__label">Destaque ${i + 1}</span>
  </button>`).join('');

const dados = clipes.slice(0, N).map((c) => ({
  sources: [{ src: '/media/' + c + '.webm', type: 'video/webm' }],
  eyebrow: 'MAIS VENDIDO', offer: '', badge: '', cta: 'Adicionar ao carrinho', mode: 'pdp',
  product: {
    title: 'Protocolo de Desparasitação Natural | VermeFree Adulto',
    url: '/products/protocolo-desparasitacao-adulto-vermefree',
    image: '/media/thumb.png', price: 'R$ 347,00', variants: 1, vid: '48772143415515', available: true
  }
}));

const page = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>Harness — vf-stories-rail</title>
<script>
  (function () {
    var real = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (window.__recusarTudo) return Promise.reject(new DOMException('bloqueado', 'NotAllowedError'));
      return real.apply(this, arguments);
    };
  })();
</script>
<style>
  body { margin: 0; font-family: sans-serif; }
  .antes { height: 120px; }
  .depois { height: 2200px; }
  ${estiloRail}
</style>
</head><body>
<div class="antes">topo</div>

<div class="vfsr" data-vfsr="${UID}">
  <h3 class="vfsr__heading">Tire suas dúvidas</h3>
  <div class="vfsr__row">${circulos}</div>
  <script type="application/json" data-vfsr-data>${JSON.stringify(dados)}</script>
</div>

<div class="depois">conteúdo abaixo, para a régua sair da tela</div>

${viewer}

<script>${scriptRail}</script>
</body></html>
`;

fs.writeFileSync(path.join(__dirname, 'rail.html'), page);
console.log('rail.html gerado (style + script vindos do .liquid real)');
