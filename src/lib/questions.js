export const QUESTION_COUNT = 20;

export function createEmptyQuestion(order) {
  return {
    order,
    text: '',
    type: 'mcq',
    options: ['', '', '', ''],
    correctAnswer: '',
    active: true,
  };
}

export function buildSlides(questions) {
  const active = [...questions]
    .filter((q) => q.active && q.text?.trim())
    .sort((a, b) => a.order - b.order);

  const mcq = active.filter((q) => q.type === 'mcq');
  const programming = active.filter((q) => q.type === 'programming');

  const slides = [];
  for (let i = 0; i < mcq.length; i += 3) {
    slides.push({ type: 'mcq', duration: 120, questions: mcq.slice(i, i + 3) });
  }

  for (const q of programming) {
    slides.push({ type: 'programming', duration: 300, questions: [q] });
  }

  return slides;
}

export function formatClock(seconds) {
  const clamped = Math.max(0, seconds);
  const min = Math.floor(clamped / 60).toString().padStart(2, '0');
  const sec = Math.floor(clamped % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}
