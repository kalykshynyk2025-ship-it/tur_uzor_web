import { ORNAMENTS, QUIZ_QUESTIONS } from './utils/data.js';
import { loadProgress, saveProgress, resetProgress } from './utils/storage.js';
import { AnimationSystem } from './systems/AnimationSystem.js';
import { QuizEngine } from './systems/QuizEngine.js';
import { SoundSystem } from './utils/sound.js';

import { StartScreen } from './screens/StartScreen.js';
import { GameScreen } from './screens/GameScreen.js';
import { InfoScreen } from './screens/InfoScreen.js';
import { QuizScreen } from './screens/QuizScreen.js';
import { EmbroideryMiniGame } from './screens/EmbroideryMiniGame.js';
import { RewardScreen } from './screens/RewardScreen.js';

export class App {
  constructor(root, bgCanvas) {
    this.root = root;
    this.state = {
      screen: 'start',
      ornamentIdx: 0,
      progress: loadProgress()
    };
    this.sound = new SoundSystem();
    this.animation = new AnimationSystem(bgCanvas);
    this.animation.start();
    this.sound.startAmbient();
    this.quiz = new QuizEngine(QUIZ_QUESTIONS);
    this.render();
  }

  setScreen(screen) {
    this.state.screen = screen;
    const map = { start: 'forest', game: 'meadow', quiz: 'forest', mini: 'izba', reward: 'izba' };
    this.animation.setMode(map[screen] || 'forest');
    this.render();
  }

  patchProgress(deltaScore = 0, solvedInc = 0) {
    const p = this.state.progress;
    p.score += deltaScore;
    p.solved += solvedInc;
    p.level = 1 + Math.floor(p.solved / 2);
    saveProgress(p);
  }

  mount(screenEl) {
    this.root.innerHTML = '';
    this.root.appendChild(screenEl);
  }

  render() {
    const ornament = ORNAMENTS[this.state.ornamentIdx % ORNAMENTS.length];
    const p = this.state.progress;

    if (this.state.screen === 'start') {
      this.mount(StartScreen({
        progress: p,
        onStart: () => { this.sound.click(); this.setScreen('game'); },
        onInfo: () => {
          this.sound.click();
          const modal = InfoScreen({ ornament: ORNAMENTS[0], onNext: () => modal.remove() });
          document.body.appendChild(modal);
        }
      }));
      return;
    }

    if (this.state.screen === 'game') {
      this.mount(GameScreen({
        ornament,
        progress: p,
        animationSystem: this.animation,
        sound: this.sound,
        onComplete: () => {
          this.patchProgress(30, 1);
          const modal = InfoScreen({
            ornament,
            onNext: () => {
              modal.remove();
              this.state.ornamentIdx += 1;
              this.setScreen('quiz');
            }
          });
          document.body.appendChild(modal);
        },
        onBack: () => this.setScreen('start')
      }));
      return;
    }

    if (this.state.screen === 'quiz') {
      const q = this.quiz.current();
      if (!q) { this.setScreen('mini'); return; }
      this.mount(QuizScreen({
        question: q,
        index: this.quiz.index,
        total: QUIZ_QUESTIONS.length,
        score: p.score,
        onAnswer: (i, btn) => {
          this.sound.click();
          const out = this.quiz.answer(i);
          const buttons = [...this.root.querySelectorAll('.quiz-option')];
          buttons[out.correctIndex].classList.add('correct');
          if (!out.correct) btn.classList.add('wrong');
          this.root.querySelector('#result').textContent = out.correct ? 'Верно! +10 ниток' : 'Есть ошибка, но учимся дальше!';
          if (out.correct) this.patchProgress(10, 0);
          setTimeout(() => out.done ? this.setScreen('mini') : this.render(), 700);
        }
      }));
      return;
    }

    if (this.state.screen === 'mini') {
      this.mount(EmbroideryMiniGame({
        sound: this.sound,
        // После завершения квиза возврат в него невозможен (вопросов больше нет),
        // поэтому кнопка "Назад" ведёт на стартовый экран.
        onBack: () => this.setScreen('start'),
        onComplete: () => {
          this.patchProgress(20, 1);
          this.setScreen('reward');
        }
      }));
      return;
    }

    if (this.state.screen === 'reward') {
      this.mount(RewardScreen({
        onRestart: () => {
          resetProgress();
          this.quiz = new QuizEngine(QUIZ_QUESTIONS);
          this.state.progress = loadProgress();
          this.state.ornamentIdx = 0;
          this.setScreen('start');
        }
      }));
    }
  }
}
