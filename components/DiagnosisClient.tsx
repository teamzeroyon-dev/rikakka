'use client'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { useSave } from '@/lib/progress'
import { computeDiagnosis, THEME_INFO } from '@/lib/diagnosis'

export function DiagnosisClient() {
  const { save } = useSave()
  const result = computeDiagnosis(save.cleared)
  const top = result.topArchetype ? THEME_INFO[result.topArchetype] : null

  return (
    <main className="min-h-screen bg-background px-5 py-6 text-foreground">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
        <header className="flex items-center gap-3">
          <Link href="/bag" className="flex size-12 items-center justify-center rounded-lg border border-border" aria-label="もどる">
            <ArrowLeft />
          </Link>
          <h1 className="text-xl font-bold"> きょうみ診断</h1>
        </header>

        {result.totalCleared === 0 ? (
          <p className="rounded-2xl bg-card p-6 text-center leading-6 shadow-sm">
            まだ カードが ないよ。問題を クリアして、きみの きょうみを 見つけよう！
          </p>
        ) : (
          <>
            <section className="flex flex-col items-center gap-3 rounded-3xl border border-primary bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground">きみは...</p>
              <h2 className="text-2xl font-black text-primary">{top?.job}</h2>
              <p className="text-sm leading-6">{top?.jobDesc}</p>
            </section>

            <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                <Sparkles className="size-4" /> 分野の わりあい（クリアした {result.totalCleared} 問から）
              </h3>
              {result.ratios.map((r) => (
                <div key={r.archetype} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span>
                      {r.label}
                    </span>
                    <span>
                      {r.count}問 ({r.percent}%)
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${r.percent}%` }} />
                  </div>
                </div>
              ))}
            </section>

            <p className="text-center text-xs text-muted-foreground">
              もっと いろいろな 問題を クリアすると、診断の けっかも かわるよ
            </p>
          </>
        )}
      </div>
    </main>
  )
}
