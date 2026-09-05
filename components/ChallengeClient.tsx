'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, PartyPopper, Target } from 'lucide-react'
import { getChallenge, type ChallengeChoiceId, type ChallengeQuestion } from '@/lib/challenges'
import { refreshSave } from '@/lib/progress'
import { recordClear } from '@/app/actions/progress'
import { RealWorldScene } from '@/components/RealWorldScene'
import { ObjIcon } from '@/components/ScienceIcons'

const CHOICE_LOOK = [
  { border: '#E2596B', bg: 'linear-gradient(#fff1f2,#ffe1e5)', badge: '#E2596B', shadow: '#b8384a' },
  { border: '#3AA6A0', bg: 'linear-gradient(#ecfbf9,#d9f3f0)', badge: '#3AA6A0', shadow: '#227a75' },
  { border: '#E8B33A', bg: 'linear-gradient(#fff9e8,#fdefcd)', badge: '#E8B33A', shadow: '#b8871f' },
]
const BADGES = ['A', 'B', 'C', 'D']

function shuffled<T>(items: T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function Scenario({ q }: { q: ChallengeQuestion }) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border-4 border-white bg-white/85 p-4 shadow-[0_6px_0_rgba(14,75,105,0.2)]">
      <p className="text-center text-base font-black leading-7 text-[#3d3a38]">{q.scenario}</p>
      {q.visual ? (
        <RealWorldScene variant={q.visual} />
      ) : q.emoji ? (
        <div className="flex justify-center py-2">
          <ObjIcon emoji={q.emoji} size={72} />
        </div>
      ) : null}
    </div>
  )
}

export function ChallengeClient({ id }: { id: string }) {
  const challenge = getChallenge(id) ?? getChallenge('challenge-lever')!
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<ChallengeChoiceId | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(false)

  const q = challenge.questions[index]
  const displayChoices = useMemo(() => shuffled(q.choices), [q])
  const isLast = index === challenge.questions.length - 1

  const choose = (choiceId: ChallengeChoiceId) => {
    if (revealed) return
    setSelected(choiceId)
    if (choiceId === q.correctId) setRevealed(true)
  }

  const next = () => {
    if (isLast) {
      setDone(true)
      recordClear(challenge.id).then(refreshSave)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setRevealed(false)
  }

  return (
    <main className="min-h-[var(--stage-h)] px-4 py-5 text-foreground" style={{ background: 'linear-gradient(#e7f0fb,#d5e6f7)' }}>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <header className="flex items-center gap-3 rounded-3xl bg-gradient-to-r from-[#4E8FC5] to-[#3AA6A0] px-4 py-3 text-white shadow-[0_5px_0_rgba(14,75,105,0.3)]">
          <Link href="/challenge" className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/25" aria-label="もどる">
            <ArrowLeft />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black opacity-90">現実チャレンジ</p>
            <h1 className="truncate text-lg font-black">{challenge.title}</h1>
          </div>
        </header>

        {!done && (
          <>
            <ol className="flex items-center gap-1">
              {challenge.questions.map((_, i) => (
                <li key={i} className="h-2 flex-1 rounded-full" style={{ background: i <= index ? '#2f6fa3' : 'rgba(255,255,255,0.7)' }} />
              ))}
            </ol>

            <Scenario q={q} />

            <p className="text-balance rounded-3xl border-4 border-[#0e4b69] bg-gradient-to-b from-white to-[#f4fbfd] p-5 text-center text-lg font-black leading-relaxed text-[#3d3a38] shadow-[0_5px_0_#174d70]">
              {q.prompt}
            </p>

            <div className="flex flex-col gap-3">
              {displayChoices.map((choice, i) => {
                const look = CHOICE_LOOK[i % CHOICE_LOOK.length]
                const isSel = selected === choice.id
                const wrongSel = isSel && !revealed && selected !== q.correctId
                const rightSel = isSel && revealed
                const border = wrongSel ? '#e2596b' : rightSel ? '#3d8a3d' : look.border
                const bg = wrongSel ? 'linear-gradient(#fdeaec,#fbd8dd)' : rightSel ? 'linear-gradient(#eaf7ea,#d6f0d6)' : look.bg
                return (
                  <button
                    key={choice.id}
                    onClick={() => choose(choice.id)}
                    disabled={revealed}
                    className="flex min-h-[4.5rem] items-center gap-4 rounded-3xl border-4 px-4 text-left text-base font-black leading-snug transition active:translate-y-1 disabled:opacity-95"
                    style={{ borderColor: border, background: bg, boxShadow: `0 5px 0 ${wrongSel ? '#b8384a' : rightSel ? '#2c6b2c' : look.shadow}` }}
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full text-lg font-black text-white shadow-inner" style={{ background: border }}>
                      {BADGES[i]}
                    </span>
                    <span className="flex-1 text-[#3d3a38]">{choice.text}</span>
                  </button>
                )
              })}
            </div>

            {selected && !revealed && (
              <p className="animate-chem-fade-in rounded-2xl bg-[#fff1f2] p-3 text-center text-sm font-black text-[#c0384a]">おしい！ もう一回 考えてみよう</p>
            )}

            {revealed && (
              <div className="animate-chem-fade-in flex flex-col items-center gap-3 rounded-3xl border-4 border-[#3d8a3d] p-5 text-center shadow-[0_5px_0_rgba(14,75,105,0.2)]" style={{ background: 'linear-gradient(#f0fbef,#dcf3da)' }}>
                <span className="flex items-center gap-2 text-lg font-black text-[#3d8a3d]">
                  <Check className="size-5" /> せいかい！
                </span>
                <p className="text-sm font-bold leading-6 text-[#3d3a38]">{q.explain}</p>
                <button onClick={next} className="min-h-12 rounded-full bg-[#174d70] px-10 text-base font-black text-white shadow-[0_4px_0_#0e3450] active:translate-y-1">
                  {isLast ? 'けっかを 見る' : 'つぎへ'} <ArrowRight className="ml-1 inline size-4" />
                </button>
              </div>
            )}
          </>
        )}

        {done && (
          <section className="relative flex flex-col items-center gap-4 overflow-hidden rounded-3xl border-4 border-[#4E8FC5] bg-gradient-to-b from-[#eef6fc] to-[#d5e6f7] p-6 text-center shadow-[0_6px_0_#2f6fa3]" aria-live="polite">
            <div className="flex items-center gap-2">
              <PartyPopper className="size-8 text-[#e8b33a]" />
              <p className="text-2xl font-black text-[#2f6fa3]">チャレンジ クリア！</p>
            </div>
            <p className="rounded-2xl bg-white/85 p-4 text-base font-black leading-relaxed text-[#3d3a38]">
              みの まわりの どうぐも、学んだ しくみで 動いて いたね！
            </p>
            <div className="flex w-full gap-3">
              <Link href="/challenge" className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl border-4 border-[#0e4b69] bg-white font-black text-[#174d70] shadow-[0_4px_0_#174d70] active:translate-y-1">
                <Target className="size-4" /> ほかの チャレンジ
              </Link>
              <Link href="/" className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#4E8FC5] px-3 text-center font-black text-white shadow-[0_4px_0_#2f6fa3] active:translate-y-1">
                マップへ <ArrowRight className="size-4" />
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
