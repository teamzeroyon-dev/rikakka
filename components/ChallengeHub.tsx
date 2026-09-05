'use client'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Target } from 'lucide-react'
import { challenges } from '@/lib/challenges'
import { useSave } from '@/lib/progress'
import { RealWorldScene } from '@/components/RealWorldScene'

// Separate section listing the real-world challenges (physics prototype).
export function ChallengeHub() {
  const { save } = useSave()

  return (
    <main className="min-h-[var(--stage-h)] px-4 py-5 text-foreground" style={{ background: 'linear-gradient(#e7f0fb,#d5e6f7)' }}>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <header className="flex items-center gap-3 rounded-3xl bg-gradient-to-r from-[#4E8FC5] to-[#3AA6A0] px-4 py-3 text-white shadow-[0_5px_0_rgba(14,75,105,0.3)]">
          <Link href="/" className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/25" aria-label="マップへ もどる">
            <ArrowLeft />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-[11px] font-black opacity-90">
              <Target className="size-3.5" /> みの まわりで ためそう
            </p>
            <h1 className="truncate text-lg font-black">現実チャレンジ</h1>
          </div>
        </header>

        <p className="rounded-2xl bg-white/80 p-4 text-center text-sm font-black leading-6 text-[#3d3a38]">
          学んだ しくみが、じっさいの どうぐで どう つかわれて いるか ためそう！
        </p>

        <div className="flex flex-col gap-3">
          {challenges.map((c) => {
            const cleared = Boolean(save.cleared[c.id])
            const preview = c.questions.find((q) => q.visual)?.visual
            return (
              <Link
                key={c.id}
                href={`/challenge/${c.id}`}
                className="flex flex-col gap-3 rounded-3xl border-4 border-white bg-white/90 p-4 shadow-[0_6px_0_rgba(14,75,105,0.2)] active:translate-y-0.5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#4E8FC5] text-white">
                    <Target className="size-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-black text-[#3d3a38]">{c.title}</h2>
                    <p className="text-xs font-bold text-[#8a8478]">{c.intro}</p>
                  </div>
                  {cleared ? (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#3d8a3d] text-white">
                      <Check className="size-5" />
                    </span>
                  ) : (
                    <ArrowRight className="size-5 shrink-0 text-[#4E8FC5]" />
                  )}
                </div>
                {preview && (
                  <div className="pointer-events-none overflow-hidden rounded-2xl">
                    <RealWorldScene variant={preview} />
                  </div>
                )}
              </Link>
            )
          })}
        </div>

        <p className="text-center text-xs font-bold text-[#8a8478]">もっと いろいろな 教科の チャレンジも ふえる よてい！</p>
      </div>
    </main>
  )
}
