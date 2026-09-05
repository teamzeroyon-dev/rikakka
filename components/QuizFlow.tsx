'use client'
import { useMemo, useState } from 'react'
import { Sparkles, Lightbulb, PartyPopper } from 'lucide-react'
import type { QuizChoiceId, QuizQuestion, QuizSet } from '@/lib/quizProblems'

// The source data almost always lists the correct choice first, so display order
// is shuffled per question — the correct answer lands in a random slot and the
// A/B/C badge is assigned by position, not by the choice's original id.
function shuffled<T>(items: T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

const BADGES = ['A', 'B', 'C', 'D']

type Tier = 'normal' | 'easy' | 'retry'
type Feedback = { kind: 'wrong'; message: string } | { kind: 'transition'; message: string } | null

// One bold colour per answer slot so A/B/C stay tellable apart at a glance.
const CHOICE_LOOK = [
  { border: '#E2596B', bg: 'linear-gradient(#fff1f2,#ffe1e5)', badge: '#E2596B', shadow: '#b8384a' },
  { border: '#3AA6A0', bg: 'linear-gradient(#ecfbf9,#d9f3f0)', badge: '#3AA6A0', shadow: '#227a75' },
  { border: '#E8B33A', bg: 'linear-gradient(#fff9e8,#fdefcd)', badge: '#E8B33A', shadow: '#b8871f' },
]

const TIER_LOOK: Record<Tier, { label: string; bg: string; icon: typeof Sparkles }> = {
  normal: { label: 'もんだい', bg: 'linear-gradient(90deg,#4E8FC5,#3AA6A0)', icon: Sparkles },
  easy: { label: 'ちょうかんたん もんだい', bg: 'linear-gradient(90deg,#5FB85F,#8FBF6B)', icon: Lightbulb },
  retry: { label: 'さいちょうせん もんだい', bg: 'linear-gradient(90deg,#FF9040,#E8B33A)', icon: PartyPopper },
}

function questionFor(quiz: QuizSet, tier: Tier): QuizQuestion {
  if (tier === 'normal') return quiz.normal
  if (tier === 'easy') return quiz.easy
  return quiz.retry
}

export function QuizFlow({ quiz, onCleared }: { quiz: QuizSet; onCleared: () => void }) {
  const [tier, setTier] = useState<Tier>('normal')
  const [normalWrongCount, setNormalWrongCount] = useState(0)
  const [selected, setSelected] = useState<QuizChoiceId | null>(null)
  const [feedback, setFeedback] = useState<Feedback>(null)

  const question = questionFor(quiz, tier)
  // Reshuffle only when the question itself changes (tier switch), so the order
  // stays stable while the child is looking at one question.
  const displayChoices = useMemo(() => shuffled(question.choices), [question])

  const handleChoose = (choiceId: QuizChoiceId) => {
    if (feedback) return
    setSelected(choiceId)
    const isCorrect = choiceId === question.correctId

    if (isCorrect) {
      if (tier === 'normal' || tier === 'retry') {
        setFeedback({ kind: 'transition', message: 'せいかい！' })
      } else {
        setFeedback({ kind: 'transition', message: 'できた！じゃあもう一回挑戦してみよう！' })
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

  const tierLook = TIER_LOOK[tier]
  const TierIcon = tierLook.icon

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-center">
        <span
          className="flex items-center gap-2 rounded-full px-5 py-1.5 text-sm font-black text-white shadow-[0_3px_0_rgba(14,75,105,0.35)]"
          style={{ background: tierLook.bg }}
        >
          <TierIcon className="size-4" aria-hidden="true" />
          {tierLook.label}
        </span>
      </div>

      <p className="text-balance rounded-3xl border-4 border-[#0e4b69] bg-gradient-to-b from-white to-[#f4fbfd] p-5 text-center text-lg font-black leading-relaxed text-[#3d3a38] shadow-[0_5px_0_#174d70]">
        {question.prompt}
      </p>

      <div className="flex flex-col gap-3">
        {displayChoices.map((choice, i) => {
          const look = CHOICE_LOOK[i % CHOICE_LOOK.length]
          const isSelected = selected === choice.id
          const showResult = !!feedback && isSelected
          const resultBorder = feedback?.kind === 'wrong' ? '#e2596b' : '#3d8a3d'
          const resultBg = feedback?.kind === 'wrong' ? 'linear-gradient(#fdeaec,#fbd8dd)' : 'linear-gradient(#eaf7ea,#d6f0d6)'
          return (
            <button
              key={choice.id}
              onClick={() => handleChoose(choice.id)}
              disabled={!!feedback}
              className="flex min-h-[4.5rem] items-center gap-4 rounded-3xl border-4 px-4 text-left text-base font-black leading-snug transition active:translate-y-1 disabled:opacity-95"
              style={{
                borderColor: showResult ? resultBorder : look.border,
                background: showResult ? resultBg : look.bg,
                boxShadow: `0 5px 0 ${showResult ? resultBorder : look.shadow}`,
              }}
            >
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-full text-lg font-black text-white shadow-inner"
                style={{ background: showResult ? resultBorder : look.badge }}
              >
                {BADGES[i]}
              </span>
              <span className="flex-1 text-[#3d3a38]">{choice.text}</span>
            </button>
          )
        })}
      </div>

      {feedback && (
        <div
          className="animate-chem-fade-in flex flex-col items-center gap-3 rounded-3xl border-4 p-5 text-center shadow-[0_5px_0_rgba(14,75,105,0.2)]"
          style={
            feedback.kind === 'wrong'
              ? { borderColor: '#e2596b', background: 'linear-gradient(#fff1f2,#ffe1e5)' }
              : { borderColor: '#3d8a3d', background: 'linear-gradient(#f0fbef,#dcf3da)' }
          }
        >
          <span className="text-4xl" aria-hidden="true">
            {feedback.kind === 'wrong' ? '🤔' : '🎉'}
          </span>
          <p className="text-lg font-black text-[#3d3a38]">{feedback.message}</p>
          <button
            onClick={handleContinue}
            className="min-h-12 rounded-full bg-[#174d70] px-10 text-base font-black text-white shadow-[0_4px_0_#0e3450] active:translate-y-1"
          >
            つづける
          </button>
        </div>
      )}
    </div>
  )
}
