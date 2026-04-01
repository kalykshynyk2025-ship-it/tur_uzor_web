import { RewardGenerator } from '../systems/RewardGenerator.js';

export function RewardScreen({ onRestart }) {
  const el = document.createElement('section');
  el.className = 'screen';
  el.innerHTML = `
    <div class="center">
      <h2>🏆 Награда</h2>
      <p>Знаток марийской вышивки</p>
      <canvas id="reward" class="reward-canvas"></canvas>
      <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">
        <button id="downloadBtn">Скачать PNG-бейдж</button>
        <button id="restartBtn">Играть снова</button>
      </div>
    </div>
  `;
  const canvas = el.querySelector('#reward');
  RewardGenerator.draw(canvas);
  el.querySelector('#downloadBtn').onclick = () => RewardGenerator.download(canvas);
  el.querySelector('#restartBtn').onclick = onRestart;
  return el;
}
