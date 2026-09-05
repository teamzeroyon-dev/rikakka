import { problems } from '@/lib/problems'
import { chemStages } from '@/lib/quizProblems'
import { scienceStages } from '@/lib/scienceStages'

// Interest diagnosis across every subject. Each category counts how many of its
// stages the child has cleared; the category with the most clears picks the job.
export type DiagCategory = 'lever' | 'rubber' | 'chem' | 'chigaku' | 'seibutsu'

const leverIds = problems.filter((p) => p.archetype === 'balance').map((p) => p.id)
const rubberIds = problems.filter((p) => p.archetype === 'launch').map((p) => p.id)
const chemIds = chemStages.map((s) => s.id)
const chigakuIds = scienceStages.filter((s) => s.regionId === 'chigaku').map((s) => s.id)
const seibutsuIds = scienceStages.filter((s) => s.regionId === 'seibutsu').map((s) => s.id)

export const CATEGORY_INFO: Record<
  DiagCategory,
  { label: string; job: string; nearName: string; jobDesc: string; ids: string[] }
> = {
  lever: {
    label: 'てこ・つり合い',
    job: '建築家・エンジニア',
    nearName: 'けんちくエンジニア',
    jobDesc: 'てこや つり合いの しくみは、橋やクレーン、たてものを つくる人たちが 毎日つかっている考え方だよ。ものの バランスを 見つけるのが 得意なきみは、そうけい（設計）の 仕事に むいてるかも！',
    ids: leverIds,
  },
  rubber: {
    label: 'ゴムの力',
    job: '宇宙飛行士・エンジニア',
    nearName: 'ロケットエンジニア',
    jobDesc: 'ゴムの力で ものを とばす しくみは、ロケットや じどう車を つくる エンジニアたちの けんきゅうに つながっているよ。きょりを ねらって とばすのが 得意なきみは、宇宙飛行士 むいてるかも！',
    ids: rubberIds,
  },
  chem: {
    label: '化学（もの・水・空気）',
    job: '化学者・くすりの研究者',
    nearName: 'かがくしゃ',
    jobDesc: '化学は、くすり・食べもの・そざいを つくる 研究者や こうじょうで 生かされているよ。ものの 性質を しらべるのが 得意な きみは、化学者に むいてるかも！',
    ids: chemIds,
  },
  chigaku: {
    label: '地学（太陽・天気・大地）',
    job: '気象予報士・宇宙研究者',
    nearName: 'きしょう よほうし',
    jobDesc: '天気や 大地、宇宙の しくみは、気象予報士や 防災、うちゅうの けんきゅうに つながるよ。空や 大地を 読むのが 得意な きみに ぴったり！',
    ids: chigakuIds,
  },
  seibutsu: {
    label: '生物（植物・生きもの・体）',
    job: 'お医者さん・生物学者',
    nearName: 'おいしゃさん',
    jobDesc: '植物や 生きもの、体の しくみは、お医者さんや 生物学者、農業の 仕事に 生かされているよ。生きものが 好きな きみに むいてるかも！',
    ids: seibutsuIds,
  },
}

// Backwards-compatible alias (older imports used THEME_INFO).
export const THEME_INFO = CATEGORY_INFO

const CATEGORY_ORDER: DiagCategory[] = ['lever', 'rubber', 'chem', 'chigaku', 'seibutsu']

export type DiagnosisResult = {
  totalCleared: number
  ratios: { archetype: DiagCategory; label: string; count: number; percent: number }[]
  topArchetype: DiagCategory | null
}

export function computeDiagnosis(clearedIds: Record<string, unknown>): DiagnosisResult {
  const counts = new Map<DiagCategory, number>()
  let total = 0
  for (const cat of CATEGORY_ORDER) {
    const count = CATEGORY_INFO[cat].ids.filter((id) => Boolean(clearedIds[id])).length
    counts.set(cat, count)
    total += count
  }

  const ratios = CATEGORY_ORDER.map((cat) => ({
    archetype: cat,
    label: CATEGORY_INFO[cat].label,
    count: counts.get(cat) ?? 0,
    percent: total > 0 ? Math.round(((counts.get(cat) ?? 0) / total) * 100) : 0,
  })).sort((a, b) => b.count - a.count)

  const topArchetype = total > 0 && ratios[0].count > 0 ? ratios[0].archetype : null

  return { totalCleared: total, ratios, topArchetype }
}
