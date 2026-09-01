import { requireUser } from '@/lib/require-user'
import { DiagnosisClient } from '@/components/DiagnosisClient'

export default async function DiagnosisPage() {
  await requireUser()
  return <DiagnosisClient />
}
