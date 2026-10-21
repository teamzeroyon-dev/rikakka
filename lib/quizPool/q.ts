import type { QuizQuestion } from '@/lib/quizProblems'

// Extra example questions per stage. Each stage's quiz picks from these on every
// play, so replays don't show the same three questions.
//   normal: same level as the stage's normal/retry question
//   easy:   the warm-up shown after two wrong answers
export type QuizPool = { normal?: QuizQuestion[]; easy?: QuizQuestion[] }

// q('もんだい', 'せいかい', 'はずれ', 'はずれ') — the correct answer goes first;
// QuizFlow shuffles the order on screen.
export function q(prompt: string, correct: string, wrong1: string, wrong2?: string): QuizQuestion {
  const texts = wrong2 === undefined ? [correct, wrong1] : [correct, wrong1, wrong2]
  const ids = ['A', 'B', 'C'] as const
  return { prompt, choices: texts.map((text, i) => ({ id: ids[i], text })), correctId: 'A' }
}
