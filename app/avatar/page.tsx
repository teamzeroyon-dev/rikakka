import { requireUser } from '@/lib/require-user'
import { AvatarEditor } from '@/components/AvatarEditor'

export default async function AvatarPage() {
  await requireUser()
  return <AvatarEditor />
}
