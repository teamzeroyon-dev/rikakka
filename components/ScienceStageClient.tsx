'use client'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Sprout, Mountain } from 'lucide-react'
import { getScienceStage, getScienceStagesForRegion, getNextScienceStage } from '@/lib/scienceStages'
import { refreshSave } from '@/lib/progress'
import { recordClear } from '@/app/actions/progress'
import { ScienceActivity } from '@/components/ScienceActivity'
import { QuizFlow } from '@/components/QuizFlow'
import { StageClearCelebration } from '@/components/StageClearCelebration'
import { StageShell, LearnCard } from '@/components/StageShell'

type Phase = 'experiment' | 'learn' | 'quiz' | 'clear'

const REGION_NAME = { chigaku: '地学山', seibutsu: '生物森' } as const

export function ScienceStageClient({ id }: { id: string }) {
  const stage = getScienceStage(id) ?? getScienceStage('chigaku-01')!
  const next = getNextScienceStage(stage.id)
  const total = getScienceStagesForRegion(stage.regionId).length
  const [phase, setPhase] = useState<Phase>('experiment')

  const handleQuizCleared = () => {
    setPhase('clear')
    recordClear(stage.id).then(refreshSave)
  }

  return (
    <StageShell
      title={stage.title}
      badge={`${REGION_NAME[stage.regionId]} ${stage.index}／${total}`}
      theme={stage.regionId}
      phase={phase}
    >
      {phase === 'experiment' && (
        <div className="flex flex-col gap-3 rounded-3xl border-4 border-white bg-white/85 p-4 shadow-[0_6px_0_rgba(14,75,105,0.2)]">
          <p className="rounded-2xl bg-[#fdf9ef] p-3 text-center text-sm font-black leading-6 text-[#3d3a38]">
            {stage.activityHint}
          </p>
          <ScienceActivity activity={stage.activity} onDone={() => setPhase('learn')} />
        </div>
      )}

      {phase === 'learn' && (
        <LearnCard icon={stage.regionId === 'chigaku' ? <Mountain className="size-5" /> : <Sprout className="size-5" />} line={stage.learningLine}>
          <button
            onClick={() => setPhase('quiz')}
            className="mx-auto flex min-h-14 items-center gap-2 rounded-2xl bg-[#5FB85F] px-8 text-base font-black text-white shadow-[0_4px_0_#3c8b3c] active:translate-y-1"
          >
            クイズに ちょうせん <ArrowRight className="size-4" />
          </button>
        </LearnCard>
      )}

      {phase === 'quiz' && <QuizFlow quiz={stage} onCleared={handleQuizCleared} />}

      {phase === 'clear' && (
        <StageClearCelebration
          clearLine={stage.clearLine}
          next={next ? { href: `/s/${next.id}`, title: next.title } : null}
          onRetry={() => setPhase('experiment')}
        />
      )}

      {phase !== 'clear' && (
        <Link href="/" className="mx-auto flex min-h-10 items-center gap-1 text-xs font-black text-[#8a8478]">
          <ArrowLeft className="size-3.5" /> マップへ もどる
        </Link>
      )}
    </StageShell>
  )
}
