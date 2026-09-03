export type RealWorldVisual = 'seesaw' | 'nail-puller' | 'scale' | 'slingshot' | 'archery'

function Sky() {
  return (
    <>
      <rect x="0" y="0" width="320" height="150" fill="var(--scene-sky)" />
      <rect x="0" y="150" width="320" height="30" fill="var(--scene-ground)" />
      <rect x="0" y="150" width="320" height="6" fill="var(--scene-ground-dark)" />
    </>
  )
}

function Seesaw() {
  return (
    <svg viewBox="0 0 320 180" className="block w-full" role="img" aria-label="シーソーが上下に動くアニメーション">
      <Sky />
      <path d="M144 156 L176 156 L166 128 L154 128 Z" fill="var(--scene-wood-dark)" />
      <g className="animate-rws-seesaw" style={{ transformOrigin: '160px 128px' }}>
        <rect x="60" y="124" width="200" height="10" rx="5" fill="var(--scene-wood)" />
        <g transform="translate(78 90)">
          <circle cx="0" cy="10" r="10" fill="var(--scene-figure-a)" />
          <rect x="-8" y="18" width="16" height="16" rx="4" fill="var(--scene-figure-a)" />
        </g>
        <g transform="translate(240 90)">
          <circle cx="0" cy="10" r="10" fill="var(--scene-figure-b)" />
          <rect x="-8" y="18" width="16" height="16" rx="4" fill="var(--scene-figure-b)" />
        </g>
      </g>
      <circle cx="160" cy="128" r="6" fill="var(--scene-metal-dark)" />
    </svg>
  )
}

function NailPuller() {
  return (
    <svg viewBox="0 0 320 180" className="block w-full" role="img" aria-label="くぎ抜きが釘を持ち上げるアニメーション">
      <Sky />
      <rect x="90" y="140" width="140" height="24" rx="4" fill="var(--scene-wood)" />
      <g transform="translate(160 140)">
        <rect x="-4" y="-30" width="8" height="30" fill="var(--scene-metal)" className="animate-rws-nail-pop" />
        <rect x="-9" y="-36" width="18" height="8" rx="2" fill="var(--scene-metal-dark)" className="animate-rws-nail-pop" />
      </g>
      <g transform="translate(160 120)" className="animate-rws-lever-arm">
        <rect x="-6" y="-70" width="12" height="76" rx="4" fill="var(--scene-figure-a)" />
        <path d="M-6 -70 Q-20 -78 -14 -60 L-2 -66 Z" fill="var(--scene-figure-a)" />
      </g>
      <rect x="150" y="118" width="20" height="10" rx="3" fill="var(--scene-metal-dark)" />
    </svg>
  )
}

function Scale() {
  return (
    <svg viewBox="0 0 320 180" className="block w-full" role="img" aria-label="天秤が左右に揺れるアニメーション">
      <Sky />
      <rect x="155" y="60" width="10" height="90" fill="var(--scene-metal-dark)" />
      <path d="M140 150 L180 150 L172 160 L148 160 Z" fill="var(--scene-metal-dark)" />
      <g className="animate-rws-scale-tilt" style={{ transformOrigin: '160px 62px' }}>
        <rect x="90" y="58" width="140" height="6" rx="3" fill="var(--scene-metal)" />
        <line x1="100" y1="62" x2="100" y2="96" stroke="var(--scene-metal)" strokeWidth="3" />
        <line x1="220" y1="62" x2="220" y2="96" stroke="var(--scene-metal)" strokeWidth="3" />
        <path d="M82 96 L118 96 L112 112 L88 112 Z" fill="var(--scene-figure-b)" />
        <path d="M202 96 L238 96 L232 112 L208 112 Z" fill="var(--scene-figure-a)" />
        <circle cx="160" cy="60" r="6" fill="var(--scene-metal-dark)" />
      </g>
    </svg>
  )
}

function Slingshot() {
  return (
    <svg viewBox="0 0 320 180" className="block w-full overflow-hidden" role="img" aria-label="ゴムが伸びて石が飛んでいくアニメーション">
      <Sky />
      <path d="M70 160 L70 90 L58 60 M70 90 L82 60" stroke="var(--scene-wood-dark)" strokeWidth="8" fill="none" strokeLinecap="round" />
      <g className="animate-rws-sling-pull">
        <line x1="58" y1="60" x2="90" y2="112" stroke="var(--scene-metal)" strokeWidth="3" />
        <line x1="82" y1="60" x2="90" y2="112" stroke="var(--scene-metal)" strokeWidth="3" />
        <circle cx="90" cy="112" r="10" fill="var(--scene-accent)" />
      </g>
      <circle className="animate-rws-sling-fly" cx="90" cy="112" r="8" fill="var(--scene-accent)" />
    </svg>
  )
}

function Archery() {
  return (
    <svg viewBox="0 0 320 180" className="block w-full overflow-hidden" role="img" aria-label="弓の矢が飛んでいくアニメーション">
      <Sky />
      <g className="animate-rws-bow-cycle" style={{ transformOrigin: '86px 90px' }}>
        <path d="M92 30 Q28 90 92 150" stroke="var(--scene-wood-dark)" strokeWidth="10" fill="none" strokeLinecap="round" />
        <g className="animate-rws-bow-string" style={{ transformOrigin: '92px 90px' }}>
          <path d="M92 30 L136 90 L92 150" stroke="var(--scene-metal)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <line x1="92" y1="90" x2="166" y2="90" stroke="var(--scene-wood)" strokeWidth="4" strokeLinecap="round" />
          <path d="M166 90 L154 84 L154 96 Z" fill="var(--scene-accent)" />
        </g>
      </g>
      <g className="animate-rws-arrow-fly">
        <line x1="92" y1="90" x2="166" y2="90" stroke="var(--scene-wood)" strokeWidth="4" strokeLinecap="round" />
        <path d="M166 90 L154 84 L154 96 Z" fill="var(--scene-accent)" />
      </g>
      <circle cx="270" cy="90" r="18" fill="none" stroke="var(--scene-accent)" strokeWidth="4" />
      <circle cx="270" cy="90" r="8" fill="var(--scene-accent)" />
    </svg>
  )
}

export function RealWorldScene({ variant }: { variant: RealWorldVisual }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      {variant === 'seesaw' && <Seesaw />}
      {variant === 'nail-puller' && <NailPuller />}
      {variant === 'scale' && <Scale />}
      {variant === 'slingshot' && <Slingshot />}
      {variant === 'archery' && <Archery />}
    </div>
  )
}
