export class SoundSystem {
  constructor() {
    this.ctx = null;
    this.ambientTimer = null;
  }

  ensure() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  beep(freq = 440, dur = 0.08, type = 'sine', gain = 0.03) {
    this.ensure();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  }

  click() { this.beep(700, 0.05, 'triangle', 0.02); }
  stitch() { this.beep(260, 0.07, 'square', 0.03); }

  startAmbient() {
    if (this.ambientTimer) return;
    this.ambientTimer = setInterval(() => {
      this.beep(380 + Math.random() * 220, 0.12, 'sine', 0.01);
    }, 2200);
  }

  stopAmbient() {
    clearInterval(this.ambientTimer);
    this.ambientTimer = null;
  }
}
