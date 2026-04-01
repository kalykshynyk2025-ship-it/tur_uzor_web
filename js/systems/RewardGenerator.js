export class RewardGenerator {
  static draw(canvas, name = 'Знаток марийской вышивки') {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = 900;
    const h = canvas.height = 550;

    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#f8f3e9');
    g.addColorStop(1, '#dce9d4');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#2f6f4f';
    ctx.font = 'bold 46px serif';
    ctx.fillText('Узоры Марий Эл: Нить Времен', 130, 90);

    // geometric ornament
    ctx.strokeStyle = '#bc3c2f';
    ctx.lineWidth = 10;
    ctx.beginPath();
    const cx = w / 2, cy = h / 2;
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI * 2 * i) / 8;
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * 120, cy + Math.sin(a) * 120);
    }
    ctx.stroke();

    ctx.fillStyle = '#7f2f29';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(name, 190, 430);

    ctx.fillStyle = '#345e46';
    ctx.font = '26px sans-serif';
    ctx.fillText('Награда за знание традиционной вышивки', 220, 475);
  }

  static download(canvas, filename = 'mari-badge.png') {
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = filename;
    a.click();
  }
}
