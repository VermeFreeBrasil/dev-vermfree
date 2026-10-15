/**
 * Web App de upload para o Google Drive (usado por .claude/skills/editar-videos-drive/scripts/subir-drive.py).
 *
 * Instalação (uma vez): veja edicao-de-video/COMO-USAR.md, seção "Subir para o Drive".
 * 1. script.google.com → Novo projeto → cole este arquivo.
 * 2. Troque TOKEN por uma senha longa sua.
 * 3. Implantar → Nova implantação → App da Web → Executar como: Eu → Quem pode acessar: Qualquer pessoa.
 *
 * O arquivo é enviado em pedaços para uma sessão de upload resumível da API do Drive,
 * então não há limite prático de tamanho (cada pedaço tem 8 MB).
 */
const TOKEN = 'TROQUE-POR-UMA-SENHA-LONGA';

function doPost(e) {
  try {
    const req = JSON.parse(e.postData.contents);
    if (req.token !== TOKEN) return out_({ ok: false, erro: 'token inválido' });
    switch (req.action) {
      case 'ping':
        return out_({ ok: true, conta: Session.getEffectiveUser().getEmail() });
      case 'exists': {
        const it = DriveApp.getFolderById(req.folderId).getFilesByName(req.name);
        while (it.hasNext()) {
          const f = it.next();
          if (!f.isTrashed()) return out_({ ok: true, existe: true, id: f.getId(), url: f.getUrl() });
        }
        return out_({ ok: true, existe: false });
      }
      case 'start': {
        DriveApp.getFolderById(req.folderId); // valida a pasta (e garante o escopo do Drive)
        const r = UrlFetchApp.fetch(
          'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true', {
            method: 'post',
            contentType: 'application/json; charset=UTF-8',
            headers: {
              Authorization: 'Bearer ' + ScriptApp.getOAuthToken(),
              'X-Upload-Content-Type': req.mimeType || 'application/octet-stream',
              'X-Upload-Content-Length': String(req.size),
            },
            payload: JSON.stringify({ name: req.name, parents: [req.folderId] }),
            muteHttpExceptions: true,
          });
        const sessao = r.getHeaders()['Location'] || r.getHeaders()['location'];
        if (!sessao) return out_({ ok: false, erro: 'sem sessão: ' + r.getResponseCode() + ' ' + r.getContentText() });
        return out_({ ok: true, session: sessao });
      }
      case 'chunk': {
        const bytes = Utilities.base64Decode(req.data);
        const fim = req.start + bytes.length - 1;
        const r = UrlFetchApp.fetch(req.session, {
          method: 'put',
          contentType: req.mimeType || 'application/octet-stream',
          headers: { 'Content-Range': 'bytes ' + req.start + '-' + fim + '/' + req.total },
          payload: bytes,
          muteHttpExceptions: true,
        });
        const code = r.getResponseCode();
        if (code === 308) return out_({ ok: true, done: false });
        if (code === 200 || code === 201) {
          const f = JSON.parse(r.getContentText());
          return out_({ ok: true, done: true, id: f.id, url: 'https://drive.google.com/file/d/' + f.id + '/view' });
        }
        return out_({ ok: false, erro: 'pedaço recusado: ' + code + ' ' + r.getContentText() });
      }
    }
    return out_({ ok: false, erro: 'ação desconhecida' });
  } catch (err) {
    return out_({ ok: false, erro: String(err) });
  }
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
