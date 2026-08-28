import { requireUser } from '@/lib/require-user'
import { BagClient } from '@/components/BagClient'

export default async function BagPage() {
  await requireUser()
  return <BagClient />
}
