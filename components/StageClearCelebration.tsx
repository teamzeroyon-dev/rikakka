'use client'
import Link from 'next/link'
import { ArrowRight, RotateCcw, PartyPopper } from 'lucide-react'

const PARTICLES = ['#ff9040', '#4ec5c1', '#e8b33a', '#e2596b', '#3aa6a0', '#9b72cf']

export function StageClearCelebration({
  clearLine,
  next,
  onRetry,
}: {
  clearLine: string
  next: { href: string; title: string } | null
  onRetry: () => void
}) {
  return (
    <section
      className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border-4 border-[#f7c94b] bg-gradient-to-b from-[#fffdf4] to-[#fdf0cf] p-6 shadow-[0_6px_0_#d9a72c]"
      aria-live="polite"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute top-0 block size-2.5 rounded-sm opacity-90"
            style={{
              left: `${(i * 29) % 100}%`,
              backgroundColor: PARTICLES[i % PARTICLES.length],
              animation: `chem-drip ${1.2 + (i % 5) * 0.3}s ease-in ${i * 0.07}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative flex items-center justify-center gap-2">
        <PartyPopper className="size-8 text-[#e8b33a]" aria-hidden="true" />
        <p className="text-3xl font-black text-[#174d70]">ステージクリア！</p>
      </div>

      <p className="relative rounded-2xl bg-white/85 p-4 text-center text-base font-black leading-relaxed text-[#3d3a38]">
        {clearLine}
      </p>

      <div className="relative flex gap-3">
        <button
          onClick={onRetry}
          className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl border-4 border-[#0e4b69] bg-white font-black text-[#174d70] shadow-[0_4px_0_#174d70] active:translate-y-1"
        >
          <RotateCcw className="size-4" />
          もう一度
        </button>
        <Link
          href={next ? next.href : '/'}
          className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#f7c94b] px-3 text-center font-black text-[#3d3a38] shadow-[0_4px_0_#c99a1e] active:translate-y-1"
        >
          {next ? '次へ' : 'マップへ'}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}
