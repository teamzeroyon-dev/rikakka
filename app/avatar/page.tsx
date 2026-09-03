import { Suspense } from 'react'
import { requireUser } from '@/lib/require-user'
import { AvatarEditor } from '@/components/AvatarEditor'

async function AuthedAvatar() {
  await requireUser()
  return <AvatarEditor />
}

export default function AvatarPage() {
  return (
    <Suspense fallback={<div className="min-h-[var(--stage-h)] w-full bg-background" />}>
      <AuthedAvatar />
    </Suspense>
  )
}
