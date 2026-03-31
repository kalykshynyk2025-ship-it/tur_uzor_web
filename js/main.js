import { App } from './App.js';

const root = document.getElementById('app');
const bg = document.getElementById('bg-canvas');

try {
  new App(root, bg);
} catch (error) {
  console.error(error);
  root.innerHTML = `
    <section class="screen">
      <div class="center">
        <h2>Ошибка запуска игры</h2>
        <p>Откройте игру через локальный сервер (http://localhost), а не напрямую через file://</p>
        <pre style="white-space:pre-wrap;text-align:left;max-width:90%;">${String(error)}</pre>
      </div>
    </section>
  `;
}
