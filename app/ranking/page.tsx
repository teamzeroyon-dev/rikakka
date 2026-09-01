import { requireUser } from '@/lib/require-user'
import { RankingClient } from '@/components/RankingClient'

export default async function RankingPage() {
  await requireUser()
  return <RankingClient />
}
