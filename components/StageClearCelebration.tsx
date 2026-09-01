'use client'
import Link from 'next/link'
import { ArrowRight, RotateCcw, PartyPopper } from 'lucide-react'
import type { ChemStage } from '@/lib/quizProblems'

const PARTICLES = ['#ff9040', '#4ec5c1', '#e8b33a', '#e2596b', '#3aa6a0']

export function StageClearCelebration({ stage, next, onRetry }: { stage: ChemStage; next: ChemStage | null; onRetry: () => void }) {
  return (
    <section className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-primary/20 bg-card p-6 shadow-lg" aria-live="polite">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="absolute top-0 block size-2 rounded-full opacity-80"
            style={{
              left: `${(i * 37) % 100}%`,
              backgroundColor: PARTICLES[i % PARTICLES.length],
              animation: `chem-drip ${1.2 + (i % 5) * 0.3}s ease-in ${i * 0.08}s infinite`,
            }}
          />
        ))}
      </div>
      <div className="relative flex items-center gap-2">
        <PartyPopper className="size-7 text-[#e8b33a]" aria-hidden="true" />
        <p className="text-2xl font-black text-primary">ステージクリア！</p>
      </div>
      <p className="relative leading-relaxed">{stage.clearLine}</p>
      <div className="relative flex gap-3">
        <button onClick={onRetry} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-border font-bold">
          <RotateCcw className="size-4" />
          もう一度
        </button>
        {next ? (
          <Link href={`/chem/${next.id}`} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-center font-bold text-primary-foreground">
            次へ
            <ArrowRight className="size-4" />
          </Link>
        ) : (
          <Link href="/" className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-center font-bold text-primary-foreground">
            マップへ
            <ArrowRight className="size-4" />
          </Link>
        )}
      </div>
    </section>
  )
}
