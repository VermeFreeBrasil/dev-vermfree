// Confere os valores gravados nas templates contra as restrições do schema da
// seção. Existe porque a Shopify recusou um upload por causa de photo_focus_y
// = 24 num range de passo 5 — o erro só aparece na hora de subir, e aí já
// custou uma ida e volta.
const fs = require('fs');
const path = require('path');

const RAIZ = '/home/user/dev-vermfree/shopify-theme';
const semComentarioJson = (t) => t.replace(/\/\*[\s\S]*?\*\//, '');

function schemas() {
  const mapa = {};
  for (const arq of fs.readdirSync(path.join(RAIZ, 'sections'))) {
    const txt = fs.readFileSync(path.join(RAIZ, 'sections', arq), 'utf8');
    const m = txt.match(/\{% schema %\}([\s\S]*?)\{% endschema %\}/);
    if (!m) continue;
    mapa[arq.replace(/\.liquid$/, '')] = JSON.parse(m[1]);
  }
  return mapa;
}

function porId(lista) {
  const m = {};
  (lista || []).forEach((s) => { if (s.id) m[s.id] = s; });
  return m;
}

function conferir(valores, defs, onde, erros) {
  for (const [id, v] of Object.entries(valores || {})) {
    const d = defs[id];
    if (!d) continue;                       // a Shopify simplesmente descarta
    if (d.type === 'range') {
      const passo = d.step || 1;
      if (typeof v !== 'number') { erros.push(onde + '.' + id + ' = ' + JSON.stringify(v) + ' (range espera número)'); continue; }
      if (v < d.min || v > d.max) erros.push(onde + '.' + id + ' = ' + v + ' fora de [' + d.min + ',' + d.max + ']');
      else if ((v - d.min) % passo !== 0) erros.push(onde + '.' + id + ' = ' + v + ' não é passo de ' + passo + ' a partir de ' + d.min);
    }
    if (d.type === 'select' && d.options && !d.options.some((o) => o.value === v)) {
      erros.push(onde + '.' + id + ' = ' + JSON.stringify(v) + ' fora das opções');
    }
  }
}

const S = schemas();
const erros = [];
for (const arq of fs.readdirSync(path.join(RAIZ, 'templates'))) {
  if (!arq.endsWith('.json')) continue;
  const d = JSON.parse(semComentarioJson(fs.readFileSync(path.join(RAIZ, 'templates', arq), 'utf8')));
  for (const [chave, sec] of Object.entries(d.sections || {})) {
    const esq = S[sec.type];
    if (!esq) continue;                     // seção que não está no espelho local
    conferir(sec.settings, porId(esq.settings), arq + ' > ' + chave, erros);
    const porTipo = {};
    (esq.blocks || []).forEach((b) => { porTipo[b.type] = porId(b.settings); });
    for (const [bk, b] of Object.entries(sec.blocks || {})) {
      if (porTipo[b.type]) conferir(b.settings, porTipo[b.type], arq + ' > ' + chave + ' > ' + bk, erros);
    }
  }
}

if (erros.length) {
  erros.forEach((e) => console.log('  XX  ' + e));
  console.log('\n' + erros.length + ' valor(es) que a Shopify vai recusar');
  process.exit(1);
}
console.log('  ok  valores das templates batem com os schemas das seções');
