import type { PartType } from '@/lib/avatarParts'

export type EquippedParts = Record<PartType, string>

// Tomodachi-style: one big round head, flat friendly features, and hair that
// wraps the head in a back layer + a front fringe. Everything is built from a
// handful of tunable numbers so the 8 variants of each part stay consistent.
const SKIN = '#FCD9B8'
const SKIN_LINE = '#E4A879'
const SKIN_SHADE = '#F4C39C'

// Hair palettes: [main, shade, highlight]. Index chosen by the hairColor part.
const HAIR_COLORS: [string, string, string][] = [
  ['#3f3230', '#2a201e', '#5c4a45'], // dark brown-black
  ['#6b4a2f', '#513521', '#8a6440'], // chestnut
  ['#c8894b', '#a86d38', '#e0a866'], // light brown
  ['#e8c15a', '#cfa23c', '#f6d986'], // blonde
  ['#c65b3c', '#a4442a', '#e07a58'], // ginger
  ['#e79ab4', '#d17a97', '#f3bcd0'], // pink
  ['#6fae7a', '#548a5f', '#93c99c'], // green
  ['#7f8cd6', '#616fbb', '#a3aee8'], // periwinkle
]

const CLOTHES_COLORS = ['#F7C94B', '#4ec5c1', '#ff9040', '#7a8b99', '#e9789b', '#8fbf6b', '#9b8bd6', '#e05252']

function variantIndex(id: string): number {
  const n = Number(id.split('-').pop())
  return Number.isFinite(n) ? n - 1 : 0
}

// ---- hair -----------------------------------------------------------------
// Back layer sits behind the head; front layer is the fringe drawn over it.

function HairBack({ i, colors }: { i: number; colors: [string, string, string] }) {
  const [main, shade] = colors
  // 0 no back hair, then increasingly long/wide silhouettes.
  const shapes = [
    null,
    <ellipse key="b1" cx={100} cy={116} rx={70} ry={74} fill={main} />,
    <path key="b2" d="M28 120 Q26 190 52 236 L148 236 Q174 190 172 120 Q172 40 100 40 Q28 40 28 120Z" fill={main} />,
    <path key="b3" d="M30 118 Q22 210 40 268 L64 268 Q52 200 60 150 L140 150 Q148 200 136 268 L160 268 Q178 210 170 118 Q170 42 100 42 Q30 42 30 118Z" fill={main} />,
    <ellipse key="b4" cx={100} cy={120} rx={74} ry={80} fill={main} />,
    <path key="b5" d="M32 116 Q30 176 50 214 L150 214 Q170 176 168 116 Q168 44 100 44 Q32 44 32 116Z" fill={main} />,
    <path key="b6" d="M34 118 Q20 200 44 260 Q60 220 60 176 L140 176 Q140 220 156 260 Q180 200 166 118 Q166 44 100 44 Q34 44 34 118Z" fill={main} />,
    <ellipse key="b7" cx={100} cy={118} rx={72} ry={76} fill={main} />,
  ]
  const s = shapes[i % shapes.length]
  if (!s) return null
  return (
    <g>
      {s}
      <ellipse cx={100} cy={132} rx={54} ry={54} fill={shade} opacity={0.25} />
    </g>
  )
}

function HairFront({ i, colors }: { i: number; colors: [string, string, string] }) {
  const [main, shade, hi] = colors
  // Each fringe wraps the top of the face; the parting/shape is what changes.
  const fringes = [
    // 1 short round bowl
    <path key="f1" d="M40 96 Q44 44 100 44 Q156 44 160 96 Q150 72 100 70 Q50 72 40 96Z" fill={main} />,
    // 2 side-swept
    <path key="f2" d="M40 100 Q40 46 100 46 Q160 46 158 96 Q150 70 96 74 Q70 60 58 96 Q52 82 40 100Z" fill={main} />,
    // 3 middle part
    <path key="f3" d="M40 98 Q42 46 100 46 Q158 46 160 98 Q150 66 104 72 L100 96 L96 72 Q50 66 40 98Z" fill={main} />,
    // 4 straight blunt bangs
    <path key="f4" d="M42 92 Q42 46 100 46 Q158 46 158 92 L152 92 Q150 78 138 88 Q130 74 118 88 Q112 74 100 88 Q88 74 82 88 Q72 74 62 88 Q50 78 48 92Z" fill={main} />,
    // 5 spiky
    <path key="f5" d="M40 96 Q44 46 100 46 Q156 46 160 96 L148 78 L138 96 L124 74 L112 96 L100 72 L88 96 L76 74 L62 96 L52 78 L40 96Z" fill={main} />,
    // 6 curly puff
    <path key="f6" d="M42 90 Q36 44 70 46 Q84 34 100 44 Q116 34 130 46 Q164 44 158 90 Q150 70 130 76 Q120 66 100 72 Q80 66 70 76 Q50 70 42 90Z" fill={main} />,
    // 7 long side bang
    <path key="f7" d="M40 104 Q40 46 100 46 Q158 46 158 92 Q150 70 100 72 Q64 70 56 120 Q46 112 40 104Z" fill={main} />,
    // 8 wispy small
    <path key="f8" d="M46 88 Q50 48 100 48 Q150 48 154 88 Q148 70 118 74 Q108 66 100 74 Q88 66 82 74 Q54 70 46 88Z" fill={main} />,
  ]
  return (
    <g>
      {fringes[i % fringes.length]}
      <path d="M74 52 Q100 44 126 52" fill="none" stroke={hi} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
      <path d="M60 84 Q100 74 140 84" fill="none" stroke={shade} strokeWidth={2} strokeLinecap="round" opacity={0.4} />
    </g>
  )
}

