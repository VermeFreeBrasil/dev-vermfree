#!/bin/bash
# checa.sh <mp4> <tag> : duração, folha de contato e transcrição do resultado
F=$1; T=$2; D=/tmp/claude-0/-home-user-dev-vermfree/83365de7-8ce8-545d-a122-722ac23fa884/scratchpad/bf18
ffprobe -v error -show_entries format=duration -of csv=p=0 $F
ffmpeg -v error -y -i $F -vf "fps=1/1.5,scale=150:-1,tile=10x3" -frames:v 1 $D/w/folha-$T.jpg
ffmpeg -v error -y -i $F -ac 1 -ar 16000 $D/w/o-$T.wav && python3 $D/../tools/transcrever_onnx.py $D/w/o-$T.wav $D/w/o-$T.json pt >/dev/null 2>&1
python3 -c "import json;print(json.load(open('$D/w/o-$T.json'))['text'])"
ffmpeg -v error -y -i $F -c:v libx264 -crf 26 -preset fast -c:a aac -b:a 128k -movflags +faststart $D/w/previa-$T.mp4
