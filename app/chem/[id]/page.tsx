import { Suspense } from 'react'
import { ChemStageClient } from '@/components/ChemStageClient'
import { requireUser } from '@/lib/require-user'
import { chemStages } from '@/lib/quizProblems'

export function generateStaticParams() {
  return chemStages.map((s) => ({ id: s.id }))
}

async function AuthedChemStage({ id }: { id: string }) {
  await requireUser()
  return <ChemStageClient id={id} />
}

export default async function ChemStagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <Suspense fallback={<div className="min-h-[var(--stage-h)] w-full bg-background" />}>
      <AuthedChemStage id={id} />
    </Suspense>
  )
}
