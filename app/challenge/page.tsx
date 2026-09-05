import { Suspense } from 'react'
import { ChallengeHub } from '@/components/ChallengeHub'
import { requireUser } from '@/lib/require-user'

async function Authed() {
  await requireUser()
  return <ChallengeHub />
}

export default function ChallengePage() {
  return (
    <Suspense fallback={<div className="min-h-[var(--stage-h)] w-full bg-background" />}>
      <Authed />
    </Suspense>
  )
}
