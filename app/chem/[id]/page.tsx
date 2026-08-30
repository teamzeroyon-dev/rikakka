import { ChemStageClient } from '@/components/ChemStageClient'
import { requireUser } from '@/lib/require-user'
import { chemStages } from '@/lib/quizProblems'

export function generateStaticParams() {
  return chemStages.map((s) => ({ id: s.id }))
}

export default async function ChemStagePage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser()
  const { id } = await params
  return <ChemStageClient id={id} />
}
