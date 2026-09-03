import { Suspense } from 'react'
import { requireUser } from '@/lib/require-user'
import { DiagnosisClient } from '@/components/DiagnosisClient'

async function AuthedDiagnosis() {
  await requireUser()
  return <DiagnosisClient />
}

export default function DiagnosisPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] w-full bg-background" />}>
      <AuthedDiagnosis />
    </Suspense>
  )
}
