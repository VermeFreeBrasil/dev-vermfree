import sys,re,subprocess
w,a,b=sys.argv[1],float(sys.argv[2]),float(sys.argv[3])
log=subprocess.run(['ffmpeg','-hide_banner','-ss',str(a),'-to',str(b),'-i',w,'-af','silencedetect=noise=-33dB:d=0.12','-f','null','-'],capture_output=True,text=True).stderr
ss=[float(x)+a for x in re.findall(r'silence_start: ([\d.]+)',log)]; se=[float(x)+a for x in re.findall(r'silence_end: ([\d.]+)',log)]
print(' '.join(f'[{x:.2f}-{y:.2f}]' for x,y in zip(ss,se)))
