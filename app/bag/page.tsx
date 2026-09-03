import { Suspense } from 'react'
import { requireUser } from '@/lib/require-user'
import { BagClient } from '@/components/BagClient'

async function AuthedBag() {
  await requireUser()
  return <BagClient />
}

export default function BagPage() {
  return (
    <Suspense fallback={<div className="min-h-[var(--stage-h)] w-full bg-background" />}>
      <AuthedBag />
    </Suspense>
  )
}