// ---- head + features ------------------------------------------------------

function Head({ i }: { i: number }) {
  // Gentle silhouette variety without ever losing the round Tomodachi feel.
  const shapes = [
    { rx: 66, ry: 70 },
    { rx: 62, ry: 74 },
    { rx: 70, ry: 68 },
    { rx: 60, ry: 72 },
    { rx: 68, ry: 72 },
    { rx: 64, ry: 76 },
    { rx: 67, ry: 67 },
    { rx: 63, ry: 71 },
  ]
  const s = shapes[i % shapes.length]
  return (
    <>
      <ellipse cx={100} cy={116} rx={s.rx} ry={s.ry} fill={SKIN} stroke={SKIN_LINE} strokeWidth={3} />
      {/* ears */}
      <ellipse cx={100 - s.rx} cy={122} rx={9} ry={12} fill={SKIN} stroke={SKIN_LINE} strokeWidth={2.5} />
      <ellipse cx={100 + s.rx} cy={122} rx={9} ry={12} fill={SKIN} stroke={SKIN_LINE} strokeWidth={2.5} />
      {/* cheeks */}
      <ellipse cx={72} cy={132} rx={11} ry={7} fill="#F7A9A0" opacity={0.55} />
      <ellipse cx={128} cy={132} rx={11} ry={7} fill="#F7A9A0" opacity={0.55} />
    </>
  )
}

function Eyes({ i }: { i: number }) {
  const styles = [
    { rx: 9, ry: 11 },
    { rx: 11, ry: 8 },
    { rx: 8, ry: 12 },
    { rx: 10, ry: 10 },
    { rx: 7, ry: 7 },
    { rx: 12, ry: 11 },
    { rx: 9, ry: 8 },
    { rx: 10, ry: 12 },
  ]
  const s = styles[i % styles.length]
  return (
    <g>
      {[74, 126].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy={116} rx={s.rx} ry={s.ry} fill="#fff" stroke={SKIN_LINE} strokeWidth={1.5} />
          <circle cx={cx} cy={117} r={Math.min(s.rx, s.ry) * 0.62} fill="#4a3b34" />
          <circle cx={cx - 2} cy={114} r={1.8} fill="#fff" />
        </g>
      ))}
    </g>
  )
}

function Eyebrows({ i }: { i: number }) {
  const rotations = [-6, 6, 0, -12, 12, -3, 3, -8]
  const r = rotations[i % rotations.length]
  return (
    <g stroke="#5c4632" strokeWidth={4} strokeLinecap="round">
      <line x1={62} y1={100} x2={86} y2={100} transform={`rotate(${r} 74 100)`} />
      <line x1={114} y1={100} x2={138} y2={100} transform={`rotate(${-r} 126 100)`} />
    </g>
  )
}

function Eyelashes({ i }: { i: number }) {
  const lengths = [0, 3, 5, 4, 6, 2, 5, 7]
  const len = lengths[i % lengths.length]
  if (len === 0) return null
  return (
    <g stroke="#3d3a38" strokeWidth={1.8} strokeLinecap="round">
      <line x1={66} y1={108} x2={66 - len * 0.5} y2={108 - len} />
      <line x1={134} y1={108} x2={134 + len * 0.5} y2={108 - len} />
    </g>
  )
}

