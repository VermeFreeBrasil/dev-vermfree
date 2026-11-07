#!/usr/bin/env bash
# Sobe arquivos para o Google Drive da VermeFree pelo receptor do Apps Script.
# Uso: sobe-drive.sh --check
#      sobe-drive.sh --folder <ID_DA_PASTA> arq1.png arq2.mp4 ...
# Lê DRIVE_UPLOAD_TOKEN (obrigatório, variável do ambiente) e DRIVE_UPLOAD_URL (opcional).
set -euo pipefail
DRIVE_UPLOAD_URL="${DRIVE_UPLOAD_URL:-https://script.google.com/macros/s/AKfycbyJTVLyEnXPDsxw885Ab5uvcw82M9mxHUq8NRwwX_Ke5y6Ml8rU_vWCfTFHbgGi5RPvwA/exec}"
if [ -z "${DRIVE_UPLOAD_TOKEN:-}" ]; then
  echo "ERRO: falta a variável DRIVE_UPLOAD_TOKEN no ambiente (configurações do ambiente → variáveis de ambiente)." >&2; exit 2
fi
if [ "${1:-}" = "--check" ]; then curl -sSL "$DRIVE_UPLOAD_URL?token=$DRIVE_UPLOAD_TOKEN"; echo; exit 0; fi
[ "${1:-}" = "--folder" ] || { echo "uso: $0 --check | --folder ID arquivos..."; exit 1; }
PASTA="$2"; shift 2
for f in "$@"; do
  case "$f" in *.png) M=image/png;; *.jpg|*.jpeg) M=image/jpeg;; *.mp4) M=video/mp4;; *.mov) M=video/quicktime;; *.zip) M=application/zip;; *.pdf) M=application/pdf;; *) M=application/octet-stream;; esac
  N=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$(basename "$f")")
  T=$(mktemp); base64 -w0 "$f" > "$T"
  # Sem -X POST: o Apps Script responde 302 e o curl segue em GET.
  echo "$(basename "$f"): $(curl -sSL "$DRIVE_UPLOAD_URL?token=$DRIVE_UPLOAD_TOKEN&name=$N&folder=$PASTA&mime=$M" -H 'Content-Type: text/plain' --data-binary @"$T")"
  rm -f "$T"
done
