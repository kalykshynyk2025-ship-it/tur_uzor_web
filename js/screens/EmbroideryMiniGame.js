export function EmbroideryMiniGame({ onComplete, onBack, sound }) {
  const el = document.createElement('section');
  el.className = 'screen';
  el.innerHTML = `
    <div class="topbar">
      <button id="backBtn">← Назад</button>
      <h2>Мини-игра: Вышивка крестиком</h2>
      <div>Кликай по точкам по порядку</div>
    </div>
    <canvas class="embroidery-canvas" id="emb"></canvas>
  `;
  el.querySelector('#backBtn').onclick = onBack;

  const canvas = el.querySelector('#emb');
  const ctx = canvas.getContext('2d');
  const points = [
    { x: 120, y: 120 }, { x: 260, y: 120 }, { x: 260, y: 260 }, { x: 120, y: 260 }
  ];
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
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#bc3c2f';
    for (let i = 1; i < step; i++) {
      ctx.beginPath();
      ctx.moveTo(points[i - 1].x, points[i - 1].y);
      ctx.lineTo(points[i].x, points[i].y);
      ctx.stroke();
    }
    if (step === points.length) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      ctx.lineTo(points[2].x, points[2].y);
      ctx.moveTo(points[1].x, points[1].y);
      ctx.lineTo(points[3].x, points[3].y);
      ctx.stroke();
    }
    points.forEach((p, i) => {
      ctx.fillStyle = i < step ? '#2f8f5a' : '#345e46';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
      ctx.fill();
    });

    // Needle
    if (step < points.length) {
      const p = points[step];
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
    const p = points[step];
    if (!p) return;
    if (Math.hypot(x - p.x, y - p.y) < 24) {
      step += 1;
      sound.stitch();
      draw();
      if (step === points.length) {
        setTimeout(onComplete, 450);
      }
    }
  };

  canvas.addEventListener('pointerdown', clickHandler);
  return el;
}
