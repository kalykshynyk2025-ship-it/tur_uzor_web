export function InfoScreen({ ornament, onNext }) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-card">
      <h2>${ornament.name}</h2>
      <p><b>Значение:</b> ${ornament.meaning}</p>
      <p><b>Где используется:</b> ${ornament.usage}</p>
      <button id="nextBtn">Далее</button>
    </div>
  `;
  modal.querySelector('#nextBtn').onclick = onNext;
  return modal;
}
