import { Suspense } from 'react'
import { ProblemClient } from '@/components/ProblemClient'
import { requireUser } from '@/lib/require-user'

export function generateStaticParams() {
  return [{ id: 'lever-01' }, { id: 'lever-02' }, { id: 'lever-03' }, { id: 'rubber-01' }, { id: 'rubber-02' }]
}

async function AuthedProblem({ id }: { id: string }) {
  await requireUser()
  return <ProblemClient id={id} />
}

export default async function ProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <Suspense fallback={<div className="min-h-[100dvh] w-full bg-background" />}>
      <AuthedProblem id={id} />
    </Suspense>
  )
}
