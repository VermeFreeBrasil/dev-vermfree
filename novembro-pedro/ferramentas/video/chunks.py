# Uso: python3 chunks.py <video> <saida_dir>  → acha falas entre silêncios e transcreve cada uma
import sys, re, subprocess, json, os
v, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
log = subprocess.run(['ffmpeg','-hide_banner','-i',v,'-af','silencedetect=noise=-33dB:d=0.35','-f','null','-'],capture_output=True,text=True).stderr
ss=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',log)]; se=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',log)]
dur=float(re.search(r'Duration: (\d+):(\d+):([\d.]+)',log).group(3))+60*int(re.search(r'Duration: (\d+):(\d+)',log).group(2))
falas=[]; prev=0.0
for a,b in zip(ss,se+[dur]):
    if a-prev>0.4: falas.append((prev,a))
    prev=b
if dur-prev>0.4: falas.append((prev,dur))
T='/tmp/claude-0/-home-user-dev-vermfree/83365de7-8ce8-545d-a122-722ac23fa884/scratchpad/tools/transcrever_onnx.py'
for a,b in falas:
    w=f'{out}/c_{a:.2f}.wav'
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(max(0,a-0.1)),'-to',str(b+0.1),'-i',v,'-ac','1','-ar','16000',w])
    subprocess.run(['python3',T,w,w+'.json','pt'],capture_output=True)
    try: t=json.load(open(w+'.json'))['text'].strip()
    except Exception: t='?'
    print(f'{a:6.2f}-{b:6.2f} {t}', flush=True)
