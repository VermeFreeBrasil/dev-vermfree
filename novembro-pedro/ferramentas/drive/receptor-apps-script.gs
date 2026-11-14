// Receptor de uploads para o Google Drive da VermeFree (Google Apps Script, publicado como app da web).
// Recebe o arquivo em base64 no corpo (POST, text/plain) e grava na pasta indicada.
// Parâmetros na URL: token, name, folder (ID da pasta), mime (ex.: image/png).
// Publicar: Implantar > Nova implantação > App da web · Executar como: eu · Quem pode acessar: qualquer pessoa.
const TOKEN = 'COLE_AQUI_O_TOKEN';

function doPost(e) {
  const p = e.parameter || {};
  if (p.token !== TOKEN) return resposta({ ok: false, erro: 'token' });
  if (!p.name || !p.folder) return resposta({ ok: false, erro: 'parametros' });
  const bytes = Utilities.base64Decode(e.postData.contents.replace(/\s/g, ''));
  const blob = Utilities.newBlob(bytes, p.mime || 'application/octet-stream', p.name);
  const arq = DriveApp.getFolderById(p.folder).createFile(blob);
  return resposta({ ok: true, id: arq.getId(), url: arq.getUrl(), nome: arq.getName() });
}

function doGet(e) {
  const p = e.parameter || {};
  if (p.token !== TOKEN) return resposta({ ok: false, erro: 'token' });
  return resposta({ ok: true, conta: Session.getEffectiveUser().getEmail() });
}

function resposta(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
