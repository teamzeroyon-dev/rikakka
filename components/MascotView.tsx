'use client'
import { useId } from 'react'
import { MASCOT_ART, type FieldLevel, type MascotLook } from '@/lib/mascot'

// Placeholder mascot drawn in SVG. Every layer can be swapped for hand-drawn art
// by registering it in MASCOT_ART (same 200x200 square, transparent background).

export type MascotMood = 'normal' | 'happy' | 'eat'

const INK = '#0e4b69'
const SKIN = '#fff4d6'
const SCALE = { 1: 0.7, 2: 0.86, 3: 1 } as const

function Art({ k }: { k: string }) {
  const src = MASCOT_ART[k]
  return src ? <image href={src} x={0} y={0} width={200} height={200} /> : null
}

function Background({ id, gid }: { id: string; gid: string }) {
  if (MASCOT_ART[id]) return <Art k={id} />
  switch (id) {
    case 'bg-forest':
      return (
        <g>
          <rect width={200} height={200} fill="#dff2cf" />
          {[20, 60, 150, 185].map((x, i) => (
            <g key={i}>
              <rect x={x - 4} y={110} width={8} height={40} fill="#8a5a33" />
              <circle cx={x} cy={100} r={24} fill={i % 2 ? '#6cbf5c' : '#4fa34a'} />
            </g>
          ))}
          <rect y={170} width={200} height={30} fill="#9bd27a" />
        </g>
      )
    case 'bg-sea':
      return (
        <g>
          <rect width={200} height={200} fill="#cdeefb" />
          <circle cx={165} cy={35} r={16} fill="#ffd84d" />
          <rect y={120} width={200} height={80} fill="#5fb4e0" />
          {[0, 50, 100, 150].map((x) => (
            <path key={x} d={`M${x} 130 q12 -8 25 0 t25 0`} stroke="#fff" strokeWidth={3} fill="none" />
          ))}
          <rect y={172} width={200} height={28} fill="#f3dfa8" />
        </g>
      )
    case 'bg-lab':
      return (
        <g>
          <rect width={200} height={200} fill="#f4ede0" />
          <rect x={10} y={60} width={180} height={6} fill="#b98b5a" />
          <path d="M30 40 h10 v8 l8 12 h-26 l8 -12z" fill="#7fd3c9" stroke={INK} strokeWidth={2} />
          <rect x={150} y={36} width={10} height={24} rx={3} fill="#f2a6c0" stroke={INK} strokeWidth={2} />
          <rect x={166} y={42} width={10} height={18} rx={3} fill="#f7c94b" stroke={INK} strokeWidth={2} />
          <rect y={172} width={200} height={28} fill="#d9cbb2" />
        </g>
      )
    case 'bg-space':
      return (
        <g>
          <rect width={200} height={200} fill="#1d2550" />
          {[[20, 30], [60, 15], [140, 25], [180, 60], [30, 90], [170, 120], [100, 40]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 ? 1.5 : 2.5} fill="#fff" />
          ))}
          <circle cx={160} cy={40} r={14} fill="#e9a35f" />
          <ellipse cx={160} cy={40} rx={24} ry={5} fill="none" stroke="#f7d79a" strokeWidth={2} />
          <rect y={172} width={200} height={28} fill="#8c8fa8" />
        </g>
      )
    default:
      return (
        <g>
          <rect width={200} height={200} fill={`url(#${gid}-sky)`} />
          <g fill="#fff" opacity={0.9}>
            <ellipse cx={40} cy={40} rx={22} ry={10} />
            <ellipse cx={160} cy={60} rx={26} ry={11} />
          </g>
          <rect y={172} width={200} height={28} fill="#a9d98a" />
        </g>
      )
  }
}

