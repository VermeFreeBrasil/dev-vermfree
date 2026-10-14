#!/usr/bin/env bash
# Baixa arquivos do Google Drive pelo ID, direto (sem o limite de 10 MB do conector).
# Uso: baixar-drive.sh <pasta-destino> <id1>[:nome1] [<id2>[:nome2] ...]
# O arquivo precisa estar compartilhado como "qualquer pessoa com o link" ou ser acessível
# pelo link, e a rede do ambiente precisa liberar drive.usercontent.google.com.
set -euo pipefail
dest="$1"; shift
mkdir -p "$dest"
for item in "$@"; do
  id="${item%%:*}"; nome="${item#*:}"; [ "$nome" = "$item" ] && nome="$id"
  out="$dest/$nome"
  if [ -s "$out" ]; then echo "ja existe: $out"; continue; fi
  code=$(curl -sSL -o "$out" -w "%{http_code}" \
    "https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t") || code=000
  tipo=$(file -b --mime-type "$out" 2>/dev/null || echo desconhecido)
  if [ "$code" != "200" ] || [[ "$tipo" == text/html* ]]; then
    echo "FALHOU: $id (HTTP $code, $tipo). Confira o compartilhamento ou a rede." >&2
    rm -f "$out"; continue
  fi
  echo "ok: $out ($(du -h "$out" | cut -f1), $tipo)"
done
