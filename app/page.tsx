import { Suspense } from 'react'
import { WorldMap } from '@/components/WorldMap'
import { requireUser } from '@/lib/require-user'

async function AuthedWorldMap() {
  await requireUser()
  return <WorldMap />
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-[100dvh] w-full bg-[#CFE6EE]" />}>
      <AuthedWorldMap />
    </Suspense>
  )
}