function Arm({ side, level }: { side: 1 | -1; level: FieldLevel }) {
  // Flexed arm: shoulder → elbow → fist, bicep grows with level.
  const sx = 100 - side * 52
  const ex = 100 - side * (70 + level * 4)
  const d = `M${sx} 135 L${ex} 128 L${ex + side * 4} ${100 - level * 4}`
  const bicep = 4 + level * 4
  return (
    <g>
      <path d={d} stroke={INK} strokeWidth={14 + level * 2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={d} stroke={SKIN} strokeWidth={8 + level * 2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={(sx + ex) / 2} cy={128} r={bicep} fill={SKIN} stroke={INK} strokeWidth={3} />
      <circle cx={ex + side * 4} cy={98 - level * 4} r={7 + level} fill={SKIN} stroke={INK} strokeWidth={3} />
    </g>
  )
}

// Arms sit behind the body; the level-3 headband goes in front of it.
function Butsuri({ level, layer }: { level: FieldLevel; layer: 'back' | 'front' }) {
  if (MASCOT_ART[`butsuri-${level}`]) return layer === 'front' ? <Art k={`butsuri-${level}`} /> : null
  if (layer === 'back') {
    return (
      <g>
        <Arm side={1} level={level} />
        <Arm side={-1} level={level} />
      </g>
    )
  }
  if (level < 3) return null
  return (
    <g>
      <path d="M58 96 Q100 82 142 96" stroke="#e0483e" strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d="M142 96 l14 -8 M142 96 l14 6" stroke="#e0483e" strokeWidth={5} strokeLinecap="round" />
    </g>
  )
}

function Kagaku({ level, layer }: { level: FieldLevel; layer: 'back' | 'front' }) {
  if (layer === 'back') return level >= 3 && !MASCOT_ART[`kagaku-${level}`] ? <ellipse cx={100} cy={130} rx={72} ry={64} fill="#7fd3c9" opacity={0.25} className="msc-pulse" /> : null
  if (MASCOT_ART[`kagaku-${level}`]) return <Art k={`kagaku-${level}`} />
  const bubbles = level >= 3 ? [[150, 70, 5], [160, 52, 4], [146, 38, 6], [56, 60, 4]] : level >= 2 ? [[150, 70, 5], [160, 52, 4], [146, 38, 6]] : []
  return (
    <g>
      <path d="M50 96 Q100 84 150 96" stroke={INK} strokeWidth={5} fill="none" />
      {[84, 116].map((x) => (
        <circle key={x} cx={x} cy={92} r={11} fill="#bff0ea" stroke={INK} strokeWidth={4} />
      ))}
      {bubbles.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#bff0ea" stroke={INK} strokeWidth={2} className="msc-bubble" style={{ animationDelay: `${i * 0.5}s` }} />
      ))}
    </g>
  )
}

function Chigaku({ level, gid }: { level: FieldLevel; gid: string }) {
  if (MASCOT_ART[`chigaku-${level}`]) return <Art k={`chigaku-${level}`} />
  return (
    <g>
      {level === 1 && <ellipse cx={124} cy={76} rx={10} ry={7} fill="#a8a29a" stroke={INK} strokeWidth={3} />}
      {level >= 2 && (
        <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
          <path d="M116 80 l4 -22 l8 22z" fill="#b99cf0" />
          <path d="M126 80 l6 -14 l6 14z" fill="#d9c7ff" />
          <path d="M108 80 l3 -12 l5 12z" fill="#d9c7ff" />
        </g>
      )}
      {level >= 3 && (
        <g className="msc-orbit" style={{ transformOrigin: '100px 128px' }}>
          <circle cx={30} cy={128} r={7} fill="#ffd84d" stroke={INK} strokeWidth={2} />
          <circle cx={170} cy={128} r={5} fill={`url(#${gid}-planet)`} stroke={INK} strokeWidth={2} />
        </g>
      )}
    </g>
  )
}

function Seibutsu({ level }: { level: FieldLevel }) {
  if (MASCOT_ART[`seibutsu-${level}`]) return <Art k={`seibutsu-${level}`} />
  return (
    <g>
      {level >= 2 && (
        <g fill="#7cc46a" opacity={0.85}>
          <ellipse cx={70} cy={152} rx={12} ry={7} />
          <ellipse cx={132} cy={160} rx={10} ry={6} />
          <ellipse cx={112} cy={98} rx={8} ry={5} />
          {level >= 3 && <ellipse cx={60} cy={118} rx={8} ry={6} />}
        </g>
      )}
      <g className="msc-sway" style={{ transformOrigin: '80px 78px' }}>
        <path d="M80 78 q-2 -14 2 -22" stroke="#3f8f3a" strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M82 60 q-14 -8 -18 2 q10 6 18 -2z" fill="#6cbf5c" stroke={INK} strokeWidth={2} />
        <path d="M82 60 q12 -12 18 -2 q-8 8 -18 2z" fill="#6cbf5c" stroke={INK} strokeWidth={2} />
        {level >= 3 && (
          <g>
            {[0, 72, 144, 216, 288].map((a) => (
              <circle key={a} cx={82 + 6 * Math.cos((a * Math.PI) / 180)} cy={52 + 6 * Math.sin((a * Math.PI) / 180)} r={4} fill="#ff9fc0" />
            ))}
            <circle cx={82} cy={52} r={3} fill="#ffd84d" />
          </g>
        )}
      </g>
      {level >= 2 && (
        <g stroke="#3f8f3a" strokeWidth={3} strokeLinecap="round">
          <path d="M58 180 l-4 -10 M62 180 l0 -12 M66 180 l4 -10" />
          <path d="M136 180 l-4 -10 M140 180 l0 -12 M144 180 l4 -10" />
        </g>
      )}
    </g>
  )
}

function Accessory({ id }: { id: string }) {
  if (MASCOT_ART[id]) return <Art k={id} />
  switch (id) {
    case 'acc-ribbon':
      return (
        <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
          <path d="M138 88 l-14 -10 v20z" fill="#f27aa0" />
          <path d="M138 88 l14 -10 v20z" fill="#f27aa0" />
          <circle cx={138} cy={88} r={4} fill="#ffd0df" />
        </g>
      )
    case 'acc-cap':
      return (
        <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
          <path d="M70 84 q30 -34 60 0z" fill="#4e8fc5" />
          <path d="M126 84 h26 q-6 -8 -26 -6z" fill="#3a6f9e" />
        </g>
      )
    case 'acc-glasses':
      return (
        <g stroke={INK} strokeWidth={3} fill="none">
          <circle cx={82} cy={118} r={11} />
          <circle cx={118} cy={118} r={11} />
          <path d="M93 118 h14" />
        </g>
      )
    case 'acc-crown':
      return <path d="M78 80 l4 -22 l10 12 l8 -16 l8 16 l10 -12 l4 22z" fill="#ffd84d" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    default:
      return null
  }
}

