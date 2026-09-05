'use client'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Lightbulb, Minus, Plus, RotateCcw } from 'lucide-react'
import { getNextProblem, getProblem, isLaunchProblem, type Weight } from '@/lib/problems'
import { getPhysicsQuiz } from '@/lib/physicsQuiz'
import { refreshSave } from '@/lib/progress'
import { recordClear } from '@/app/actions/progress'
import { Lever } from '@/components/Lever'
import { LaunchCourse } from '@/components/LaunchCourse'
import { RealWorldScene } from '@/components/RealWorldScene'
import { QuizFlow } from '@/components/QuizFlow'
import { StageClearCelebration } from '@/components/StageClearCelebration'
import { StageShell, LearnCard } from '@/components/StageShell'

type Phase = 'experiment' | 'learn' | 'quiz' | 'clear'

// Same shape as the chem / science stages: 手を動かす (Lever or LaunchCourse) →
// わかったこと → 例題 (QuizFlow) → クリア.
export function PhysicsStageClient({ id }: { id: string }) {
  const problem = getProblem(id) ?? getProblem('lever-01')!
  const quiz = getPhysicsQuiz(problem.id)
  const next = getNextProblem(problem.id)
  const [phase, setPhase] = useState<Phase>('experiment')

  // Lever manipulation state (only used for balance problems).
  const [weights, setWeights] = useState<Weight[]>('weights' in problem ? problem.weights : [])
  const [grams, setGrams] = useState(5)
  const changePos = (wid: string, position: number) => setWeights((ws) => ws.map((w) => (w.id === wid ? { ...w, position } : w)))
  const editable = weights.find((w) => w.gramsEditable)
  const setEditableGrams = (g: number) => setWeights((ws) => ws.map((w) => (w.gramsEditable ? { ...w, grams: g } : w)))

  const solvedExperiment = () => setPhase('learn')
  const startQuiz = () => (quiz ? setPhase('quiz') : finishStage())
  const finishStage = () => {
    setPhase('clear')
    recordClear(problem.id).then(refreshSave)
  }
  const restart = () => {
    setWeights('weights' in problem ? problem.weights : [])
    setPhase('experiment')
  }

  return (
    <StageShell title={problem.title} badge={`物理岡・${problem.difficultyLabel}`} theme="butsuri" phase={phase}>
      {phase === 'experiment' && (
        <div className="flex flex-col gap-3">
          <p className="rounded-2xl bg-white/85 p-4 text-center text-base font-black leading-7 text-[#3d3a38] shadow-sm">{problem.prompt}</p>
          {isLaunchProblem(problem) ? (
            <div className="rounded-3xl border-4 border-white bg-white/85 p-3 shadow-[0_6px_0_rgba(14,75,105,0.2)]">
              <LaunchCourse lanes={problem.lanes} length={problem.courseLengthCm} maxStretch={problem.maxStretchCm} onSolved={solvedExperiment} />
            </div>
          ) : (
            <>
              <div className="rounded-3xl border-4 border-white bg-white/85 px-3 py-6 shadow-[0_6px_0_rgba(14,75,105,0.2)]">
                <Lever weights={weights} notches={problem.notches} onChange={changePos} onSolved={solvedExperiment} />
              </div>
              {editable && (
                <div className="flex items-center justify-center gap-5">
                  <button onClick={() => setEditableGrams(Math.max(5, (editable.grams ?? 5) - 5))} className="flex size-12 items-center justify-center rounded-xl border-2 border-[#0e4b69] bg-white" aria-label="おもりを軽くする">
                    <Minus />
                  </button>
                  <span className="min-w-16 text-center text-lg font-black">{editable.grams}g</span>
                  <button onClick={() => setEditableGrams(Math.min(30, (editable.grams ?? 5) + 5))} className="flex size-12 items-center justify-center rounded-xl border-2 border-[#0e4b69] bg-white" aria-label="おもりを重くする">
                    <Plus />
                  </button>
                </div>
              )}
              <button onClick={restart} className="mx-auto flex min-h-10 items-center gap-1 rounded-full px-4 text-xs font-black text-[#8a8478]">
                <RotateCcw className="size-3.5" /> もういちど
              </button>
            </>
          )}
        </div>
      )}

      {phase === 'learn' && (
        <div className="flex flex-col gap-4">
          <LearnCard icon={<Lightbulb className="size-5" />} line={problem.solved.discovery}>
            <p className="rounded-2xl bg-[#fff3cf] p-3 text-center text-sm font-black text-[#3d3a38]">{problem.solved.formula}</p>
          </LearnCard>
          <div className="flex flex-col gap-3 rounded-3xl border-4 border-white bg-white/85 p-4 shadow-[0_6px_0_rgba(14,75,105,0.2)]">
            <p className="font-black text-[#c96a1e]">{problem.solved.realWorldTitle}</p>
            <RealWorldScene variant={problem.solved.realWorldVisual} />
            <p className="text-sm font-bold leading-6 text-[#5f5a52]">{problem.solved.realWorldBody}</p>
          </div>
          <button onClick={startQuiz} className="mx-auto flex min-h-14 items-center gap-2 rounded-2xl bg-[#FF9040] px-8 text-base font-black text-white shadow-[0_4px_0_#c96a1e] active:translate-y-1">
            例題に ちょうせん <ArrowRight className="size-4" />
          </button>
        </div>
      )}

      {phase === 'quiz' && quiz && <QuizFlow quiz={quiz} onCleared={finishStage} />}

      {phase === 'clear' && (
        <StageClearCelebration clearLine={problem.solved.discovery} next={next ? { href: `/q/${next.id}`, title: next.title } : null} onRetry={restart} />
      )}

      {phase !== 'clear' && (
        <Link href="/" className="mx-auto flex min-h-10 items-center gap-1 text-xs font-black text-[#8a8478]">
          <ArrowLeft className="size-3.5" /> マップへ もどる
        </Link>
      )}
    </StageShell>
  )
}
