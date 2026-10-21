import type { QuizQuestion, QuizSet } from '@/lib/quizProblems'
import type { QuizPool } from './q'
import { physicsPool } from './physics'
import { chemPool } from './chem'
import { chigakuPool } from './chigaku'
import { seibutsuPool } from './seibutsu'

const POOLS: Record<string, QuizPool> = { ...physicsPool, ...chemPool, ...chigakuPool, ...seibutsuPool }

function sample<T>(items: T[], n: number): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out.slice(0, n)
}

// The stage's own normal + retry join the normal pool, its easy joins the easy
// pool; normal and retry are two different picks from the normal pool.
export function pickQuiz(stageId: string, base: QuizSet): QuizSet {
  const pool = POOLS[stageId]
  if (!pool) return base
  const normals: QuizQuestion[] = [base.normal, base.retry, ...(pool.normal ?? [])]
  const easies: QuizQuestion[] = [base.easy, ...(pool.easy ?? [])]
  const [normal, retry] = sample(normals, 2)
  return { normal, retry, easy: sample(easies, 1)[0] }
}

export function poolSize(stageId: string) {
  const pool = POOLS[stageId]
  return { normal: 2 + (pool?.normal?.length ?? 0), easy: 1 + (pool?.easy?.length ?? 0) }
}
