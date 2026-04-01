export class AnimationSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.mode = 'forest';
    this.t = 0;
    this.particles = Array.from({ length: 28 }, () => ({
      x: Math.random(), y: Math.random(), r: 1 + Math.random() * 2, v: 0.001 + Math.random() * 0.002
    }));
    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  setMode(mode) { this.mode = mode; }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  start() {
    const loop = () => {
      this.t += 0.01;
      this.draw();
      requestAnimationFrame(loop);
    };
    loop();
  }

  draw() {
    const { width: w, height: h } = this.canvas;
    const c = this.ctx;
    c.clearRect(0, 0, w, h);
    const palettes = {
      forest: ['#9dc89f', '#6da17c', '#3f7654'],
      meadow: ['#d5edb2', '#98d68b', '#6aa068'],
      izba: ['#e5d4b1', '#cba980', '#986f4f']
    };
    const [a, b, d] = palettes[this.mode] || palettes.forest;

    const grad = c.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, a);
    grad.addColorStop(1, b);
    c.fillStyle = grad;
    c.fillRect(0, 0, w, h);

    // Parallax hills / izba lines
    c.globalAlpha = 0.25;
    c.fillStyle = d;
    for (let i = 0; i < 3; i++) {
      c.beginPath();
      const y = h * (0.55 + i * 0.11);
      c.moveTo(0, y);
      for (let x = 0; x <= w; x += 40) c.lineTo(x, y + Math.sin(x / 80 + this.t * (i + 1)) * 12);
      c.lineTo(w, h);
      c.lineTo(0, h);
      c.closePath();
      c.fill();
    }
    c.globalAlpha = 1;

    // Grass sway
    c.strokeStyle = 'rgba(36,92,58,.4)';
    for (let x = 0; x < w; x += 18) {
      c.beginPath();
      const sway = Math.sin(this.t * 2 + x * 0.04) * 6;
      c.moveTo(x, h);
      c.quadraticCurveTo(x + sway, h - 30, x + sway * 0.6, h - 60);
      c.stroke();
    }

    // Light particles
    for (const p of this.particles) {
      p.y -= p.v;
      if (p.y < -0.05) p.y = 1.05;
      c.fillStyle = 'rgba(255,255,220,.45)';
      c.beginPath();
      c.arc(p.x * w, p.y * h + Math.sin(this.t + p.x * 8) * 8, p.r, 0, Math.PI * 2);
      c.fill();
    }
  }

  playEmbroideryFX(el) {
    el.animate([
      { transform: 'scale(0.8)', opacity: 0.5 },
      { transform: 'scale(1.08)', opacity: 1 },
      { transform: 'scale(1)', opacity: 1 }
    ], { duration: 320, easing: 'ease-out' });
  }
}
