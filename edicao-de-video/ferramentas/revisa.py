import json,subprocess,sys
from PIL import Image
n=sys.argv[1]; P=json.load(open(f'planos/{n}.json')); L=json.load(open(f'planos/tmp-{n}/linha.json'))
out='planos/final/'+P['saida']; D=L['DUR']
ts=[x*D/24+D/48 for x in range(24)]
c=Image.new('RGB',(12*180,2*320))
for k,t in enumerate(ts):
    subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{t:.2f}','-i',out,'-frames:v','1','-vf','scale=180:320',f't/x{n}.jpg'])
    c.paste(Image.open(f't/x{n}.jpg'),((k%12)*180,(k//12)*320))
c.save(f't/rev-{n}.jpg',quality=85)
print(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration,size','-of','compact',out],capture_output=True,text=True).stdout)
