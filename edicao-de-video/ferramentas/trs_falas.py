#!/usr/bin/env python3
"""Transcrição por fala: corta nos silêncios (ffmpeg silencedetect) e transcreve cada trecho (Whisper ONNX, sem timestamps).
Uso: trs_falas.py <midia> <saida.json>"""
import json, os, re, subprocess, sys
import numpy as np, onnxruntime as ort
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from transcrever_onnx import load_audio, log_mel, SR, D
src, out = sys.argv[1], sys.argv[2]
log = subprocess.run(['ffmpeg','-hide_banner','-i',src,'-af','silencedetect=noise=-35dB:d=0.3','-f','null','-'],capture_output=True,text=True).stderr
ss=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',log)]; se=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',log)]
audio=load_audio(src); dur=len(audio)/SR
falas=[]; t=0.0
for a,b in zip(ss,se+[dur]*(len(ss)-len(se))):
    if a-t>0.25: falas.append([t,a])
    t=b
if dur-t>0.25: falas.append([t,dur])
tok=json.load(open(os.path.join(D,'tokenizer.json')))
sp={x['content']:x['id'] for x in tok['added_tokens']}
inv={v:k for k,v in tok['model']['vocab'].items()}
for x in tok['added_tokens']: inv[x['id']]=x['content']
bs=list(range(33,127))+list(range(161,173))+list(range(174,256)); cs=bs[:]; n=0
for b in range(256):
    if b not in bs: bs.append(b); cs.append(256+n); n+=1
bd={chr(c):b for b,c in zip(bs,cs)}
dec_t=lambda ids: bytearray(bd[c] for c in ''.join(inv[i] for i in ids)).decode('utf-8','replace')
so=ort.SessionOptions(); so.intra_op_num_threads=os.cpu_count() or 4
enc=ort.InferenceSession(os.path.join(D,'encoder_model_quantized.onnx'),so); dec=ort.InferenceSession(os.path.join(D,'decoder_model_quantized.onnx'),so)
din=[i.name for i in dec.get_inputs()]
res=[]
for a,b in falas:
    seg=audio[int(max(0,a-0.08)*SR):int(min(dur,b+0.08)*SR)][:SR*30]
    h=enc.run(None,{enc.get_inputs()[0].name:log_mel(seg)})[0]
    ids=[sp['<|startoftranscript|>'],sp['<|pt|>'],sp['<|transcribe|>'],sp['<|notimestamps|>']]; k=len(ids)
    for _ in range(120):
        lg=dec.run(None,{k2:v for k2,v in {'input_ids':np.array([ids],np.int64),'encoder_hidden_states':h}.items() if k2 in din})[0][0,-1]
        nx=int(np.argmax(lg))
        if nx==sp['<|endoftext|>'] or nx>=sp['<|endoftext|>']: break
        ids.append(nx)
    txt=dec_t(ids[k:]).strip()
    res.append({'ini':round(a,2),'fim':round(b,2),'texto':txt}); print(f'{a:6.2f} {b:6.2f} {txt}',flush=True)
json.dump(res,open(out,'w'),ensure_ascii=False,indent=1)
