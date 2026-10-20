import { CATEGORY_INFO } from '@/lib/diagnosis'

// The mascot grows from what the child clears: total clears decide the body
// stage, and each field's clears grow that field's look (physics → muscles,
// biology → moss and grass, ...). Coins buy snacks, backgrounds and accessories.

export type MascotField = 'butsuri' | 'kagaku' | 'chigaku' | 'seibutsu'
export const MASCOT_FIELDS: MascotField[] = ['butsuri', 'kagaku', 'chigaku', 'seibutsu']

export const FIELD_INFO: Record<MascotField, { label: string; color: string; grows: string; ids: string[] }> = {
  butsuri: { label: '物理', color: '#FF9040', grows: 'きんにくが ムキムキに', ids: [...CATEGORY_INFO.lever.ids, ...CATEGORY_INFO.rubber.ids] },
  kagaku: { label: '化学', color: '#3AA6A0', grows: 'ゴーグルと あわが ぶくぶく', ids: CATEGORY_INFO.chem.ids },
  chigaku: { label: '地学', color: '#C07A3E', grows: 'いしや ほしが キラキラ', ids: CATEGORY_INFO.chigaku.ids },
  seibutsu: { label: '生物', color: '#5FB85F', grows: 'こけや 草が もさもさ', ids: CATEGORY_INFO.seibutsu.ids },
}

// Clears needed for field level 1/2/3, and total clears for body stage 1/2/3.
export const FIELD_LEVEL_AT = [1, 3, 6] as const
export const BODY_STAGE_AT = [0, 3, 12] as const
export const BODY_STAGE_LABEL = ['ちび', 'こども', 'おとな'] as const

export type FieldLevel = 0 | 1 | 2 | 3
export type BodyStage = 1 | 2 | 3
export type MascotLook = {
  body: BodyStage
  fields: Record<MascotField, FieldLevel>
  counts: Record<MascotField, number>
  total: number
}

const levelFor = (n: number, at: readonly number[]) => at.filter((t) => n >= t).length

export function computeMascotLook(cleared: Record<string, unknown>): MascotLook {
  const counts = {} as Record<MascotField, number>
  const fields = {} as Record<MascotField, FieldLevel>
  let total = 0
  for (const f of MASCOT_FIELDS) {
    const n = FIELD_INFO[f].ids.filter((id) => Boolean(cleared[id])).length
    counts[f] = n
    fields[f] = levelFor(n, FIELD_LEVEL_AT) as FieldLevel
    total += n
  }
  return { body: levelFor(total, BODY_STAGE_AT) as BodyStage, fields, counts, total }
}

// Clears still needed for the next level of a field (null when maxed).
export function nextFieldGoal(count: number): number | null {
  const next = FIELD_LEVEL_AT.find((t) => count < t)
  return next === undefined ? null : next - count
}

// ---- Shop ------------------------------------------------------------------

export type ShopKind = 'snack' | 'background' | 'accessory'
export type ShopItem = { id: string; kind: ShopKind; name: string; price: number; emoji: string; love?: number }

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'snack-apple', kind: 'snack', name: 'りんご', price: 10, emoji: '🍎', love: 1 },
  { id: 'snack-onigiri', kind: 'snack', name: 'おにぎり', price: 20, emoji: '🍙', love: 2 },
  { id: 'snack-cake', kind: 'snack', name: 'ケーキ', price: 50, emoji: '🍰', love: 6 },

  { id: 'bg-sky', kind: 'background', name: 'そら', price: 0, emoji: '☁️' },
  { id: 'bg-forest', kind: 'background', name: 'もり', price: 80, emoji: '🌳' },
  { id: 'bg-sea', kind: 'background', name: 'うみ', price: 80, emoji: '🌊' },
  { id: 'bg-lab', kind: 'background', name: 'じっけんしつ', price: 120, emoji: '⚗️' },
  { id: 'bg-space', kind: 'background', name: 'うちゅう', price: 150, emoji: '🪐' },

  { id: 'acc-none', kind: 'accessory', name: 'なし', price: 0, emoji: '✖️' },
  { id: 'acc-ribbon', kind: 'accessory', name: 'リボン', price: 60, emoji: '🎀' },
  { id: 'acc-cap', kind: 'accessory', name: 'ぼうし', price: 80, emoji: '🧢' },
  { id: 'acc-glasses', kind: 'accessory', name: 'めがね', price: 80, emoji: '👓' },
  { id: 'acc-crown', kind: 'accessory', name: 'おうかん', price: 200, emoji: '👑' },
]

export const DEFAULT_BACKGROUND = 'bg-sky'
export const DEFAULT_ACCESSORY = 'acc-none'

export const getShopItem = (id: string) => SHOP_ITEMS.find((i) => i.id === id)

// Affection from snacks → 0..5 hearts.
export const LOVE_PER_HEART = 5
export const heartsFor = (love: number) => Math.min(5, Math.floor(love / LOVE_PER_HEART))

// ---- Art slots -------------------------------------------------------------
// Hand-drawn art goes in /public/mascot/ and is registered here. Every image is
// the same square canvas with a transparent background, aligned to the body, so
// layers stack. A missing entry falls back to the built-in placeholder drawing.
//   body-1..3          body per stage
//   <field>-1..3       overlay per field level (butsuri / kagaku / chigaku / seibutsu)
export const MASCOT_ART: Partial<Record<string, string>> = {
  // 'body-1': '/mascot/body-1.png',
}
