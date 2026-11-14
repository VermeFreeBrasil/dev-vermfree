# grade do rosto no começo e fim de cada trecho: colunas = trechos, linhas = de, de+.12, de+.25, ate-.25, ate-.12, ate+.05
import json,subprocess,sys
from PIL import Image, ImageDraw
P=json.load(open(sys.argv[1])); crop=sys.argv[2] if len(sys.argv)>2 else '1300:1000:430:650'
n=len(P['segs']); c=Image.new('RGB',(n*140,6*112+20),'white'); d=ImageDraw.Draw(c)
for k,s in enumerate(P['segs']):
    d.text((k*140+60,2),str(k),fill='black')
    for j,t in enumerate([s['de'],s['de']+.12,s['de']+.25,s['ate']-.25,s['ate']-.12,s['ate']+.05]):
        subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{max(0,t):.2f}','-i',P['entrada'],'-frames:v','1','-vf',f'crop={crop},scale=140:108','t/y.jpg'])
        c.paste(Image.open('t/y.jpg'),(k*140,20+j*112))
c.save(sys.argv[3] if len(sys.argv)>3 else 't/bordas.jpg',quality=88)
