#!/usr/bin/env bash
# Sobe arquivos para o Drive da VermeFree pelo receptor do Apps Script.
# Uso: DRIVE_UPLOAD_URL=... DRIVE_UPLOAD_TOKEN=... ./sobe-drive.sh --check
#      DRIVE_UPLOAD_URL=... DRIVE_UPLOAD_TOKEN=... ./sobe-drive.sh --folder <ID_DA_PASTA> arq1.png arq2.png ...
set -euo pipefail
: "${DRIVE_UPLOAD_URL:?defina DRIVE_UPLOAD_URL}" "${DRIVE_UPLOAD_TOKEN:?defina DRIVE_UPLOAD_TOKEN}"
if [ "${1:-}" = "--check" ]; then curl -sSL "$DRIVE_UPLOAD_URL?token=$DRIVE_UPLOAD_TOKEN"; echo; exit 0; fi
[ "${1:-}" = "--folder" ] || { echo "uso: $0 --check | --folder ID arquivos..."; exit 1; }
PASTA="$2"; shift 2
for f in "$@"; do
  case "$f" in *.png) M=image/png;; *.jpg|*.jpeg) M=image/jpeg;; *.mp4) M=video/mp4;; *.zip) M=application/zip;; *) M=application/octet-stream;; esac
  N=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$(basename "$f")")
  T=$(mktemp); base64 -w0 "$f" > "$T"
  # Sem -X POST: o Apps Script responde 302 e o curl segue em GET.
  echo "$(basename "$f"): $(curl -sSL "$DRIVE_UPLOAD_URL?token=$DRIVE_UPLOAD_TOKEN&name=$N&folder=$PASTA&mime=$M" -H 'Content-Type: text/plain' --data-binary @"$T")"
  rm -f "$T"
done
