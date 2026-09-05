import { Suspense } from 'react'
import { ChallengeClient } from '@/components/ChallengeClient'
import { requireUser } from '@/lib/require-user'
import { challenges } from '@/lib/challenges'

export function generateStaticParams() {
  return challenges.map((c) => ({ id: c.id }))
}

async function Authed({ id }: { id: string }) {
  await requireUser()
  return <ChallengeClient id={id} />
}

export default async function ChallengeRunnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <Suspense fallback={<div className="min-h-[var(--stage-h)] w-full bg-background" />}>
      <Authed id={id} />
    </Suspense>
  )
}
