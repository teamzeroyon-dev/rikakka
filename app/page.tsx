'use client'

import Link from 'next/link'
import { Check, ChevronRight, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { problems } from '@/lib/problems'
import { getSolvedIds } from '@/lib/progress'

export default function Home() {
  const [solved, setSolved] = useState<string[]>([])
  useEffect(() => setSolved(getSolvedIds()), [])
  return <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
      <header className="flex flex-col gap-3 pt-2">
        <div className="flex items-center gap-2 text-sm font-bold text-primary"><Sparkles className="size-4" /> さわって わかる</div>
        <h1 className="text-balance font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl">さんすう・りか</h1>
        <p className="text-pretty text-base leading-6 text-muted-foreground">おもりを動かして、てこの ひみつを 見つけよう。</p>
      </header>
      <section aria-labelledby="problem-list" className="flex flex-col gap-4">
        <h2 id="problem-list" className="text-sm font-bold text-muted-foreground">もんだいを えらぶ</h2>
        <div className="flex flex-col gap-4">
          {problems.map((problem) => <Link key={problem.id} href={`/q/${problem.id}`} className="group relative flex items-center gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-3xl" aria-hidden="true">{problem.emoji}</span>
            <span className="flex min-w-0 flex-1 flex-col gap-1"><span className="text-lg font-bold">{problem.title}</span><span className="text-sm leading-6 text-muted-foreground">{problem.difficultyLabel}</span></span>
            {solved.includes(problem.id) && <Check className="size-5 text-primary" aria-label="クリアずみ" />}
            <ChevronRight className="size-5 text-muted-foreground transition group-hover:translate-x-1" aria-hidden="true" />
          </Link>)}
        </div>
      </section>
      <p className="pb-4 text-center text-xs leading-5 text-muted-foreground">せいかい・まちがいは ありません。<br />じぶんで ためして、見つけてみよう。</p>
    </div>
  </main>
}
