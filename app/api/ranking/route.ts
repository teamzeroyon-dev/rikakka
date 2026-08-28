import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { usageWeekly, users, weeklyRewards } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { currentWeekStart, previousWeekStart } from '@/lib/week'
import { getCurrentUserId } from '@/lib/session'

export async function GET() {
  const userId = await getCurrentUserId()
  const weekStart = currentWeekStart()
  const lastWeekStart = previousWeekStart()

  const rows = await db
    .select({ userId: usageWeekly.userId, seconds: usageWeekly.seconds, name: users.name, prefecture: users.prefecture })
    .from(usageWeekly)
    .innerJoin(users, eq(users.id, usageWeekly.userId))
    .where(eq(usageWeekly.weekStart, weekStart))
    .orderBy(desc(usageWeekly.seconds))
    .limit(20)

  const lastWeekWinners = await db
    .select({ userId: weeklyRewards.userId, rank: weeklyRewards.rank, coinsAwarded: weeklyRewards.coinsAwarded, name: users.name })
    .from(weeklyRewards)
    .innerJoin(users, eq(users.id, weeklyRewards.userId))
    .where(eq(weeklyRewards.weekStart, lastWeekStart))
    .orderBy(weeklyRewards.rank)

  const myRank = rows.findIndex((r) => r.userId === userId)

  return NextResponse.json({
    weekStart,
    board: rows.map((r, i) => ({ rank: i + 1, name: r.name, prefecture: r.prefecture, minutes: Math.round(r.seconds / 60), isMe: r.userId === userId })),
    myRank: myRank === -1 ? null : myRank + 1,
    lastWeekWinners,
  })
}
