import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { db } from '@/lib/db'
import { problemClears, avatarOwned, avatarEquipped } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const [clears, owned, equippedRows] = await Promise.all([
    db.select().from(problemClears).where(eq(problemClears.userId, user.id)),
    db.select().from(avatarOwned).where(eq(avatarOwned.userId, user.id)),
    db.select().from(avatarEquipped).where(eq(avatarEquipped.userId, user.id)).limit(1),
  ])

  const cleared: Record<string, { count: number; lastClearedAt: number }> = {}
  for (const c of clears) cleared[c.problemId] = { count: c.count, lastClearedAt: new Date(c.lastClearedAt).getTime() }

  const equipped = equippedRows[0]

  return NextResponse.json({
    points: user.coins,
    name: user.name,
    prefecture: user.prefecture,
    cleared,
    avatarOwned: owned.map((o) => `${o.partType}:${o.variantId}`),
    avatarEquipped: equipped
      ? {
          faceShape: equipped.faceShape,
          bodyType: equipped.bodyType,
          eyes: equipped.eyes,
          eyebrows: equipped.eyebrows,
          eyelashes: equipped.eyelashes,
          nose: equipped.nose,
          mouth: equipped.mouth,
          clothes: equipped.clothes,
        }
      : null,
  })
}
