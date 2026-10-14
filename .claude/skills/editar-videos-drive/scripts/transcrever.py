"""Transcreve a fala com faster-whisper e salva JSON com tempos por palavra.

Uso: python3 transcrever.py <video_ou_audio> <saida.json> [modelo=small] [idioma=pt]
Requer: pip install faster-whisper, e rede liberando huggingface.co,
cas-server.xethub.hf.co e us.aws.cdn.hf.co na primeira execução (download do modelo).
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

from faster_whisper import WhisperModel

entrada, saida = Path(sys.argv[1]), Path(sys.argv[2])
modelo = sys.argv[3] if len(sys.argv) > 3 else "small"
idioma = sys.argv[4] if len(sys.argv) > 4 else "pt"

with tempfile.TemporaryDirectory() as tmp:
    wav = Path(tmp) / "audio.wav"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(entrada), "-vn",
                    "-ac", "1", "-ar", "16000", str(wav)], check=True)
    m = WhisperModel(modelo, device="cpu", compute_type="int8")
    segs, _ = m.transcribe(str(wav), language=idioma, word_timestamps=True, vad_filter=True)
    out = []
    for s in segs:
        out.append({"start": round(s.start, 3), "end": round(s.end, 3), "text": s.text.strip(),
                    "words": [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3),
                               "p": round(w.probability, 3)} for w in s.words]})
        print(f"[{s.start:6.2f}-{s.end:6.2f}] {s.text.strip()}")

saida.parent.mkdir(parents=True, exist_ok=True)
saida.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
