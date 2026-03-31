export function StartScreen({ onStart, onInfo, progress }) {
  const el = document.createElement('section');
  el.className = 'screen';
  el.innerHTML = `
    <div class="center">
      <h1>Узоры Марий Эл: Нить Времен</h1>
      <p>Образовательное путешествие по символам марийской вышивки</p>
      <p>Уровень: ${progress.level} · Нитки: ${progress.score}</p>
      <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
        <button id="playBtn">▶ Играть</button>
        <button id="aboutBtn">Об игре</button>
      </div>
    </div>
  `;
  el.querySelector('#playBtn').onclick = onStart;
  el.querySelector('#aboutBtn').onclick = onInfo;
  return el;
}
