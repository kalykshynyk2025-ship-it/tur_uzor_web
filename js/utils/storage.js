const KEY = 'mari-ornament-progress-v1';

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? { score: 0, level: 1, solved: 0 };
  } catch {
    return { score: 0, level: 1, solved: 0 };
  }
}

export function saveProgress(progress) {
  localStorage.setItem(KEY, JSON.stringify(progress));
}

export function resetProgress() {
  localStorage.removeItem(KEY);
}
