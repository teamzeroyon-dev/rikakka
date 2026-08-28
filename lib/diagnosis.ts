import { problems, type Problem } from '@/lib/problems'

// One entry per problem "archetype" (theme). New archetypes (e.g. magnets,
// circuits) just need an entry added here — the ratio/diagnosis logic below
// works for any number of themes.
export const THEME_INFO: Record<Problem['archetype'], { label: string; emoji: string; job: string; jobDesc: string }> = {
  balance: {
    label: 'てこ・つり合い',
    emoji: '⚖️',
    job: '建築家・エンジニア',
    jobDesc: 'てこや つり合いの しくみは、橋やクレーン、たてものを つくる人たちが 毎日つかっている考え方だよ。ものの バランスを 見つけるのが 得意なきみは、そうけい（設計）の 仕事に むいてるかも！',
  },
  launch: {
    label: 'ゴムの力',
    emoji: '🚀',
    job: '宇宙飛行士・エンジニア',
    jobDesc: 'ゴムの力で ものを とばす しくみは、ロケットや じどう車を つくる エンジニアたちの けんきゅうに つながっているよ。きょりを ねらって とばすのが 得意なきみは、宇宙飛行士 むいてるかも！',
  },
}

export type DiagnosisResult = {
  totalCleared: number
  ratios: { archetype: Problem['archetype']; label: string; emoji: string; count: number; percent: number }[]
  topArchetype: Problem['archetype'] | null
}

export function computeDiagnosis(clearedIds: Record<string, boolean>): DiagnosisResult {
  const clearedProblems = problems.filter((p) => clearedIds[p.id])
  const counts = new Map<Problem['archetype'], number>()
  for (const p of clearedProblems) counts.set(p.archetype, (counts.get(p.archetype) ?? 0) + 1)

  const total = clearedProblems.length
  const ratios = (Object.keys(THEME_INFO) as Problem['archetype'][])
    .map((archetype) => ({
      archetype,
      label: THEME_INFO[archetype].label,
      emoji: THEME_INFO[archetype].emoji,
      count: counts.get(archetype) ?? 0,
      percent: total > 0 ? Math.round(((counts.get(archetype) ?? 0) / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  const topArchetype = total > 0 && ratios[0].count > 0 ? ratios[0].archetype : null

  return { totalCleared: total, ratios, topArchetype }
}
