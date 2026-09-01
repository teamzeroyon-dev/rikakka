import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/session'
import { db } from '@/lib/db'
import { usageWeekly } from '@/lib/db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { currentWeekStart } from '@/lib/week'

// Called every ~30s while the app tab is visible/focused. Adds a fixed increment
// (capped to the heartbeat interval) instead of trusting a client-provided duration.
const HEARTBEAT_SECONDS = 30

export async function POST() {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ ok: false }, { status: 401 })

  const weekStart = currentWeekStart()

  await db
    .insert(usageWeekly)
    .values({ userId, weekStart, seconds: HEARTBEAT_SECONDS })
    .onConflictDoUpdate({
      target: [usageWeekly.userId, usageWeekly.weekStart],
      set: { seconds: sql`${usageWeekly.seconds} + ${HEARTBEAT_SECONDS}` },
    })

  return NextResponse.json({ ok: true })
}
