'use client'
import Link from 'next/link'
import { RotateCcw, ArrowRight } from 'lucide-react'
import type { Problem } from '@/lib/problems'
export function SolvedOverlay({ problem, next, onRetry }: { problem: Problem; next: Problem; onRetry: () => void }) {
 return <section className="flex flex-col gap-5 rounded-3xl border border-primary/20 bg-card p-6 shadow-lg" aria-live="polite">
  <div><p className="text-2xl font-bold text-primary">つりあった！</p><p className="mt-1 text-sm text-muted-foreground">よく見つけたね。</p></div>
  <div className="flex flex-col gap-2"><p className="text-sm font-bold text-muted-foreground">きみが 見つけたこと</p><p className="leading-6">{problem.solved.discovery}</p><p className="rounded-xl bg-accent p-3 font-sans text-sm font-bold">{problem.solved.formula}</p>{problem.solved.note && <p className="text-sm leading-6 text-muted-foreground">{problem.solved.note}</p>}</div>
  <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-4"><p className="font-bold text-secondary-foreground">これ、どこで つかわれてる？</p><p className="text-sm leading-6 text-secondary-foreground/80">{problem.solved.realWorldBody}</p></div>
  <div className="flex gap-3"><button onClick={onRetry} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-border font-bold"><RotateCcw className="size-4" />もういちど</button><Link href={`/q/${next.id}`} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-center font-bold text-primary-foreground">つぎへ<ArrowRight className="size-4" /></Link></div>
 </section>
}
