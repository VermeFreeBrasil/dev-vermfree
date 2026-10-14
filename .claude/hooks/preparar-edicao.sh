#!/usr/bin/env bash
# SessionStart: prepara as ferramentas de edição de vídeo e avisa se a rede do
# ambiente ainda bloqueia algum domínio necessário. Só roda nas sessões na nuvem.
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0

python3 -c "import faster_whisper" 2>/dev/null || timeout 120 pip install -q faster-whisper >/dev/null 2>&1

dominios=(drive.google.com drive.usercontent.google.com huggingface.co cdn-lfs.huggingface.co
  cdn-lfs-us-1.hf.co cas-bridge.xethub.hf.co cas-server.xethub.hf.co us.aws.cdn.hf.co)
tmp=$(mktemp -d)
for d in "${dominios[@]}"; do
  ( code=$(curl -s -o /dev/null -w "%{http_code}" -m 6 "https://$d" 2>/dev/null || true)
    [ "$code" = "000" ] && echo "$d" > "$tmp/$d" ) &
done
wait
bloqueados=$(cat "$tmp"/* 2>/dev/null | tr '\n' ' ')
rm -rf "$tmp"

python3 -c "import faster_whisper" 2>/dev/null && w="ok" || w="NAO instalado"
echo "[edicao-de-video] faster-whisper: $w"
if [ -n "$bloqueados" ]; then
  echo "[edicao-de-video] Rede BLOQUEIA: $bloqueados"
  echo "[edicao-de-video] Se o usuario for editar video, peca para liberar esses dominios (ver edicao-de-video/COMO-USAR.md)."
else
  echo "[edicao-de-video] Rede ok para Drive e transcricao."
fi
exit 0
