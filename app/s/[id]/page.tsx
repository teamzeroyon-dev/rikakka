import { Suspense } from 'react'
import { ScienceStageClient } from '@/components/ScienceStageClient'
import { requireUser } from '@/lib/require-user'
import { scienceStages } from '@/lib/scienceStages'

export function generateStaticParams() {
  return scienceStages.map((s) => ({ id: s.id }))
}

async function AuthedScienceStage({ id }: { id: string }) {
  await requireUser()
  return <ScienceStageClient id={id} />
}

export default async function ScienceStagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <Suspense fallback={<div className="min-h-[var(--stage-h)] w-full bg-background" />}>
      <AuthedScienceStage id={id} />
    </Suspense>
  )
}
