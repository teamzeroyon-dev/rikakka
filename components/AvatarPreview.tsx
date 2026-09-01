import type { PartType } from '@/lib/avatarParts'

export type EquippedParts = Record<PartType, string>

const SKIN = '#FCD9B8'
const SKIN_SHADE = '#F0BE93'
const CLOTHES_COLORS = ['#F7C94B', '#4ec5c1', '#ff9040', '#7a8b99', '#e9789b', '#8fbf6b', '#9b8bd6', '#e05252']

function variantIndex(id: string): number {
  const n = Number(id.split('-').pop())
  return Number.isFinite(n) ? n - 1 : 0
}

function FaceShape({ i, children }: { i: number; children?: React.ReactNode }) {
  // 8 face silhouettes: round -> oval -> square -> heart etc, via rx/ry/scale variation
  const shapes = [
    { rx: 62, ry: 68 }, // round
    { rx: 58, ry: 74 }, // oval
    { rx: 64, ry: 64 }, // circle-ish
    { rx: 56, ry: 70 }, // narrow oval
    { rx: 66, ry: 62 }, // wide round
    { rx: 60, ry: 72 }, // tall oval
    { rx: 63, ry: 66 }, // soft square (rendered as rounded rect)
    { rx: 58, ry: 68 }, // heart-ish (round + narrower chin via ry)
  ]
  const s = shapes[i % shapes.length]
  return (
    <g>
      <ellipse cx={100} cy={110} rx={s.rx} ry={s.ry} fill={SKIN} stroke="#B8865E" strokeWidth={3} />
      <ellipse cx={100} cy={148} rx={s.rx * 0.55} ry={s.ry * 0.18} fill={SKIN_SHADE} opacity={0.5} />
      {children}
    </g>
  )
}

function BodyType({ i }: { i: number }) {
  const widths = [70, 78, 86, 94, 74, 82, 90, 98]
  const w = widths[i % widths.length]
  return <path d={`M ${100 - w / 2} 230 Q 100 190 ${100 + w / 2} 230 L ${100 + w / 2} 260 L ${100 - w / 2} 260 Z`} fill={SKIN} stroke="#B8865E" strokeWidth={3} />
}

function Eyes({ i }: { i: number }) {
  const styles = [
    { rx: 7, ry: 9 }, // round
    { rx: 9, ry: 6 }, // wide
    { rx: 6, ry: 10 }, // tall
    { rx: 8, ry: 7 }, // almond
    { rx: 5, ry: 5 }, // small dot
    { rx: 10, ry: 8 }, // big
    { rx: 7, ry: 5 }, // sleepy
    { rx: 8, ry: 8 }, // sparkly
  ]
  const s = styles[i % styles.length]
  const sparkly = i % styles.length === 7
  return (
    <g fill="#3d3a38">
      <ellipse cx={78} cy={104} rx={s.rx} ry={s.ry} />
      <ellipse cx={122} cy={104} rx={s.rx} ry={s.ry} />
      {sparkly && (
        <>
          <circle cx={80} cy={101} r={1.6} fill="#fff" />
          <circle cx={124} cy={101} r={1.6} fill="#fff" />
        </>
      )}
    </g>
  )
}

function Eyebrows({ i }: { i: number }) {
  const rotations = [-6, 6, 0, -12, 12, -3, 3, -8]
  const r = rotations[i % rotations.length]
  return (
    <g stroke="#5c4632" strokeWidth={3.5} strokeLinecap="round">
      <line x1={68} y1={88} x2={88} y2={88} transform={`rotate(${r} 78 88)`} />
      <line x1={112} y1={88} x2={132} y2={88} transform={`rotate(${-r} 122 88)`} />
    </g>
  )
}

function Eyelashes({ i }: { i: number }) {
  const lengths = [0, 3, 5, 4, 6, 2, 5, 7]
  const len = lengths[i % lengths.length]
  if (len === 0) return null
  return (
    <g stroke="#3d3a38" strokeWidth={1.5} strokeLinecap="round">
      <line x1={72} y1={97} x2={72 - len * 0.4} y2={97 - len} />
      <line x1={128} y1={97} x2={128 + len * 0.4} y2={97 - len} />
    </g>
  )
}

