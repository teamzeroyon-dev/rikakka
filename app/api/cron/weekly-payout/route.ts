import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { usageWeekly, weeklyRewards, users } from '@/lib/db/schema'
import { desc, eq, sql } from 'drizzle-orm'
import { previousWeekStart } from '@/lib/week'

// Rewards for the top 3 users by usage time, keyed by finishing rank (1st/2nd/3rd).
const REWARD_BY_RANK = [50, 30, 15]

// Vercel Cron calls this on a schedule (see vercel.json). Runs once per week,
// paying out the PREVIOUS week's top usage-time users. The unique
// (weekStart, userId) constraint on weekly_rewards makes this idempotent if the
// cron fires more than once for the same week.
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const weekStart = previousWeekStart()

  const top = await db
    .select({ userId: usageWeekly.userId, seconds: usageWeekly.seconds })
    .from(usageWeekly)
    .where(eq(usageWeekly.weekStart, weekStart))
    .orderBy(desc(usageWeekly.seconds))
    .limit(REWARD_BY_RANK.length)

  const awarded: { userId: string; rank: number; coins: number }[] = []

  for (let i = 0; i < top.length; i++) {
    const rank = i + 1
    const coins = REWARD_BY_RANK[i]
    const inserted = await db
      .insert(weeklyRewards)
      .values({ weekStart, userId: top[i].userId, rank, coinsAwarded: coins })
      .onConflictDoNothing({ target: [weeklyRewards.weekStart, weeklyRewards.userId] })
      .returning({ userId: weeklyRewards.userId })

    if (inserted.length > 0) {
      await db
        .update(users)
        .set({ coins: sql`${users.coins} + ${coins}` })
        .where(eq(users.id, top[i].userId))
      awarded.push({ userId: top[i].userId, rank, coins })
    }
  }

  return NextResponse.json({ ok: true, weekStart, awarded })
}
