'use client'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, FlaskConical } from 'lucide-react'
import { getChemStage, getNextChemStage } from '@/lib/quizProblems'
import { refreshSave } from '@/lib/progress'
import { recordClear } from '@/app/actions/progress'
import { ChemExperiment } from '@/components/ChemExperiment'
import { QuizFlow } from '@/components/QuizFlow'
import { StageClearCelebration } from '@/components/StageClearCelebration'
import { StageShell, LearnCard } from '@/components/StageShell'
import { RealWorldCard } from '@/components/RealWorldCard'
import { getRealWorld } from '@/lib/realWorld'

type Phase = 'experiment' | 'learn' | 'quiz' | 'clear'

export function ChemStageClient({ id }: { id: string }) {
  const stage = getChemStage(id) ?? getChemStage('chem-01')!
  const next = getNextChemStage(stage.id)
  const realWorld = getRealWorld(stage.id)
  const [phase, setPhase] = useState<Phase>('experiment')

  const handleQuizCleared = () => {
    setPhase('clear')
    recordClear(stage.id).then(refreshSave)
  }

  return (
    <StageShell
      title={stage.title}
      badge={`化学海岸 ${stage.index}／18`}
      theme="kagaku"
      phase={phase}
    >
      {phase === 'experiment' && (
        <div className="rounded-3xl border-4 border-white bg-white/85 p-4 shadow-[0_6px_0_rgba(14,75,105,0.2)]">
          <ChemExperiment experiment={stage.experiment} onDone={() => setPhase('learn')} />
        </div>
      )}

      {phase === 'learn' && (
        <div className="flex flex-col gap-4">
          <LearnCard icon={<FlaskConical className="size-5" />} line={stage.learningLine} />
          {realWorld && <RealWorldCard data={realWorld} />}
          <button
            onClick={() => setPhase('quiz')}
            className="mx-auto flex min-h-14 items-center gap-2 rounded-2xl bg-[#3AA6A0] px-8 text-base font-black text-white shadow-[0_4px_0_#227a75] active:translate-y-1"
          >
            クイズに ちょうせん <ArrowRight className="size-4" />
          </button>
        </div>
      )}

      {phase === 'quiz' && <QuizFlow quiz={stage} onCleared={handleQuizCleared} />}

      {phase === 'clear' && (
        <StageClearCelebration
          clearLine={stage.clearLine}
          next={next ? { href: `/chem/${next.id}`, title: next.title } : null}
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
