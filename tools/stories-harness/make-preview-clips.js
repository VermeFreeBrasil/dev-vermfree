// Clipes curtos para o preview publicado, com o nome do vídeo real desenhado
// no quadro. Mesmo pipeline do harness: quadros JPEG pelo Chromium, remux
// para VP8/WebM pelo ffmpeg enxuto do Playwright.
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('playwright');

const FFMPEG = '/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux';
const W = 270, H = 480, FPS = 20;

const CLIPES = [
  { nome: 'c1', rotulo: 'DR-SINAIS', seg: 3.0 },
  { nome: 'c2', rotulo: 'DR-ELIMINA', seg: 3.5 },
  { nome: 'c3', rotulo: 'JULIANA-UNBOX', seg: 2.5 },
  { nome: 'c4', rotulo: 'DR-12SINAIS', seg: 3.0 },
  { nome: 'c5', rotulo: 'DR-PET', seg: 2.5 }
];

function encode(frames, out) {
  return new Promise((res, rej) => {
    const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error',
      '-f', 'image2pipe', '-vcodec', 'mjpeg', '-framerate', String(FPS), '-i', 'file:' + frames,
      '-c:v', 'libvpx', '-b:v', '260k', '-pix_fmt', 'yuv420p', out]);
    let e = ''; ff.stderr.on('data', (d) => { e += d; });
    ff.on('close', (c) => (c === 0 ? res() : rej(new Error(e))));
  });
}

(async () => {
  const dir = path.join(__dirname, 'preview-media');
  fs.mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage();
  await page.setContent('<canvas id="c"></canvas>');

  for (const c of CLIPES) {
    const total = Math.round(c.seg * FPS);
    const quadros = await page.evaluate(({ W, H, total, rotulo }) => {
      const cv = document.getElementById('c');
      cv.width = W; cv.height = H;
      const x = cv.getContext('2d');
      const saida = [];
      for (let f = 0; f < total; f++) {
        const k = f / total;
        // Abre quase preto e clareia: é assim que os vídeos reais entram.
        const g = x.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, 'rgb(' + Math.round(20 + 40 * k) + ',' + Math.round(30 + 70 * k) + ',' + Math.round(18 + 30 * k) + ')');
        g.addColorStop(1, 'rgb(' + Math.round(10 + 20 * k) + ',' + Math.round(45 + 110 * k) + ',' + Math.round(20 + 40 * k) + ')');
        x.fillStyle = g; x.fillRect(0, 0, W, H);
        x.globalAlpha = Math.min(1, k * 3);
        x.fillStyle = '#fff';
        x.font = 'bold 19px system-ui, sans-serif';
        x.fillText(rotulo, 18, H / 2 - 8);
        x.globalAlpha = Math.min(0.75, k * 2);
        x.font = '13px system-ui, sans-serif';
        x.fillText('clipe de teste', 18, H / 2 + 16);
        x.fillText(Math.floor(f / 20) + 's', 18, H - 26);
        x.globalAlpha = 1;
        saida.push(cv.toDataURL('image/jpeg', 0.62).split(',')[1]);
      }
      return saida;
    }, { W, H, total, rotulo: c.rotulo });

    const bin = path.join(dir, c.nome + '.frames');
    fs.writeFileSync(bin, Buffer.concat(quadros.map((b) => Buffer.from(b, 'base64'))));
    await encode(bin, path.join(dir, c.nome + '.webm'));
    fs.unlinkSync(bin);
  }
  await browser.close();
  console.log(fs.readdirSync(dir).join(' '));
  let total = 0;
  fs.readdirSync(dir).forEach((f) => { total += fs.statSync(path.join(dir, f)).size; });
  console.log('total ' + Math.round(total / 1024) + ' KB');
})().catch((e) => { console.error(e.message); process.exit(1); });
