import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { db } from '@/lib/db'
import { problemClears, mascot, mascotOwned } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { DEFAULT_ACCESSORY, DEFAULT_BACKGROUND } from '@/lib/mascot'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const [clears, owned, mascotRows] = await Promise.all([
    db.select().from(problemClears).where(eq(problemClears.userId, user.id)),
    db.select().from(mascotOwned).where(eq(mascotOwned.userId, user.id)),
    db.select().from(mascot).where(eq(mascot.userId, user.id)).limit(1),
  ])

  const cleared: Record<string, { count: number; lastClearedAt: number }> = {}
  for (const c of clears) cleared[c.problemId] = { count: c.count, lastClearedAt: new Date(c.lastClearedAt).getTime() }

  const m = mascotRows[0]

  return NextResponse.json({
    points: user.coins,
    name: user.name,
    prefecture: user.prefecture,
    cleared,
    mascot: {
      background: m?.background ?? DEFAULT_BACKGROUND,
      accessory: m?.accessory ?? DEFAULT_ACCESSORY,
      love: m?.love ?? 0,
      owned: owned.map((o) => o.itemId),
    },
  })
}
