#!/usr/bin/env python3
"""Transcrição com Whisper (ONNX, onnxruntime) sem pip: log-mel em numpy + decodificação gulosa com timestamps.
Uso: transcrever_onnx.py <video> <saida.json> [idioma=pt]
Saída: {"segments":[{"start":s,"end":s,"text":...}], "text": ...}
"""
import json, subprocess, sys, os
import numpy as np
import onnxruntime as ort

D = os.path.dirname(os.path.abspath(__file__))
SR, NFFT, HOP, NMEL, CHUNK = 16000, 400, 160, 80, 30


def load_audio(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768.0


def mel_filters():
    # librosa.filters.mel(sr=16000, n_fft=400, n_mels=80) — escala Slaney, norm='slaney'
    def hz_to_mel(f):
        f = np.asanyarray(f, dtype=np.float64); m = f / (200.0 / 3)
        return np.where(f >= 1000, 15.0 + np.log(np.maximum(f, 1e-10) / 1000) / (np.log(6.4) / 27), m)
    def mel_to_hz(m):
        m = np.asanyarray(m, dtype=np.float64); f = m * (200.0 / 3)
        return np.where(m >= 15.0, 1000 * np.exp((np.log(6.4) / 27) * (m - 15.0)), f)
    fftfreqs = np.linspace(0, SR / 2, NFFT // 2 + 1)
    mpts = mel_to_hz(np.linspace(hz_to_mel(0), hz_to_mel(SR / 2), NMEL + 2))
    fdiff = np.diff(mpts); ramps = mpts[:, None] - fftfreqs[None, :]
    w = np.maximum(0, np.minimum(-ramps[:-2] / fdiff[:-1, None], ramps[2:] / fdiff[1:, None]))
    w *= (2.0 / (mpts[2:NMEL + 2] - mpts[:NMEL]))[:, None]
    return w.astype(np.float32)


def log_mel(audio):
    n = SR * CHUNK
    audio = np.pad(audio[:n], (0, max(0, n - len(audio))))
    padded = np.pad(audio, (NFFT // 2, NFFT // 2), mode='reflect')
    win = np.hanning(NFFT + 1)[:-1].astype(np.float32)
    frames = np.lib.stride_tricks.sliding_window_view(padded, NFFT)[::HOP] * win
    mag = np.abs(np.fft.rfft(frames, axis=1)) ** 2
    mag = mag[:-1]  # 3000 frames
    mel = mel_filters() @ mag.T
    lg = np.log10(np.maximum(mel, 1e-10))
    lg = np.maximum(lg, lg.max() - 8.0)
    return ((lg + 4.0) / 4.0).astype(np.float32)[None]


def main():
    video, out = sys.argv[1], sys.argv[2]
    lang = sys.argv[3] if len(sys.argv) > 3 else 'pt'
    tok = json.load(open(os.path.join(D, 'tokenizer.json')))
    special = {t['content']: t['id'] for t in tok['added_tokens']}
    vocab_inv = {v: k for k, v in tok['model']['vocab'].items()}
    for t in tok['added_tokens']: vocab_inv[t['id']] = t['content']
    byte_dec = {}
    bs = list(range(ord('!'), ord('~') + 1)) + list(range(ord('¡'), ord('¬') + 1)) + list(range(ord('®'), ord('ÿ') + 1))
    cs = bs[:]; n = 0
    for b in range(256):
        if b not in bs: bs.append(b); cs.append(256 + n); n += 1
    byte_dec = {chr(c): b for b, c in zip(bs, cs)}
    def decode(ids):
        s = ''.join(vocab_inv[i] for i in ids)
        return bytearray(byte_dec[c] for c in s).decode('utf-8', errors='replace')

    sot, eot = special['<|startoftranscript|>'], special['<|endoftext|>']
    lang_id, transcribe = special[f'<|{lang}|>'], special['<|transcribe|>']
    ts0 = special['<|0.00|>']
    so = ort.SessionOptions(); so.intra_op_num_threads = os.cpu_count() or 4
    enc = ort.InferenceSession(os.path.join(D, 'encoder_model_quantized.onnx'), so)
    dec = ort.InferenceSession(os.path.join(D, 'decoder_model_quantized.onnx'), so)
    dec_inputs = [i.name for i in dec.get_inputs()]

    audio = load_audio(video)
    segments = []
    offset = 0.0
    while offset < len(audio) / SR - 0.3:
        feats = log_mel(audio[int(offset * SR):])
        hidden = enc.run(None, {enc.get_inputs()[0].name: feats})[0]
        ids = [sot, lang_id, transcribe]
        last_ts = None; cur = []; seg_start = None; window_end = offset
        for _ in range(220):
            feed = {'input_ids': np.array([ids], np.int64), 'encoder_hidden_states': hidden}
            feed = {k: v for k, v in feed.items() if k in dec_inputs}
            logits = dec.run(None, feed)[0][0, -1]
            logits[special.get('<|notimestamps|>', -1)] = -np.inf
            # regras de timestamp: depois de texto, permitir ts >= último; ts em pares
            if last_ts is not None and cur == [] and ids[-1] >= ts0 and ids[-2] >= ts0:
                logits[ts0:] = np.where(np.arange(ts0, len(logits)) >= ids[-1], logits[ts0:], -np.inf)
            if last_ts is not None:
                logits[ts0:last_ts] = -np.inf
            nxt = int(np.argmax(logits))
            if nxt == eot: break
            ids.append(nxt)
            if nxt >= ts0:
                t = (nxt - ts0) * 0.02
                if seg_start is None:
                    seg_start = t
                elif cur:
                    segments.append({'start': round(offset + seg_start, 2), 'end': round(offset + t, 2), 'text': decode(cur).strip()})
                    cur = []; seg_start = None; window_end = offset + t
                else:
                    seg_start = t
                last_ts = nxt
            else:
                cur.append(nxt)
        if cur:
            segments.append({'start': round(offset + (seg_start or 0), 2), 'end': round(min(offset + CHUNK, len(audio) / SR), 2), 'text': decode(cur).strip()})
            window_end = offset + CHUNK
        if window_end <= offset + 0.5: window_end = offset + CHUNK
        offset = window_end
    json.dump({'segments': segments, 'text': ' '.join(s['text'] for s in segments)}, open(out, 'w'), ensure_ascii=False, indent=1)
    print(json.dumps(segments, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