function Nose({ i }: { i: number }) {
  const shapes = [
    <circle key={0} cx={100} cy={130} r={2.6} fill={SKIN_LINE} />,
    <path key={1} d="M97 124 Q100 134 105 134" fill="none" stroke={SKIN_LINE} strokeWidth={2.5} strokeLinecap="round" />,
    <ellipse key={2} cx={100} cy={130} rx={4} ry={2.6} fill={SKIN_LINE} />,
    <path key={3} d="M96 122 L100 134 L104 122" fill="none" stroke={SKIN_LINE} strokeWidth={2} strokeLinecap="round" />,
    <circle key={4} cx={100} cy={130} r={1.6} fill={SKIN_LINE} />,
    <path key={5} d="M98 124 Q100 132 107 132" fill="none" stroke={SKIN_LINE} strokeWidth={2.5} strokeLinecap="round" />,
    <ellipse key={6} cx={100} cy={131} rx={5} ry={3} fill={SKIN_LINE} opacity={0.7} />,
    <path key={7} d="M95 126 Q100 136 105 126" fill="none" stroke={SKIN_LINE} strokeWidth={2} strokeLinecap="round" />,
  ]
  return shapes[i % shapes.length]
}

function Mouth({ i }: { i: number }) {
  const shapes = [
    <path key={0} d="M84 148 Q100 160 116 148" fill="none" stroke="#c76a5a" strokeWidth={3.5} strokeLinecap="round" />,
    <ellipse key={1} cx={100} cy={150} rx={10} ry={7} fill="#c05a4a" />,
    <line key={2} x1={88} y1={150} x2={112} y2={150} stroke="#c76a5a" strokeWidth={3.5} strokeLinecap="round" />,
    <path key={3} d="M86 154 Q100 144 114 154" fill="none" stroke="#c76a5a" strokeWidth={3.5} strokeLinecap="round" />,
    <path key={4} d="M82 148 Q100 164 118 148 Q100 156 82 148Z" fill="#e0736a" stroke="#c05a4a" strokeWidth={2} />,
    <path key={5} d="M92 150 Q100 156 108 150" fill="none" stroke="#c76a5a" strokeWidth={3} strokeLinecap="round" />,
    <path key={6} d="M84 146 Q100 160 116 146 Q100 152 84 146Z" fill="#fff" stroke="#c76a5a" strokeWidth={2.5} />,
    <path key={7} d="M88 148 L100 156 L112 148" fill="none" stroke="#c76a5a" strokeWidth={3.5} strokeLinecap="round" />,
  ]
  return shapes[i % shapes.length]
}

function Body({ i, ci }: { i: number; ci: number }) {
  const widths = [78, 86, 94, 102, 82, 90, 98, 106]
  const w = widths[i % widths.length]
  const color = CLOTHES_COLORS[ci % CLOTHES_COLORS.length]
  const collar = ci % 3 === 0
  return (
    <g>
      {/* neck */}
      <rect x={90} y={182} width={20} height={22} rx={8} fill={SKIN} stroke={SKIN_LINE} strokeWidth={2.5} />
      {/* shoulders + shirt */}
      <path
        d={`M${100 - w / 2} 300 Q100 196 ${100 + w / 2} 300 Z`}
        fill={color}
        stroke="#0e4b69"
        strokeWidth={3}
      />
      <path d={`M${100 - w / 2} 300 Q100 196 ${100 + w / 2} 300`} fill="none" stroke="#fff" strokeWidth={1.5} opacity={0.3} />
      {collar && <path d="M84 210 L100 228 L116 210" fill="none" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" />}
    </g>
  )
}

export function AvatarPreview({ parts, size = 160, className }: { parts: EquippedParts; size?: number; className?: string }) {
  const hairI = variantIndex(parts.hair)
  const hairColors = HAIR_COLORS[variantIndex(parts.hairColor) % HAIR_COLORS.length]
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
      <HairBack i={hairI} colors={hairColors} />
      <Body i={bi} ci={ci} />
      <Head i={fi} />
      <Eyebrows i={ebi} />
      <Eyes i={ei} />
      <Eyelashes i={eli} />
      <Nose i={ni} />
      <Mouth i={mi} />
      <HairFront i={hairI} colors={hairColors} />
    </svg>
  )
}

// Small swatch used by the editor's hair-colour tab, since a colour is not a
// silhouette the AvatarPreview can show on its own.
export function HairColorSwatch({ variantId, size = 44 }: { variantId: string; size?: number }) {
  const [main, shade, hi] = HAIR_COLORS[variantIndex(variantId) % HAIR_COLORS.length]
  return (
    <svg viewBox="0 0 44 44" width={size} height={size} role="img" aria-label="かみの いろ">
      <circle cx={22} cy={22} r={18} fill={main} stroke={shade} strokeWidth={3} />
      <path d="M12 16 Q22 10 32 16" fill="none" stroke={hi} strokeWidth={3} strokeLinecap="round" />
    </svg>
  )
}
