import { WorldMap } from '@/components/WorldMap'
import { requireUser } from '@/lib/require-user'

export default async function Home() {
  await requireUser()
  return <WorldMap />
}
