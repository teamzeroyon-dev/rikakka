'use client'
import Link from 'next/link'
import { ArrowLeft, Check, Sparkles } from 'lucide-react'
import { problems } from '@/lib/problems'
import { chemStages } from '@/lib/quizProblems'
import { scienceStages } from '@/lib/scienceStages'
import { useSave } from '@/lib/progress'

type Card = { id: string; title: string }
type Group = { key: string; label: string; color: string; bg: string; cards: Card[] }

// All stages across every subject, grouped — so cleared records from chem /
// earth / bio show up here too (not just physics).
const GROUPS: Group[] = [
  { key: 'butsuri', label: '物理岡', color: '#FF9040', bg: 'linear-gradient(#fff1e6,#ffe0c7)', cards: problems.map((p) => ({ id: p.id, title: p.title })) },
  { key: 'kagaku', label: '化学海岸', color: '#3AA6A0', bg: 'linear-gradient(#e6f7f5,#d3f0ec)', cards: chemStages.map((s) => ({ id: s.id, title: s.title })) },
  { key: 'chigaku', label: '地学山', color: '#C07A3E', bg: 'linear-gradient(#fbecd8,#f6dcbb)', cards: scienceStages.filter((s) => s.regionId === 'chigaku').map((s) => ({ id: s.id, title: s.title })) },
  { key: 'seibutsu', label: '生物森', color: '#5FB85F', bg: 'linear-gradient(#e9f7e0,#d6efc7)', cards: scienceStages.filter((s) => s.regionId === 'seibutsu').map((s) => ({ id: s.id, title: s.title })) },
]

export function BagClient() {
  const { save } = useSave()
  const allCards = GROUPS.flatMap((g) => g.cards)
  const clearedCount = allCards.filter((c) => save.cleared[c.id]).length

  return (
    <main className="min-h-[var(--stage-h)] px-4 py-5 text-foreground" style={{ background: 'linear-gradient(#eef4f7,#dceaf0)' }}>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <header className="flex items-center gap-3 rounded-3xl bg-gradient-to-r from-[#286b8e] to-[#3AA6A0] px-4 py-3 text-white shadow-[0_5px_0_#174d70]">
          <Link href="/" className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/25" aria-label="もどる">
            <ArrowLeft />
          </Link>
          <h1 className="flex-1 text-lg font-black">もちもの ずかん</h1>
          <span className="flex items-center gap-1 rounded-full bg-white/25 px-3 py-1 text-sm font-black">
            <Sparkles className="size-4" /> {save.points}
          </span>
        </header>

        <div className="rounded-3xl border-4 border-white bg-white/85 p-4 text-center shadow-[0_5px_0_rgba(14,75,105,0.15)]">
          <p className="text-sm font-bold text-[#8a8478]">あつめた ずかんカード</p>
          <p className="text-3xl font-black text-[#174d70]">
            {clearedCount} <span className="text-lg text-[#8a8478]">/ {allCards.length}</span>
          </p>
        </div>

        {GROUPS.map((g) => {
          const cleared = g.cards.filter((c) => save.cleared[c.id]).length
          return (
            <section key={g.key} className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <h2 className="flex items-center gap-2 text-sm font-black text-[#3d3a38]">
                  <span className="size-3 rounded-full" style={{ background: g.color }} /> {g.label}
                </h2>
                <span className="text-xs font-black text-[#8a8478]">{cleared} / {g.cards.length}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {g.cards.map((c) => {
                  const rec = save.cleared[c.id]
                  const done = Boolean(rec)
                  return (
                    <div
                      key={c.id}
                      className="flex items-center gap-2 rounded-2xl border-2 p-2.5"
                      style={{ borderColor: done ? g.color : '#e4dfce', background: done ? g.bg : '#f7f5ef' }}
                    >
                      <span
                        className="flex size-8 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
                        style={{ background: done ? g.color : '#c9c4b6' }}
                      >
                        {done ? <Check className="size-4" /> : '？'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-black text-[#3d3a38]">{done ? c.title : 'まだの カード'}</p>
                        {done && rec && typeof rec === 'object' && 'count' in rec && (rec as { count: number }).count > 1 && (
                          <p className="text-[10px] font-bold text-[#8a8478]">{(rec as { count: number }).count}回 クリア</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
