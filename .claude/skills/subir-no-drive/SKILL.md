---
name: subir-no-drive
description: Sobe arquivos (PNG, JPG, MP4, ZIP, PDF) direto numa pasta do Google Drive da VermeFree e devolve o link de cada um. Use sempre que o Pedro pedir para subir, enviar ou colocar criativos, vídeos ou entregas no Drive, ou quando uma tarefa terminar com "subir na pasta".
---

# Subir arquivos no Google Drive da VermeFree

O conector do Google Drive não sobe imagens nem vídeos. Para isso existe um receptor no Google Apps Script, publicado como app da web pela conta **operacional.vermfree@gmail.com** (03/11/2026, versão 1). Ele recebe o arquivo em base64 e grava na pasta indicada.

## Pré-requisitos (uma vez por ambiente)
1. Variável de ambiente **`DRIVE_UPLOAD_TOKEN`** no ambiente da nuvem (menu do ambiente no título da sessão → Editar → variáveis de ambiente). O valor é o `TOKEN` do código do Apps Script (o Pedro tem). **Nunca** salvar o token no repositório nem pedir para colar no chat.
2. Rede liberada para `script.google.com` e `script.googleusercontent.com`.
3. A URL do receptor já é o padrão do script. Se o Pedro publicar uma implantação nova com outra URL, trocar no script ou usar `DRIVE_UPLOAD_URL`.

## Como usar
```bash
S=.claude/skills/subir-no-drive/scripts/sobe-drive.sh
bash $S --check                              # {"ok":true,"conta":"operacional.vermfree@gmail.com"}
bash $S --folder <ID_DA_PASTA> arq1.png arq2.png
```
Cada arquivo devolve `{"ok":true,"id":...,"url":...}`. Mande ao Pedro o link da pasta (https://drive.google.com/drive/folders/<ID>) e registre no diário.

- Sem o token: o script avisa. Pedir ao Pedro para criar `DRIVE_UPLOAD_TOKEN` nas variáveis do ambiente e abrir um chat novo.
- Bloqueio de rede (403): pedir para liberar os dois domínios acima.
- **Acesso à pasta:** o receptor roda como operacional.vermfree@gmail.com, que NÃO é membro do Drive compartilhado. Só grava em pastas compartilhadas com essa conta (ou abertas por link, como Criativos/Imagens). Pasta nova: o Pedro compartilha com operacional.vermfree@gmail.com como Editor (ou adiciona a conta ao Drive compartilhado). Sem isso o erro é "No item with the given ID could be found".
- O receptor **não cria pastas**. Sem a pasta certa, pedir ao Pedro para criar e mandar o link.
- Limite prático: ~35 MB por arquivo (base64 + limite do Apps Script). Vídeo maior: comprimir antes.
- Antes de subir, ter o ok do Pedro (regra: nada publicado sem o ok dele).

## Pastas conhecidas (Drive compartilhado da VermeFree)
| Pasta | ID |
|---|---|
| Criativos (raiz das peças de novembro) | 1d-qoIHcZ0xwYm7C2uGw_GyWqVsec90_j |
| Criativos / Imagens (estáticos de captação 11/11) | 1n0zRRrDGh4lmgOmqbTB4p0aCBOJt8LMB |
| Criativos / Videos | 17HxVB5GrP6E6Mr23LHgYTTHwZbcJYBZ5 |
| Criativos / CAPTAÇÃO 11/11 (criada em 02/11) | 1a1iRdWCb7fhsYp5oKbIeNH4i2iMnLifW |
| Criativos / Universais Black (criada em 03/11) | 1GiA-VHBNA-Dnm9aknrmVZwWEp7IQ0iIU |

Outras pastas: conector do Drive, `search_files` com `parentId = '<ID>'`. Só pastas da VermeFree.

## Código do receptor
`novembro-pedro/ferramentas/drive/receptor-apps-script.gs` (no repositório o token fica como placeholder). Para republicar: Apps Script → Implantar → Nova implantação → App da Web, executar como "Eu", acesso "Qualquer pessoa".
