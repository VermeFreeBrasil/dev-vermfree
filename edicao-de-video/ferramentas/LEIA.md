# Ferramentas de edição (sem pip/npm)

Montadas em 30/10/2026, quando o ambiente bloqueou pip e npm (sem faster-whisper nem Remotion).

- `transcrever_onnx.py <video> <saida.json> [pt]`: Whisper small em ONNX (onnxruntime já instalado), com timestamps por frase. Modelo baixado de huggingface.co/onnx-community/whisper-small (encoder_model_quantized.onnx, decoder_model_quantized.onnx, tokenizer.json) na mesma pasta do script. ~25 s por vídeo de 30 s.
- `editar-ugc.js <plano.json>`: renderiza no Chromium (Playwright) os overlays quadro a quadro com fundo transparente (gancho, legendas em blocos de até 4 palavras com mola, selo 11.11, CTA final) e compõe no ffmpeg com zoom alternado por frase, 1080×1920, 30 fps, H.264 CRF 18, áudio normalizado (-14 LUFS). ~3 min por vídeo.
- `planos/`: os planos dos 3 UGC de captação do 11/11 (texto corrigido, tempos, destaques).

O caminho do logo no script aponta para a pasta de rascunho da sessão (`../art/logo-shopify-medium.png`); ajuste se rodar em outro lugar.

## editar-ugc-v2.js (05/11)
- Igual ao v1, mais:
  - logo fixo no canto;
  - cenas ilustradas definidas em `plano.cenas`:
    - `cards`: até 3 fotos que entram no ritmo da fala;
    - `chips`: etiquetas que levam um risco por cima;
    - `pip`: janela grande com foto e legenda;
    - `prod`: foto de produto num fundo verde da marca, com etiqueta;
  - cartão final com o Kit Família.
- As imagens ficam em `<pasta do plano>/img/`.
- As fotos ilustrativas são geradas no Higgsfield. O cloudfront do Higgsfield é bloqueado na rede daqui, então elas passam pelos Arquivos da Shopify (fileCreate com a URL de origem; baixar de cdn.shopify.com).
- Exemplo: `planos/plano-v4-v2.json`.
