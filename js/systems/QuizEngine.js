export class QuizEngine {
  constructor(questions) {
    this.questions = questions;
    this.index = 0;
    this.score = 0;
  }

  current() {
    return this.questions[this.index];
  }

  answer(optionIndex) {
    const q = this.current();
    const correct = q.answer === optionIndex;
    if (correct) this.score += 10;
    this.index += 1;
    return { correct, done: this.index >= this.questions.length, correctIndex: q.answer };
  }
}
