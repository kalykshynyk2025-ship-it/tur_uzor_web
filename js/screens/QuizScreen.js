export function QuizScreen({ question, index, total, onAnswer, score }) {
  const el = document.createElement('section');
  el.className = 'screen';
  el.innerHTML = `
    <div class="topbar">
      <h2>Квест знаний (${index + 1}/${total})</h2>
      <div>Нитки: ${score}</div>
    </div>
    <div class="center" style="align-items:stretch;text-align:left;">
      <h3>${question.question}</h3>
      <div class="quiz-options"></div>
      <p id="result">Выбери верный ответ.</p>
    </div>
  `;
  const ops = el.querySelector('.quiz-options');
  question.options.forEach((opt, i) => {
    const b = document.createElement('button');
    b.className = 'quiz-option';
    b.textContent = opt;
    b.onclick = () => onAnswer(i, b);
    ops.appendChild(b);
  });
  return el;
}
