'use server'

import { db } from '@/lib/db'
import { problemClears, users } from '@/lib/db/schema'
import { getUserId } from '@/lib/session'
import { eq, and, sql } from 'drizzle-orm'
import { FIRST_CLEAR, REPEAT } from '@/lib/economy'

export async function recordClear(problemId: string) {
  const userId = await getUserId()
  const [existing] = await db
    .select()
    .from(problemClears)
    .where(and(eq(problemClears.userId, userId), eq(problemClears.problemId, problemId)))
    .limit(1)

  const award = existing ? REPEAT : FIRST_CLEAR

  if (existing) {
    await db
      .update(problemClears)
      .set({ count: existing.count + 1, lastClearedAt: new Date() })
      .where(and(eq(problemClears.userId, userId), eq(problemClears.problemId, problemId)))
  } else {
    await db.insert(problemClears).values({ userId, problemId })
  }

  await db.update(users).set({ coins: sql`${users.coins} + ${award}` }).where(eq(users.id, userId))

  return { award }
}
