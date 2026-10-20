import { Suspense } from 'react'
import { requireUser } from '@/lib/require-user'
import { MascotClient } from '@/components/MascotClient'

async function AuthedMascot() {
  await requireUser()
  return <MascotClient />
}

export default function MascotPage() {
  return (
    <Suspense fallback={<div className="min-h-[var(--stage-h)] w-full bg-[#fdf9ef]" />}>
      <AuthedMascot />
    </Suspense>
  )
}
