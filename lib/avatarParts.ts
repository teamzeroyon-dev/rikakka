export type PartType =
  | 'hair'
  | 'hairColor'
  | 'faceShape'
  | 'bodyType'
  | 'eyes'
  | 'eyebrows'
  | 'eyelashes'
  | 'nose'
  | 'mouth'
  | 'clothes'

export type PartVariant = {
  id: string
  partType: PartType
  label: string
  price: number // 0 = free / owned from the start
}

// Hair leads the list: it is the part that makes an avatar recognisable.
export const PART_TYPES: PartType[] = [
  'hair',
  'hairColor',
  'faceShape',
  'eyes',
  'eyebrows',
  'eyelashes',
  'nose',
  'mouth',
  'bodyType',
  'clothes',
]

export const PART_TYPE_LABELS: Record<PartType, string> = {
  hair: 'かみがた',
  hairColor: 'かみの いろ',
  faceShape: 'かおの かたち',
  bodyType: 'からだ',
  eyes: 'め',
  eyebrows: 'まゆげ',
  eyelashes: 'まつげ',
  nose: 'はな',
  mouth: 'くち',
  clothes: 'ふく',
}

const PRICES = [0, 0, 0, 0, 15, 25, 40, 60]

function buildVariants(partType: PartType): PartVariant[] {
  return PRICES.map((price, i) => ({
    id: `${partType}-${i + 1}`,
    partType,
    label: `${PART_TYPE_LABELS[partType]} ${i + 1}`,
    price,
  }))
}

export const AVATAR_CATALOG: Record<PartType, PartVariant[]> = Object.fromEntries(
  PART_TYPES.map((t) => [t, buildVariants(t)]),
) as Record<PartType, PartVariant[]>

export function getVariant(partType: PartType, variantId: string): PartVariant | undefined {
  return AVATAR_CATALOG[partType].find((v) => v.id === variantId)
}

export function isFree(partType: PartType, variantId: string): boolean {
  return getVariant(partType, variantId)?.price === 0
}

export const DEFAULT_EQUIPPED: Record<PartType, string> = {
  hair: 'hair-1',
  hairColor: 'hairColor-1',
  faceShape: 'faceShape-1',
  bodyType: 'bodyType-1',
  eyes: 'eyes-1',
  eyebrows: 'eyebrows-1',
  eyelashes: 'eyelashes-1',
  nose: 'nose-1',
  mouth: 'mouth-1',
  clothes: 'clothes-1',
}
