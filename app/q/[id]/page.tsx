import { ProblemClient } from '@/components/ProblemClient'

export function generateStaticParams() {
  return [{ id: 'lever-01' }, { id: 'lever-02' }, { id: 'lever-03' }, { id: 'rubber-01' }, { id: 'rubber-02' }]
}

export default async function ProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ProblemClient id={id} />
}
