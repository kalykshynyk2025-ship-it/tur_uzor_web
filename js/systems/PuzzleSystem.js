export class PuzzleSystem {
  constructor(ornament) {
    this.ornament = ornament;
    this.placed = new Set();
  }

  get progress() {
    return this.placed.size / this.ornament.parts.length;
  }

  checkSnap(partId, point, slots, threshold = 50) {
    const slot = slots.find((s) => s.dataset.id === partId);
    if (!slot) return { ok: false };
    const r = slot.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dist = Math.hypot(point.x - cx, point.y - cy);
    if (dist <= threshold) {
      this.placed.add(partId);
      return { ok: true, x: r.left, y: r.top };
    }
    return { ok: false };
  }

  isComplete() {
    return this.placed.size === this.ornament.parts.length;
  }
}