function Body({ stage, mood }: { stage: 1 | 2 | 3; mood: MascotMood }) {
  if (MASCOT_ART[`body-${stage}`]) return <Art k={`body-${stage}`} />
  return (
    <g>
      {stage >= 3 && (
        <g fill={SKIN} stroke={INK} strokeWidth={4}>
          <ellipse cx={80} cy={176} rx={14} ry={7} />
          <ellipse cx={120} cy={176} rx={14} ry={7} />
        </g>
      )}
      <path d="M100 76 C142 76 160 110 158 140 C156 168 132 178 100 178 C68 178 44 168 42 140 C40 110 58 76 100 76z" fill={SKIN} stroke={INK} strokeWidth={4} />
      {stage >= 2 && (
        <g fill="#ffb3c4" opacity={0.8}>
          <ellipse cx={68} cy={134} rx={9} ry={5} />
          <ellipse cx={132} cy={134} rx={9} ry={5} />
        </g>
      )}
      {mood === 'happy' ? (
        <g stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round">
          <path d="M74 120 q8 -10 16 0" />
          <path d="M110 120 q8 -10 16 0" />
        </g>
      ) : (
        <g>
          <circle cx={82} cy={118} r={7} fill={INK} />
          <circle cx={118} cy={118} r={7} fill={INK} />
          <circle cx={84} cy={115} r={2.5} fill="#fff" />
          <circle cx={120} cy={115} r={2.5} fill="#fff" />
        </g>
      )}
      {mood === 'eat' ? (
        <ellipse cx={100} cy={140} rx={8} ry={9} fill="#c2405a" stroke={INK} strokeWidth={3} className="msc-chomp" />
      ) : (
        <path d="M92 136 q8 8 16 0" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
      )}
    </g>
  )
}

export function MascotView({
  look,
  background,
  accessory = 'acc-none',
  mood = 'normal',
  size = 200,
  className,
}: {
  look: MascotLook
  background?: string
  accessory?: string
  mood?: MascotMood
  size?: number
  className?: string
}) {
  const gid = useId().replace(/:/g, '')
  const s = SCALE[look.body]
  const f = look.fields
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} role="img" aria-label="マスコット">
      <defs>
        <linearGradient id={`${gid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe6f7" />
          <stop offset="1" stopColor="#eaf7fc" />
        </linearGradient>
        <radialGradient id={`${gid}-planet`}>
          <stop offset="0" stopColor="#9fd0ff" />
          <stop offset="1" stopColor="#4e8fc5" />
        </radialGradient>
        <style>{`
          .msc-idle{animation:msc-bob 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center bottom}
          .msc-bubble{animation:msc-rise 2s ease-in infinite}
          .msc-orbit{animation:msc-spin 6s linear infinite}
          .msc-sway{animation:msc-sway 2.8s ease-in-out infinite}
          .msc-pulse{animation:msc-pulse 2s ease-in-out infinite}
          .msc-chomp{animation:msc-chomp .25s ease-in-out infinite alternate}
          @keyframes msc-bob{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(-3px) scaleY(1.02)}}
          @keyframes msc-rise{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-24px);opacity:0}}
          @keyframes msc-spin{to{transform:rotate(360deg)}}
          @keyframes msc-sway{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}
          @keyframes msc-pulse{0%,100%{opacity:.15}50%{opacity:.35}}
          @keyframes msc-chomp{to{transform:scaleY(.3);transform-box:fill-box;transform-origin:center}}
          @media (prefers-reduced-motion:reduce){.msc-idle,.msc-bubble,.msc-orbit,.msc-sway,.msc-pulse,.msc-chomp{animation:none}}
        `}</style>
      </defs>
      {background && <Background id={background} gid={gid} />}
      <ellipse cx={100} cy={180} rx={56 * s} ry={7 * s} fill="#000" opacity={0.12} />
      <g transform={`translate(100 180) scale(${s}) translate(-100 -180)`}>
        <g className="msc-idle">
          {f.kagaku > 0 && <Kagaku level={f.kagaku} layer="back" />}
          {f.butsuri > 0 && <Butsuri level={f.butsuri} layer="back" />}
          <Body stage={look.body} mood={mood} />
          {f.butsuri > 0 && <Butsuri level={f.butsuri} layer="front" />}
          {f.seibutsu > 0 && <Seibutsu level={f.seibutsu} />}
          {f.chigaku > 0 && <Chigaku level={f.chigaku} gid={gid} />}
          {f.kagaku > 0 && <Kagaku level={f.kagaku} layer="front" />}
          <Accessory id={accessory} />
        </g>
      </g>
    </svg>
  )
}

