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

type Phase = 'experiment' | 'learn' | 'quiz' | 'clear'

export function ChemStageClient({ id }: { id: string }) {
  const stage = getChemStage(id) ?? getChemStage('chem-01')!
  const next = getNextChemStage(stage.id)
  const [phase, setPhase] = useState<Phase>('experiment')

  const handleExperimentDone = () => setPhase('learn')
  const handleQuizCleared = () => {
    setPhase('clear')
    recordClear(stage.id).then(refreshSave)
  }
  const retryStage = () => setPhase('experiment')

  return (
    <main className="min-h-screen bg-background px-5 py-6 text-foreground">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
        <header className="flex items-center gap-3">
          <Link href="/" className="flex size-12 items-center justify-center rounded-lg border border-border" aria-label="もどる">
            <ArrowLeft />
          </Link>
          <h1 className="text-xl font-bold">
            {stage.title}
          </h1>
        </header>

        {phase === 'experiment' && (
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
              <ChemExperiment experiment={stage.experiment} onDone={handleExperimentDone} />
            </div>
          </div>
        )}

        {phase === 'learn' && (
          <div className="flex flex-col gap-4 rounded-3xl border border-primary/20 bg-card p-6 shadow-lg">
            <div className="flex items-center gap-2 text-primary">
              <FlaskConical className="size-5" />
              <p className="font-bold">わかったこと</p>
            </div>
            <p className="leading-7">{stage.learningLine}</p>
            <button
              onClick={() => setPhase('quiz')}
              className="mx-auto flex min-h-12 items-center gap-2 rounded-lg bg-primary px-6 font-bold text-primary-foreground"
            >
              クイズに挑戦 <ArrowRight className="size-4" />
            </button>
          </div>
        )}

        {phase === 'quiz' && <QuizFlow stage={stage} onCleared={handleQuizCleared} />}

        {phase === 'clear' && <StageClearCelebration stage={stage} next={next} onRetry={retryStage} />}
      </div>
    </main>
  )
}
