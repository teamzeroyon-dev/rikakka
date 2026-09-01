'use client'
import Link from 'next/link'
import { problems } from '@/lib/problems'
import { useSave } from '@/lib/progress'

export function BagClient() {
  const { save } = useSave()
  const cleared = problems.filter((p) => save.cleared[p.id])
  return (
    <main className="min-h-screen bg-background px-5 py-6">
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm font-bold">
            ← もどる
          </Link>
          <span className="font-bold"> {save.points}</span>
        </div>
        <h1 className="text-3xl font-bold"> もちもの</h1>
        <div className="flex gap-2 rounded-2xl bg-muted p-1">
          <button className="flex-1 rounded-xl bg-card py-3 text-sm font-bold">ずかん</button>
          <button className="flex-1 rounded-xl py-3 text-sm font-bold text-muted-foreground">みため</button>
          <button className="flex-1 rounded-xl py-3 text-sm font-bold text-muted-foreground">きろく</button>
        </div>
        <section className="flex flex-col gap-3">
          {problems.map((p) => (
            <article key={p.id} className="flex items-center gap-4 rounded-3xl border border-border bg-card p-4">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-lg font-black">{save.cleared[p.id] ? '済' : '？'}</span>
              <div className="flex-1">
                <h2 className="font-bold">{save.cleared[p.id] ? p.title : 'まだの ずかんカード'}</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  {save.cleared[p.id] ? p.solved.realWorldBody : 'カードを ひらいてみよう'}
                </p>
              </div>
              {save.cleared[p.id] && (
                <button className="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">くわしく 5</button>
              )}
            </article>
          ))}
        </section>
        <p className="text-center text-sm text-muted-foreground">
          クリアしたカード {cleared.length} / {problems.length}
        </p>
        <Link
          href="/diagnosis"
          className="rounded-2xl border border-border bg-card px-4 py-4 text-center font-bold shadow-sm"
        >
           きみの きょうみ診断を みる
        </Link>
      </div>
    </main>
  )
}
