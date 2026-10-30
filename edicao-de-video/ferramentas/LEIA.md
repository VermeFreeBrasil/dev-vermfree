# Ferramentas de edição (sem pip/npm)

Montadas em 30/10/2026, quando o ambiente bloqueou pip e npm (sem faster-whisper nem Remotion).

- `transcrever_onnx.py <video> <saida.json> [pt]`: Whisper small em ONNX (onnxruntime já instalado), com timestamps por frase. Modelo baixado de huggingface.co/onnx-community/whisper-small (encoder_model_quantized.onnx, decoder_model_quantized.onnx, tokenizer.json) na mesma pasta do script. ~25 s por vídeo de 30 s.
- `editar-ugc.js <plano.json>`: renderiza no Chromium (Playwright) os overlays quadro a quadro com fundo transparente (gancho, legendas em blocos de até 4 palavras com mola, selo 11.11, CTA final) e compõe no ffmpeg com zoom alternado por frase, 1080×1920, 30 fps, H.264 CRF 18, áudio normalizado (-14 LUFS). ~3 min por vídeo.
- `planos/`: os planos dos 3 UGC de captação do 11/11 (texto corrigido, tempos, destaques).

O caminho do logo no script aponta para a pasta de rascunho da sessão (`../art/logo-shopify-medium.png`); ajuste se rodar em outro lugar.
