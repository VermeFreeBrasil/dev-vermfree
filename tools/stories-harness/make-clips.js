// Gera clipes .webm de teste. O ffmpeg que vem com o Playwright e enxuto:
// so decodifica MJPEG e so codifica VP8/WebM. Entao os quadros JPEG sao
// desenhados pelo proprio Chromium, concatenados num arquivo e remuxados.
// O webm sai com duracao real no cabecalho — que e o que a barra de
// progresso precisa (um blob de MediaRecorder viria com duration Infinity).
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('playwright');

const FFMPEG = '/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux';
const W = 270;
const H = 480;
const FPS = 24;

const CLIPS = [
  { name: 'clip1', seconds: 2.0, base: [220, 40, 40] },
  { name: 'clip2', seconds: 3.0, base: [40, 200, 80] },
  { name: 'clip3', seconds: 1.5, base: [50, 90, 230] }
];

function encode(framesFile, out) {
  return new Promise((resolve, reject) => {
    const ff = spawn(FFMPEG, [
      '-y', '-loglevel', 'error',
      '-f', 'image2pipe', '-vcodec', 'mjpeg', '-framerate', String(FPS), '-i', 'file:' + framesFile,
      '-c:v', 'libvpx', '-b:v', '300k', '-pix_fmt', 'yuv420p',
      out
    ]);
    let err = '';
    ff.stderr.on('data', (d) => { err += d; });
    ff.on('close', (code) => (code === 0 ? resolve() : reject(new Error(err || 'ffmpeg ' + code))));
  });
}

(async () => {
  const dir = path.join(__dirname, 'media');
  fs.mkdirSync(dir, { recursive: true });

  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage();
  await page.setContent('<canvas id="c"></canvas>');

  for (const clip of CLIPS) {
    const total = Math.round(clip.seconds * FPS);

    const frames = await page.evaluate(({ W, H, total, base }) => {
      const c = document.getElementById('c');
      c.width = W;
      c.height = H;
      const ctx = c.getContext('2d');
      const out = [];
      for (let f = 0; f < total; f++) {
        // Comeca quase preto e clareia: e assim que os videos reais abrem
        // (fade in), e e exatamente isso que a capa da Etapa 2 vai driblar.
        const k = f / total;
        ctx.fillStyle = 'rgb(' + Math.round(base[0] * k) + ',' +
          Math.round(base[1] * k) + ',' + Math.round(base[2] * k) + ')';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText(String(f), 20, 60);
        out.push(c.toDataURL('image/jpeg', 0.7).split(',')[1]);
      }
      return out;
    }, { W, H, total, base: clip.base });

    const framesFile = path.join(dir, clip.name + '.frames');
    fs.writeFileSync(framesFile, Buffer.concat(frames.map((b) => Buffer.from(b, 'base64'))));
    await encode(framesFile, path.join(dir, clip.name + '.webm'));
    fs.unlinkSync(framesFile);
    console.log(clip.name + '.webm — ' + clip.seconds + 's');
  }

  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
