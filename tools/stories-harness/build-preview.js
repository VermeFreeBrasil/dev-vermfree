// Monta a pagina de preview publicavel. O visualizador vai inteiro, lido do
// arquivo .liquid real — o que voce toca aqui e o que vai para a loja.
const fs = require('fs');
const path = require('path');

const SNIPPET = '/home/user/dev-vermfree/shopify-theme/snippets/vf-stories-viewer.liquid';
const SAIDA = process.argv[2];

let viewer = fs.readFileSync(SNIPPET, 'utf8')
  .replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '')
  .replace(/\{\{\s*routes\.cart_url\s*\}\}/g, '#carrinho-simulado')
  .trim();
if (/\{[{%]/.test(viewer)) throw new Error('sobrou Liquid nao renderizado');

const midia = path.join(__dirname, 'preview-media');
const clipe = (n) => 'data:video/webm;base64,' +
  fs.readFileSync(path.join(midia, n + '.webm')).toString('base64');

const CLIPES = [
  { arquivo: 'c1', rotulo: 'DR-SINAIS' },
  { arquivo: 'c2', rotulo: 'DR-ELIMINA' },
  { arquivo: 'c3', rotulo: 'JULIANA-UNBOX' },
  { arquivo: 'c4', rotulo: 'DR-12SINAIS' },
  { arquivo: 'c5', rotulo: 'DR-PET' }
];

const FOTO = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect width='120' height='120' rx='16' fill='%23EAF3E2'/><rect x='44' y='16' width='32' height='14' rx='4' fill='%231B5E20'/><rect x='34' y='30' width='52' height='74' rx='10' fill='%235EBC43'/><text x='60' y='76' font-family='sans-serif' font-size='19' font-weight='700' fill='%23ffffff' text-anchor='middle'>VF</text></svg>";

const html = `<title>Stories VermeFree</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caprasimo&family=Inter:wght@400;500;600;700;800&display=swap">
<style>
  :root {
    --fundo: #F7F8F4;
    --superficie: #FFFFFF;
    --superficie-2: #EFF3E9;
    --texto: #1A1F17;
    --suave: #5C6654;
    --borda: #DFE5D6;
    --verde: #4C9E37;
    --verde-forte: #1B5E20;
    --aviso-fundo: #FFF8E6;
    --aviso-borda: #E8D6A3;
    --aviso-texto: #6B551E;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --fundo: #111409;
      --superficie: #1A1E14;
      --superficie-2: #232819;
      --texto: #F0F3EA;
      --suave: #A3AD96;
      --borda: #2E3526;
      --verde: #7FCB5F;
      --verde-forte: #A9DC8A;
      --aviso-fundo: #2A2413;
      --aviso-borda: #4A3F1E;
      --aviso-texto: #E4CF95;
    }
  }
  :root[data-theme="dark"] {
    --fundo: #111409;
    --superficie: #1A1E14;
    --superficie-2: #232819;
    --texto: #F0F3EA;
    --suave: #A3AD96;
    --borda: #2E3526;
    --verde: #7FCB5F;
    --verde-forte: #A9DC8A;
    --aviso-fundo: #2A2413;
    --aviso-borda: #4A3F1E;
    --aviso-texto: #E4CF95;
  }

  body {
    margin: 0;
    background: var(--fundo);
    color: var(--texto);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 15px;
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
  }
  .pagina {
    max-width: 640px;
    margin: 0 auto;
    padding-inline: 20px;
    padding-block: 28px 64px;
    display: flex;
    flex-direction: column;
    gap: 34px;
  }

  .topo { display: flex; flex-direction: column; gap: 12px; }
  .etapa {
    align-self: flex-start;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--verde-forte);
    background: var(--superficie-2);
    border-radius: 999px;
    padding: 5px 11px;
  }
  h1 {
    font-family: 'Caprasimo', Georgia, serif;
    font-weight: 400;
    font-size: clamp(30px, 7vw, 42px);
    line-height: 1.08;
    margin: 0;
    text-wrap: balance;
  }
  .sub { margin: 0; color: var(--suave); max-width: 52ch; }

  .barra-carrinho {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 14px;
    background: var(--superficie);
    border: 1px solid var(--borda);
    border-radius: 12px;
    font-size: 13.5px;
    color: var(--suave);
  }
  .barra-carrinho strong { color: var(--texto); font-weight: 600; }
  .barra-carrinho__texto { flex: 1 1 auto; min-width: 0; }
  .chip-contador {
    flex: 0 0 auto;
    min-width: 30px;
    text-align: center;
    padding: 3px 9px;
    border-radius: 999px;
    background: var(--verde);
    color: #fff;
    font-weight: 700;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
  }
  .chip-contador.is-empty { background: var(--superficie-2); color: var(--suave); }

  h2 {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--suave);
    margin: 0 0 14px;
  }
  section > p:first-of-type { margin-top: 0; }
  section p { margin: 0 0 14px; color: var(--suave); }

  .regua {
    display: flex;
    gap: 14px;
    overflow-x: auto;
    padding: 4px 2px 10px;
    scrollbar-width: none;
  }
  .regua::-webkit-scrollbar { display: none; }
  .circulo {
    flex: 0 0 auto;
    width: 76px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    background: none;
    border: 0;
    padding: 0;
    cursor: pointer;
    color: inherit;
    font: inherit;
  }
  .anel {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    padding: 3px;
    background: linear-gradient(140deg, var(--verde) 0%, var(--verde-forte) 100%);
  }
  .miolo {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid var(--superficie);
    background: linear-gradient(160deg, #1d2a17, #2f5a2a);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #cfe8bf;
    font-size: 19px;
  }
  .legenda {
    font-size: 11px;
    font-weight: 600;
    line-height: 1.2;
    text-align: center;
    color: var(--texto);
    word-break: break-word;
  }
  .circulo:focus-visible .anel { outline: 2px solid var(--verde-forte); outline-offset: 3px; }

  .estados { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  @media (max-width: 430px) { .estados { grid-template-columns: 1fr; } }
  .estado {
    text-align: left;
    background: var(--superficie);
    border: 1px solid var(--borda);
    border-radius: 12px;
    padding: 12px 14px;
    cursor: pointer;
    color: inherit;
    font: inherit;
    display: flex;
    flex-direction: column;
    gap: 3px;
    transition: border-color 0.15s ease, background 0.15s ease;
  }
  .estado:hover { border-color: var(--verde); background: var(--superficie-2); }
  .estado b { font-weight: 600; font-size: 14.5px; }
  .estado span { font-size: 12.5px; color: var(--suave); }

  ul { margin: 0; padding-left: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
  li { position: relative; padding-left: 18px; font-size: 14px; }
  li b { font-weight: 600; }
  li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 9px;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--verde);
  }
  kbd {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
    background: var(--superficie-2);
    border: 1px solid var(--borda);
    border-radius: 5px;
    padding: 1px 5px;
  }

  .aviso {
    background: var(--aviso-fundo);
    border: 1px solid var(--aviso-borda);
    color: var(--aviso-texto);
    border-radius: 12px;
    padding: 14px 16px;
    font-size: 13.5px;
    line-height: 1.5;
  }
  .aviso b { font-weight: 700; }

  .nota-pdp {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: calc(18px + env(safe-area-inset-bottom, 0px));
    z-index: 100001;
    background: var(--verde-forte);
    color: #fff;
    padding: 11px 16px;
    border-radius: 999px;
    font-size: 13.5px;
    font-weight: 600;
    box-shadow: 0 8px 24px rgba(0,0,0,.3);
  }
</style>

<div class="pagina">
  <header class="topo">
    <span class="etapa">Tema VermeFree · Etapa 1</span>
    <h1>Stories em tela cheia</h1>
    <p class="sub">
      Este é o visualizador que a régua da página de produto e o carrossel da home
      vão usar. O código nesta página é o mesmo arquivo que vai para a loja, lido
      direto do tema — não é uma maquete.
    </p>
  </header>

  <div class="barra-carrinho">
    <span class="barra-carrinho__texto"><strong>Carrinho simulado</strong> — o contador sobe igual ao do header da loja</span>
    <span class="chip-contador is-empty" data-vf-cart-count>0</span>
  </div>

  <section>
    <h2>Toque para abrir</h2>
    <p>
      Cinco stories em sequência, com o cartão de compra do Protocolo Adulto.
      Os círculos aqui são só o gatilho: os de verdade, com vídeo tocando em
      loop dentro, vêm na Etapa 2.
    </p>
    <div class="regua" id="regua"></div>
  </section>

  <section>
    <h2>Os quatro estados do botão</h2>
    <p>Cada um abre o mesmo visualizador com um produto diferente por trás.</p>
    <div class="estados">
      <button class="estado" type="button" data-abrir="sem-produto">
        <b>Sem produto</b><span>O story abre limpo, sem cartão</span>
      </button>
      <button class="estado" type="button" data-abrir="esgotado">
        <b>Esgotado</b><span>Botão desabilitado</span>
      </button>
      <button class="estado" type="button" data-abrir="multi-pdp">
        <b>Multivariante na PDP</b><span>Vira "Escolher opção" e fecha</span>
      </button>
      <button class="estado" type="button" data-abrir="multi-home">
        <b>Multivariante na home</b><span>Leva para a página do produto</span>
      </button>
    </div>
  </section>

  <section>
    <h2>O que vale testar</h2>
    <ul>
      <li>Toque na <b>metade direita</b> para avançar, na <b>esquerda</b> para voltar — e repare que a faixa de baixo não rouba o clique do botão.</li>
      <li><b>Arraste para baixo</b> para fechar. Arraste na diagonal e veja que ele <b>não</b> fecha: swipe torto não pode fechar sem querer.</li>
      <li>Deixe um story terminar: ele avança sozinho, e passar do último fecha.</li>
      <li>No computador: <kbd>Esc</kbd> fecha, <kbd>←</kbd> e <kbd>→</kbd> navegam, e clicar na faixa preta ao lado fecha.</li>
      <li>Adicione ao carrinho: o aviso aparece, o contador sobe e <b>o story continua aberto</b>.</li>
      <li>Role a página por baixo enquanto o story está aberto — não deve rolar. Feche e a rolagem volta.</li>
    </ul>
  </section>

  <section>
    <h2>O que este preview não mostra</h2>
    <div class="aviso">
      <p style="margin:0 0 10px">
        <b>Os vídeos são clipes de teste.</b> Os 12 reais estão na CDN da Shopify,
        que uma página publicada aqui não tem permissão de carregar. Eles entram
        quando isso subir para o tema.
      </p>
      <p style="margin:0 0 10px">
        <b>E são curtos de propósito.</b> Os reais têm de 53s a 2min09. Aqui cada
        um dura 3 segundos — então a sensação de esperar a barra andar, que é a
        questão real de conteúdo, este preview esconde.
      </p>
      <p style="margin:0">
        <b>O carrinho é simulado.</b> A chamada de verdade ao <code>/cart/add.js</code>
        foi validada em 51 checagens num Chromium real, com o payload conferido.
      </p>
    </div>
  </section>
</div>

<script>
  // Carrinho simulado: a página publicada não fala com a loja.
  (function () {
    var itens = 0;
    var original = window.fetch;
    window.fetch = function (url) {
      var alvo = String(url || '');
      if (alvo.indexOf('/cart/add.js') !== -1) {
        itens += 1;
        return Promise.resolve(new Response(JSON.stringify({ items: [{ id: 1 }] }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }
      if (alvo.indexOf('/cart.js') !== -1) {
        return Promise.resolve(new Response(JSON.stringify({ item_count: itens }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }
      return original.apply(this, arguments);
    };
  })();
</script>

${viewer}

<script>
  (function () {
    var CLIPES = ${JSON.stringify(CLIPES.map((c) => ({ rotulo: c.rotulo, src: clipe(c.arquivo) })))};
    var FOTO = ${JSON.stringify(FOTO)};

    var adulto = {
      title: 'Protocolo de Desparasitação Natural | VermeFree Adulto',
      url: '#levaria-para-a-pdp',
      image: FOTO,
      price: 'R$ 347,00',
      variants: 1,
      vid: '48772143415515',
      available: true
    };

    function fonte(i) { return [{ src: CLIPES[i].src, type: 'video/webm' }]; }

    var principais = CLIPES.map(function (c, i) {
      return {
        sources: fonte(i),
        eyebrow: i === 0 ? 'MAIS VENDIDO' : '',
        offer: i === 1 ? 'Protocolo completo de 30 dias' : '',
        badge: i === 0 ? 'NOVO' : '',
        cta: 'Adicionar ao carrinho',
        mode: 'pdp',
        product: adulto
      };
    });

    window.VFStories.register('principal', principais);
    window.VFStories.register('sem-produto', [{ sources: fonte(2), mode: 'pdp', product: null }]);
    window.VFStories.register('esgotado', [{
      sources: fonte(0), mode: 'pdp',
      product: Object.assign({}, adulto, { available: false })
    }]);
    window.VFStories.register('multi-pdp', [{
      sources: fonte(1), mode: 'pdp',
      product: Object.assign({}, adulto, { variants: 3 })
    }]);
    window.VFStories.register('multi-home', [{
      sources: fonte(3), mode: 'home',
      product: Object.assign({}, adulto, { variants: 3 })
    }]);

    var regua = document.getElementById('regua');
    CLIPES.forEach(function (c, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'circulo';
      b.innerHTML = '<span class="anel"><span class="miolo">&#9654;</span></span>' +
        '<span class="legenda"></span>';
      b.querySelector('.legenda').textContent = c.rotulo;
      b.addEventListener('click', function () {
        window.VFStories.open('principal', i, b);
      });
      regua.appendChild(b);
    });

    document.querySelectorAll('[data-abrir]').forEach(function (b) {
      b.addEventListener('click', function () {
        window.VFStories.open(b.getAttribute('data-abrir'), 0, b);
      });
    });

    // Na loja o botão leva mesmo para a PDP. Aqui só avisa, para o preview
    // não sair da página.
    window.addEventListener('hashchange', function () {
      if (location.hash !== '#levaria-para-a-pdp' && location.hash !== '#carrinho-simulado') return;
      var texto = location.hash === '#carrinho-simulado'
        ? 'Na loja, isto abre a página do carrinho'
        : 'Na loja, isto abre a página do produto';
      var nota = document.createElement('div');
      nota.className = 'nota-pdp';
      nota.textContent = texto;
      document.body.appendChild(nota);
      setTimeout(function () { nota.remove(); }, 2600);
      history.replaceState(null, '', location.pathname + location.search);
    });
  })();
</script>
`;

fs.writeFileSync(SAIDA, html);
console.log(SAIDA + ' — ' + Math.round(fs.statSync(SAIDA).size / 1024) + ' KB');
