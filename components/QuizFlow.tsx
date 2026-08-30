'use client'
import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { ChemStage, QuizChoiceId, QuizQuestion } from '@/lib/quizProblems'

type Tier = 'normal' | 'easy' | 'retry'
type Feedback = { kind: 'wrong'; message: string } | { kind: 'transition'; message: string } | null

const CHOICE_STYLES = ['border-[#4E8FC5] bg-[#eaf3fb]', 'border-[#3AA6A0] bg-[#e9f7f5]', 'border-[#E8B33A] bg-[#fdf6e6]']

function questionFor(stage: ChemStage, tier: Tier): QuizQuestion {
  if (tier === 'normal') return stage.normal
  if (tier === 'easy') return stage.easy
  return stage.retry
}

export function QuizFlow({ stage, onCleared }: { stage: ChemStage; onCleared: () => void }) {
  const [tier, setTier] = useState<Tier>('normal')
  const [normalWrongCount, setNormalWrongCount] = useState(0)
  const [selected, setSelected] = useState<QuizChoiceId | null>(null)
  const [feedback, setFeedback] = useState<Feedback>(null)

  const question = questionFor(stage, tier)

  const handleChoose = (choiceId: QuizChoiceId) => {
    if (feedback) return
    setSelected(choiceId)
    const isCorrect = choiceId === question.correctId

    if (isCorrect) {
      if (tier === 'normal' || tier === 'retry') {
        setFeedback({ kind: 'transition', message: '正解！' })
      } else {
        setFeedback({ kind: 'transition', message: 'できた！じゃあ、もう一回挑戦してみよう！' })
      }
      return
    }

    if (tier === 'normal') {
      const nextWrong = normalWrongCount + 1
      setNormalWrongCount(nextWrong)
      if (nextWrong >= 2) {
        setFeedback({ kind: 'transition', message: 'きほんの問題からたしかめてみよう！' })
      } else {
        setFeedback({ kind: 'wrong', message: 'おしい！もう一回考えてみよう！' })
      }
    } else {
      setFeedback({ kind: 'wrong', message: 'おしい！もう一回！' })
    }
  }

  const handleContinue = () => {
    if (!feedback) return
    const wasCorrect = selected === question.correctId
    setSelected(null)
    setFeedback(null)

    if (wasCorrect) {
      if (tier === 'normal' || tier === 'retry') {
        onCleared()
      } else {
        setTier('retry')
      }
      return
    }

    if (tier === 'normal' && normalWrongCount >= 2) {
      setTier('easy')
    }
    // else: stay on the same tier/question for another try
  }

  const tierLabel = tier === 'normal' ? '問題' : tier === 'easy' ? '超かんたん問題' : '再挑戦問題'

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex items-center justify-center">
        <span className="rounded-full bg-[#174d70] px-4 py-1 text-xs font-black text-white">{tierLabel}</span>
      </div>

      <p className="text-balance rounded-3xl bg-card p-5 text-center text-lg font-bold leading-relaxed shadow-sm">{question.prompt}</p>

      <div className="flex flex-col gap-3">
        {question.choices.map((choice, i) => {
          const isSelected = selected === choice.id
          const showResult = !!feedback && isSelected
          return (
            <button
              key={choice.id}
              onClick={() => handleChoose(choice.id)}
              disabled={!!feedback}
              className={`flex min-h-16 items-center gap-4 rounded-2xl border-2 px-5 text-left text-base font-bold leading-snug transition disabled:opacity-90 ${
                showResult
                  ? feedback?.kind === 'wrong'
                    ? 'border-[#e2596b] bg-[#fdeaec]'
                    : 'border-[#3d8a3d] bg-[#eaf7ea]'
                  : CHOICE_STYLES[i % CHOICE_STYLES.length]
              }`}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-[#3d3a38] shadow-sm">
                {choice.id}
              </span>
              <span className="flex-1 text-[#3d3a38]">{choice.text}</span>
            </button>
          )
        })}
      </div>

      {feedback && (
        <div
          className={`flex flex-col items-center gap-3 rounded-3xl p-5 text-center shadow-sm ${
            feedback.kind === 'wrong' ? 'bg-[#fdeaec]' : 'bg-[#eaf7ea]'
          }`}
        >
          <p className="flex items-center gap-2 text-lg font-black text-[#3d3a38]">
            {feedback.kind === 'transition' && <Sparkles className="size-5 text-[#e8b33a]" aria-hidden="true" />}
            {feedback.message}
          </p>
          <button
            onClick={handleContinue}
            className="min-h-12 rounded-full bg-[#174d70] px-8 text-base font-black text-white shadow-sm active:scale-95"
          >
            つづける
          </button>
        </div>
      )}
    </div>
  )
}
