'use client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// Every stage screen (chem / chigaku / seibutsu) shares this frame so the three
// regions feel like one game: a coloured sky behind the whole page, a chunky
// title bar, and a step tracker telling the child where they are.
const THEMES = {
  kagaku: { page: 'linear-gradient(#dff2f7,#c9e8f2)', bar: 'linear-gradient(90deg,#3AA6A0,#4E8FC5)', shadow: '#227a75' },
  chigaku: { page: 'linear-gradient(#fbecd8,#f6dcbb)', bar: 'linear-gradient(90deg,#C07A3E,#E8B33A)', shadow: '#93571f' },
  seibutsu: { page: 'linear-gradient(#e4f6da,#d0eec2)', bar: 'linear-gradient(90deg,#5FB85F,#3AA6A0)', shadow: '#3c8b3c' },
} as const

export type StageTheme = keyof typeof THEMES

const STEPS = [
  { key: 'experiment', label: 'じっけん' },
  { key: 'learn', label: 'わかったこと' },
  { key: 'quiz', label: 'もんだい' },
  { key: 'clear', label: 'クリア' },
]

export function StageShell({
  title,
  badge,
  theme,
  phase,
  children,
}: {
  title: string
  badge: string
  theme: StageTheme
  phase: string
  children: React.ReactNode
}) {
  const look = THEMES[theme]
  const activeIndex = STEPS.findIndex((s) => s.key === phase)

  return (
    <main className="min-h-[var(--stage-h)] px-4 py-5 text-foreground" style={{ background: look.page }}>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <header
          className="flex items-center gap-3 rounded-3xl px-4 py-3 text-white shadow-[0_5px_0_rgba(14,75,105,0.3)]"
          style={{ background: look.bar }}
        >
          <Link
            href="/"
            className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/25"
            aria-label="マップへ もどる"
          >
            <ArrowLeft />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black opacity-90">{badge}</p>
            <h1 className="truncate text-lg font-black">{title}</h1>
          </div>
        </header>

        <ol className="flex items-center gap-1">
          {STEPS.map((step, i) => (
            <li key={step.key} className="flex flex-1 flex-col items-center gap-1">
              <span
                className="h-2 w-full rounded-full"
                style={{ background: i <= activeIndex ? look.shadow : 'rgba(255,255,255,0.65)' }}
              />
              <span className={`text-[10px] font-black ${i <= activeIndex ? 'text-[#3d3a38]' : 'text-[#3d3a38]/45'}`}>
                {step.label}
              </span>
            </li>
          ))}
        </ol>

        {children}
      </div>
    </main>
  )
}

export function LearnCard({
  icon,
  line,
  children,
}: {
  icon: React.ReactNode
  line: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border-4 border-[#f7c94b] bg-gradient-to-b from-white to-[#fffaec] p-6 shadow-[0_6px_0_#d9a72c]">
      <div className="flex items-center gap-2 text-[#c99a1e]">
        {icon}
        <p className="font-black">わかったこと</p>
      </div>
      <p className="text-base font-black leading-8 text-[#3d3a38]">{line}</p>
      {children}
    </div>
  )
}
