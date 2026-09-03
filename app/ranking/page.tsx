import { Suspense } from 'react'
import { requireUser } from '@/lib/require-user'
import { RankingClient } from '@/components/RankingClient'

async function AuthedRanking() {
  await requireUser()
  return <RankingClient />
}

export default function RankingPage() {
  return (
    <Suspense fallback={<div className="min-h-[var(--stage-h)] w-full bg-background" />}>
      <AuthedRanking />
    </Suspense>
  )
}
