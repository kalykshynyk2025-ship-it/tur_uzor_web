import { EMBROIDERY_PATTERNS } from '../utils/data.js';

export function EmbroideryMiniGame({ onComplete, onBack, sound }) {
  const el = document.createElement('section');
  el.className = 'screen';
  el.innerHTML = `
    <div class="topbar">
      <button id="backBtn">← Назад</button>
      <h2>Мини-игра: Вышивка крестиком</h2>
      <div id="patternName">Кликай по точкам по порядку</div>
    </div>
    <canvas class="embroidery-canvas" id="emb"></canvas>
  `;
  el.querySelector('#backBtn').onclick = onBack;

  const canvas = el.querySelector('#emb');
  const ctx = canvas.getContext('2d');
  const patterns = EMBROIDERY_PATTERNS;
  let patternIndex = 0;
  let points = patterns[0].points;
  let order = patterns[0].order;
  let step = 0;

  function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    draw();
  }
  window.addEventListener('resize', resize);
  // В момент создания экран ещё не вставлен в DOM, поэтому clientWidth/clientHeight
  // могут быть нулевыми. Откладываем первый resize до следующего кадра.
  requestAnimationFrame(resize);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    el.querySelector('#patternName').textContent =
      `Орнамент: ${patterns[patternIndex].name} — стежок ${Math.min(step + 1, order.length)}/${order.length}`;
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#bc3c2f';
    for (let i = 1; i < step; i++) {
      const prev = points[order[i - 1]];
      const curr = points[order[i]];
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(curr.x, curr.y);
      ctx.stroke();
    }
    points.forEach((p, i) => {
      const isVisited = order.slice(0, step + 1).includes(i);
      ctx.fillStyle = isVisited ? '#2f8f5a' : '#345e46';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
      ctx.fill();
    });

    // Needle
    if (step < order.length) {
      const p = points[order[step]];
      ctx.fillStyle = '#444';
      ctx.fillRect(p.x + 16, p.y - 18, 24, 6);
      ctx.fillStyle = '#b0b0b0';
      ctx.fillRect(p.x + 40, p.y - 16, 16, 2);
    }
  }

  const clickHandler = (e) => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const p = points[order[step]];
    if (!p) return;
    if (Math.hypot(x - p.x, y - p.y) < 22) {
      step += 1;
      sound.stitch();
      draw();
      if (step === order.length) {
        patternIndex += 1;
        if (patternIndex >= patterns.length) {
          setTimeout(onComplete, 450);
          return;
        }
        points = patterns[patternIndex].points;
        order = patterns[patternIndex].order;
        step = 0;
        setTimeout(draw, 250);
      }
    }
  };

  canvas.addEventListener('pointerdown', clickHandler);
  return el;
}
