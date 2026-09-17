// Página de teste da seção de prescritores, com o CSS e o JS reais do arquivo
// .liquid. A marcação espelha a do Liquid porque renderizar Liquid fora da
// loja não é possível.
const fs = require('fs');
const path = require('path');

const SECAO = '/home/user/dev-vermfree/shopify-theme/sections/vf-prescritores.liquid';
const UID = 'presctest';

const secao = fs.readFileSync(SECAO, 'utf8');
const css = secao.match(/\{% stylesheet %\}([\s\S]*?)\{% endstylesheet %\}/)[1];
const js = secao.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/\{\{\s*uid\s*\}\}/g, UID);
if (/\{[{%]/.test(js)) throw new Error('sobrou Liquid no script');

// Retratos sintéticos: o "rosto" fica fora do centro de propósito, para dar o
// que enquadrar com zoom/foco.
function retrato(cor, rostoX, rostoY) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
    <rect width="400" height="500" fill="${cor}"/>
    <circle cx="${rostoX}" cy="${rostoY}" r="42" fill="#F2D6BE"/>
    <rect x="${rostoX - 55}" y="${rostoY + 40}" width="110" height="180" rx="30" fill="#2A3B2C"/>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Casos difíceis de propósito: especialidade de 1 e de 3 linhas no mesmo
// trilho (era o que desalinhava os botões), @ comprido (era o que vazava),
// card sem frase própria (cai na neutra) e card sem @ nenhum.
// A seção entrega a frase neutra vazia; aqui o vazio é o padrão e só o
// primeiro médico tem frase própria, que é o cenário real de hoje.
const FRASE_NEUTRA = '';
const MEDICOS = [
  { nome: 'Dr. William Araújo', crm: 'CRM-MG 76.962', esp: 'Curadoria científica do protocolo VermeFree',
    ig: 'drwilliamaraujo', destaque: true, zoom: 100, fx: 50, fy: 30,
    frase: 'Acompanho a formulação desde o início e <strong>indico o protocolo</strong> aos meus pacientes.' },
  { nome: 'Dra. Giovanna Eller', crm: 'CRM-ES 20.998', esp: 'Nutróloga · saúde intestinal e emagrecimento',
    ig: 'dra.giovannaeller', zoom: 130, fx: 45, fy: 22, frase: '' },
  { nome: 'Dr. Robson Araújo', crm: 'CRM-MG 93.787', esp: 'Emagrecimento e saúde integrativa',
    ig: 'drrobson_araujo', zoom: 160, fx: 60, fy: 18, frase: '' },
  { nome: 'Dra. Raquel Cembranelli', crm: 'CRO-SP 83.705', esp: 'Cirurgiã-dentista · odontologia integrativa',
    ig: 'dra.raquelcembranelli', zoom: 100, fx: 50, fy: 25, frase: '' },
  // Os quatro vindos da Botanika: sem foto, sem @ e sem frase — o estado
  // real até as fotos subirem. É aqui que o placeholder de iniciais entra.
  { nome: 'Dr. Eglife Brauher', crm: 'CRM-BA 32.688', esp: 'Médico', ig: '', semFoto: true, zoom: 100, fx: 50, fy: 30, frase: '' },
  { nome: 'Dr. Kalil Gibran Ferreira Lima', crm: 'CRM-BA 34.392', esp: 'Médico', ig: '', semFoto: true, zoom: 100, fx: 50, fy: 30, frase: '' },
  { nome: 'Dr. Carlos Mateus Santos Osório', crm: 'CRM-SP 215.405', esp: 'Médico', ig: '', semFoto: true, zoom: 105, fx: 50, fy: 20, frase: '' },
  { nome: 'Dra. Grace Dessirre', crm: 'CFO-SP 084169', esp: 'Cirurgiã-dentista', ig: '', semFoto: true, zoom: 100, fx: 50, fy: 30, frase: '' },
];

// Mesmas iniciais que o Liquid monta: tira Dr./Dra. e pega a primeira letra
// das duas primeiras palavras.
function iniciais(nome) {
  return nome.replace(/Dra?\./g, '').trim().split(/\s+/).slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase()).join('');
}
const CORES = ['#C9B79C', '#8C5A4A', '#3A3F4B', '#9AA37F', '#6E7A8A', '#B2887A'];

const IG_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>';

function card(m, i) {
  const style = `object-position:${m.fx}% ${m.fy}%;transform:scale(${m.zoom / 100});`;
  const frase = m.frase || FRASE_NEUTRA;
  const ig = m.ig
    ? `<a class="vf-presc__ig" href="https://www.instagram.com/${m.ig}/" target="_blank" rel="noopener nofollow" aria-label="Instagram de ${m.nome}">${IG_SVG}<span class="vf-presc__handle">@${m.ig}</span></a>`
    : '';
  const media = m.semFoto
    ? `<div class="vf-presc__img vf-presc__img--placeholder" aria-hidden="true">${iniciais(m.nome)}</div>`
    : `<img src="${retrato(CORES[i % CORES.length], 150 + i * 20, 130 + i * 15)}" alt="${m.nome}" class="vf-presc__img" style="${style}">`;
  return `<article class="vf-presc__card${m.destaque ? ' is-destaque' : ''}">
    <div class="vf-presc__media">
      ${media}
      <span class="vf-presc__selo">${m.crm}</span>
      ${m.destaque ? '<span class="vf-presc__fita">Curadoria científica</span>' : ''}
    </div>
    <div class="vf-presc__body">
      ${frase ? `<blockquote class="vf-presc__quote">${frase}</blockquote>` : ''}
      <div class="vf-presc__id">
        <h3 class="vf-presc__name">${m.nome}</h3>
        <p class="vf-presc__specialty">${m.esp}</p>
      </div>
      ${ig}
    </div>
  </article>`;
}

function pagina(quantos, arquivo) {
  const cards = MEDICOS.slice(0, quantos).map(card).join('\n');
  const grade = quantos <= 4;
  const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Harness — vf-prescritores (${quantos})</title>
<style>
  body { margin: 0; font-family: 'Inter', system-ui, sans-serif; }
  .antes, .depois { height: 200px; background: #fff; }
${css}
</style>
</head><body>
<div class="antes">acima</div>
<section class="vf-presc" aria-labelledby="h-${UID}" style="--vf-presc-card: 300px; --vf-presc-n: ${quantos};">
  <div class="vf-presc__container">
    <span class="vf-presc__eyebrow">AUTORIDADE MÉDICA</span>
    <h2 id="h-${UID}" class="vf-presc__heading">Profissionais de saúde que recomendam a VermeFree</h2>
    <p class="vf-presc__subheading">Médicos e especialistas que conhecem o protocolo e indicam pros seus pacientes.</p>
  </div>
  <div class="vf-presc__carousel${grade ? ' vf-presc__carousel--grade' : ''}" data-vf-presc="${UID}">
    <button type="button" class="vf-presc__nav vf-presc__nav--prev" data-vf-presc-prev aria-label="Anterior">&lt;</button>
    <div class="vf-presc__track" data-vf-presc-track>
${cards}
    </div>
    <button type="button" class="vf-presc__nav vf-presc__nav--next" data-vf-presc-next aria-label="Próximo">&gt;</button>
  </div>
</section>
<div class="depois">abaixo</div>
<script>${js}</script>
</body></html>
`;
  fs.writeFileSync(path.join(__dirname, arquivo), html);
}

pagina(8, 'presc.html');        // os 8 de hoje -> carrossel
pagina(4, 'presc-quatro.html'); // estado real da loja hoje -> grade
pagina(2, 'presc-poucos.html');
console.log('presc.html (8), presc-quatro.html (4) e presc-poucos.html (2) gerados com o CSS e o JS reais da seção');