function Nose({ i }: { i: number }) {
  const shapes = [
    <circle key={0} cx={100} cy={116} r={2.5} fill="#B8865E" />,
    <path key={1} d="M 98 110 Q 100 122 104 122" fill="none" stroke="#B8865E" strokeWidth={2.5} strokeLinecap="round" />,
    <ellipse key={2} cx={100} cy={116} rx={4} ry={2.5} fill="#B8865E" />,
    <path key={3} d="M 97 108 L 100 122 L 103 108" fill="none" stroke="#B8865E" strokeWidth={2} strokeLinecap="round" />,
    <circle key={4} cx={100} cy={116} r={1.5} fill="#B8865E" />,
    <path key={5} d="M 99 110 Q 100 120 106 120" fill="none" stroke="#B8865E" strokeWidth={2.5} strokeLinecap="round" />,
    <ellipse key={6} cx={100} cy={117} rx={5} ry={3} fill="#B8865E" opacity={0.7} />,
    <path key={7} d="M 96 112 Q 100 124 104 112" fill="none" stroke="#B8865E" strokeWidth={2} strokeLinecap="round" />,
  ]
  return shapes[i % shapes.length]
}

function Mouth({ i }: { i: number }) {
  const shapes = [
    <path key={0} d="M 86 138 Q 100 148 114 138" fill="none" stroke="#B8865E" strokeWidth={3} strokeLinecap="round" />, // smile
    <ellipse key={1} cx={100} cy={140} rx={10} ry={6} fill="#8a5a4a" />, // open
    <line key={2} x1={90} y1={140} x2={110} y2={140} stroke="#B8865E" strokeWidth={3} strokeLinecap="round" />, // flat
    <path key={3} d="M 88 142 Q 100 132 112 142" fill="none" stroke="#B8865E" strokeWidth={3} strokeLinecap="round" />, // frown
    <path key={4} d="M 84 138 Q 100 152 116 138" fill="#e05252" stroke="#B8865E" strokeWidth={2} />, // big smile
    <path key={5} d="M 92 140 Q 100 144 108 140" fill="none" stroke="#B8865E" strokeWidth={2.5} strokeLinecap="round" />, // small
    <path key={6} d="M 86 136 Q 100 150 114 136 Q 100 144 86 136" fill="#fff" stroke="#B8865E" strokeWidth={2} />, // grin with teeth
    <path key={7} d="M 90 140 L 100 145 L 110 140" fill="none" stroke="#B8865E" strokeWidth={3} strokeLinecap="round" />, // v shape
  ]
  return shapes[i % shapes.length]
}

function Clothes({ i }: { i: number }) {
  const color = CLOTHES_COLORS[i % CLOTHES_COLORS.length]
  const collar = i % 3 === 0
  return (
    <g>
      <path d="M 55 260 Q 100 235 145 260 L 150 300 L 50 300 Z" fill={color} stroke="#0e4b69" strokeWidth={3} />
      {collar && <path d="M 85 240 L 100 258 L 115 240" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" />}
    </g>
  )
}

export function AvatarPreview({ parts, size = 160, className }: { parts: EquippedParts; size?: number; className?: string }) {
  const fi = variantIndex(parts.faceShape)
  const bi = variantIndex(parts.bodyType)
  const ei = variantIndex(parts.eyes)
  const ebi = variantIndex(parts.eyebrows)
  const eli = variantIndex(parts.eyelashes)
  const ni = variantIndex(parts.nose)
  const mi = variantIndex(parts.mouth)
  const ci = variantIndex(parts.clothes)

  return (
    <svg viewBox="0 0 200 300" width={size} height={(size * 300) / 200} className={className} role="img" aria-label="アバター">
      <Clothes i={ci} />
      <BodyType i={bi} />
      <FaceShape i={fi}>
        <Eyebrows i={ebi} />
        <Eyes i={ei} />
        <Eyelashes i={eli} />
        <Nose i={ni} />
        <Mouth i={mi} />
      </FaceShape>
    </svg>
  )
}
