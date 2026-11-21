#!/bin/bash
# comprime para caber no receptor do Drive (~35 MB): alvo 32 MB no total
i="$1"; o="$2"; d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$i")
vb=$(python3 -c "print(min(6000, int((32*8*1024/$d) - 160)))")
ffmpeg -v error -y -i "$i" -c:v libx264 -preset slow -b:v ${vb}k -maxrate $((vb*3/2))k -bufsize $((vb*2))k -pass 1 -passlogfile /tmp/claude-0/-home-user-dev-vermfree/83365de7-8ce8-545d-a122-722ac23fa884/scratchpad/vid/t/p-$(basename "$o") -an -f mp4 /dev/null && \
ffmpeg -v error -y -i "$i" -c:v libx264 -preset slow -b:v ${vb}k -maxrate $((vb*3/2))k -bufsize $((vb*2))k -pass 2 -passlogfile /tmp/claude-0/-home-user-dev-vermfree/83365de7-8ce8-545d-a122-722ac23fa884/scratchpad/vid/t/p-$(basename "$o") -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$o"
echo "$o $(du -m "$o" | cut -f1)MB ${vb}k"
