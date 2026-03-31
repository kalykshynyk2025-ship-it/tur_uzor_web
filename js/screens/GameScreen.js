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
  ornament.parts.forEach((part, idx) => {
    const piece = document.createElement('div');
    piece.className = 'piece';
    piece.dataset.id = part.id;
    piece.textContent = idx + 1;
    piece.style.background = part.color;
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
        node.style.position = 'static';
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
