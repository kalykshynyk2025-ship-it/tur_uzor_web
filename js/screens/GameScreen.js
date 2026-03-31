import { PuzzleSystem } from '../systems/PuzzleSystem.js';
import { DragDropEngine } from '../systems/DragDropEngine.js';

export function GameScreen({ ornament, progress, animationSystem, sound, onComplete, onBack }) {
  const puzzle = new PuzzleSystem(ornament);
  const el = document.createElement('section');
  el.className = 'screen';
  el.innerHTML = `
    <div class="topbar">
      <button id="backBtn">← Назад</button>
      <h3>${ornament.name}</h3>
      <div>Нитки: <span id="score">${progress.score}</span></div>
      <div class="progress-wrap"><div class="progress-bar" id="pbar"></div></div>
    </div>
    <div class="puzzle-area">
      <div class="board" id="board"><div class="slots"></div><canvas id="stitchCanvas" style="position:absolute;inset:0;"></canvas></div>
      <div class="pieces" id="pieces"></div>
    </div>
  `;
  el.querySelector('#backBtn').onclick = onBack;

  const board = el.querySelector('#board');
  const slotsWrap = el.querySelector('.slots');
  const pieceWrap = el.querySelector('#pieces');
  const pbar = el.querySelector('#pbar');
  const stitchCanvas = el.querySelector('#stitchCanvas');
  const sctx = stitchCanvas.getContext('2d');
  const updateStitchSize = () => {
    stitchCanvas.width = board.clientWidth;
    stitchCanvas.height = board.clientHeight;
  };
  updateStitchSize();
  window.addEventListener('resize', updateStitchSize);

  pieceWrap.style.position = 'relative';
  pieceWrap.style.minHeight = '300px';

  const slots = ornament.parts.map((part) => {
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.dataset.id = part.id;
    slot.style.left = `${part.x}px`;
    slot.style.top = `${part.y}px`;
    slotsWrap.appendChild(slot);
    return slot;
  });

  const dd = new DragDropEngine(el);
  const shuffledParts = [...ornament.parts].sort(() => Math.random() - 0.5);
  shuffledParts.forEach((part, idx) => {
    const piece = document.createElement('div');
    piece.className = 'piece';
    piece.dataset.id = part.id;
    piece.innerHTML = `<span>${idx + 1}</span>`;
    piece.style.background = part.color;
    piece.style.backgroundImage = triangleMosaic(part.color, idx + 1);
    piece.style.position = 'absolute';
    piece.style.left = `${10 + Math.random() * 160}px`;
    piece.style.top = `${8 + Math.random() * 220}px`;
    pieceWrap.appendChild(piece);

    dd.makeDraggable(piece, ({ x, y, node }) => {
      const snap = puzzle.checkSnap(part.id, { x, y }, slots, 58);
      if (snap.ok) {
        node.style.left = `${snap.x}px`;
        node.style.top = `${snap.y}px`;
        node.style.position = 'fixed';
        node.style.pointerEvents = 'none';
        node.style.transform = 'scale(1)';
        animationSystem.playEmbroideryFX(node);
        sound.stitch();
        drawStitchLine(node, snap);
      } else {
        node.style.position = 'absolute';
        node.style.left = `${10 + Math.random() * 160}px`;
        node.style.top = `${8 + Math.random() * 220}px`;
      }
      pbar.style.width = `${Math.floor(puzzle.progress * 100)}%`;
      if (puzzle.isComplete()) setTimeout(() => onComplete(), 450);
    });
  });

  function drawStitchLine(node, snap) {
    const r = board.getBoundingClientRect();
    const x = snap.x - r.left + node.offsetWidth / 2;
    const y = snap.y - r.top + node.offsetHeight / 2;
    sctx.strokeStyle = '#a02f2f';
    sctx.lineWidth = 3;
    sctx.beginPath();
    sctx.moveTo(stitchCanvas.width / 2, stitchCanvas.height - 12);
    sctx.lineTo(x, y);
    sctx.stroke();
  }

  return el;
}

function triangleMosaic(base, seed) {
  const c = (delta) => shade(base, delta);
  const triangles = [
    `polygon(0 0, 50% 0, 0 50%) ${c(seed * 3)}`,
    `polygon(50% 0, 100% 0, 100% 50%) ${c(-10)}`,
    `polygon(0 50%, 50% 100%, 0 100%) ${c(12)}`,
    `polygon(100% 50%, 50% 100%, 100% 100%) ${c(-18)}`,
    `polygon(50% 0, 100% 50%, 50% 50%) ${c(20)}`,
    `polygon(0 50%, 50% 50%, 50% 100%) ${c(-4)}`
  ];
  return `conic-gradient(from 45deg, ${triangles.map((t, i) => `${t.split(') ')[1]} ${i * 60}deg ${(i + 1) * 60}deg`).join(',')})`;
}

function shade(hex, delta) {
  const n = hex.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(n.slice(0, 2), 16) + delta));
  const g = Math.max(0, Math.min(255, parseInt(n.slice(2, 4), 16) + delta));
  const b = Math.max(0, Math.min(255, parseInt(n.slice(4, 6), 16) + delta));
  return `rgb(${r}, ${g}, ${b})`;
}
