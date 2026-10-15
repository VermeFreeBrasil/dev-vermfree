#!/usr/bin/env bash
# Sobe arquivos para uma pasta do Google Drive pela API (sem o limite de tamanho do conector).
# Uso: subir-drive.sh <id-ou-link-da-pasta> <arquivo1> [<arquivo2> ...]
#
# Precisa de três segredos no ambiente (Editar ambiente → Variáveis de ambiente):
#   GDRIVE_CLIENT_ID, GDRIVE_CLIENT_SECRET, GDRIVE_REFRESH_TOKEN
# (gere o refresh token uma vez com autorizar-drive.py; veja edicao-de-video/COMO-USAR.md)
# e da rede liberando oauth2.googleapis.com e www.googleapis.com.
#
# Arquivos com o mesmo nome já presentes na pasta são pulados (use SOBRESCREVER=1 para enviar de novo).
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Uso: $0 <id-ou-link-da-pasta> <arquivo> [...]" >&2; exit 2
fi
for v in GDRIVE_CLIENT_ID GDRIVE_CLIENT_SECRET GDRIVE_REFRESH_TOKEN; do
  if [ -z "${!v:-}" ]; then
    echo "Falta a variável $v. Configure os segredos do ambiente (COMO-USAR.md, seção Drive)." >&2; exit 3
  fi
done

pasta="$1"; shift
pasta=$(printf '%s' "$pasta" | sed -E 's#.*/folders/([^/?]+).*#\1#; s#.*[?&]id=([^&]+).*#\1#')

json() { python3 -I -c "import json,sys; d=json.load(sys.stdin); print(d.get(sys.argv[1], ''))" "$1"; }

resp=$(curl -sS https://oauth2.googleapis.com/token \
  -d client_id="$GDRIVE_CLIENT_ID" -d client_secret="$GDRIVE_CLIENT_SECRET" \
  -d refresh_token="$GDRIVE_REFRESH_TOKEN" -d grant_type=refresh_token) || {
  echo "Não consegui falar com oauth2.googleapis.com (rede liberada?)." >&2; exit 4; }
token=$(printf '%s' "$resp" | json access_token)
if [ -z "$token" ]; then
  echo "Falha ao obter token: $(printf '%s' "$resp" | json error_description) $(printf '%s' "$resp" | json error)" >&2
  echo "Se o erro for invalid_grant, gere um novo refresh token com autorizar-drive.py." >&2; exit 5
fi
auth="Authorization: Bearer $token"

falhas=0
for arq in "$@"; do
  if [ ! -s "$arq" ]; then echo "FALHOU: $arq não existe ou está vazio" >&2; falhas=$((falhas+1)); continue; fi
  nome=$(basename "$arq")
  if [ "${SOBRESCREVER:-0}" != "1" ]; then
    q=$(python3 -I -c "import sys,urllib.parse as u; n=sys.argv[1].replace(chr(92),chr(92)*2).replace(chr(39),chr(92)+chr(39)); print(u.quote(\"name = '%s' and '%s' in parents and trashed = false\" % (n, sys.argv[2])))" "$nome" "$pasta")
    existe=$(curl -sS -H "$auth" "https://www.googleapis.com/drive/v3/files?q=$q&fields=files(id)&supportsAllDrives=true&includeItemsFromAllDrives=true" \
      | python3 -I -c "import json,sys; print(len(json.load(sys.stdin).get('files', [])))")
    if [ "$existe" != "0" ]; then echo "já existe na pasta, pulando: $nome"; continue; fi
  fi
  tipo=$(file -b --mime-type "$arq" 2>/dev/null || echo application/octet-stream)
  tam=$(stat -c %s "$arq")
  meta=$(python3 -I -c "import json,sys; print(json.dumps({'name': sys.argv[1], 'parents': [sys.argv[2]]}))" "$nome" "$pasta")
  sessao=$(curl -sS -D - -o /dev/null -X POST \
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true" \
    -H "$auth" -H "Content-Type: application/json; charset=UTF-8" \
    -H "X-Upload-Content-Type: $tipo" -H "X-Upload-Content-Length: $tam" -d "$meta" \
    | tr -d '\r' | sed -n 's/^[Ll]ocation: //p')
  if [ -z "$sessao" ]; then echo "FALHOU: $nome (não abriu sessão de upload; a pasta existe e você tem acesso?)" >&2; falhas=$((falhas+1)); continue; fi
  ok=0
  for tentativa in 1 2 3 4; do
    out=$(curl -sS -X PUT "$sessao" -H "Content-Type: $tipo" --upload-file "$arq" || true)
    id=$(printf '%s' "$out" | json id 2>/dev/null || true)
    if [ -n "$id" ]; then ok=1; break; fi
    sleep $((2 ** tentativa))
  done
  if [ "$ok" = 1 ]; then
    echo "ok: $nome ($(du -h "$arq" | cut -f1)) → https://drive.google.com/file/d/$id/view"
  else
    echo "FALHOU: $nome ($out)" >&2; falhas=$((falhas+1))
  fi
done
[ "$falhas" = 0 ] || { echo "$falhas arquivo(s) falharam." >&2; exit 1; }
