'use server'

import { db } from '@/lib/db'
import { mascot, mascotOwned, users } from '@/lib/db/schema'
import { getUserId } from '@/lib/session'
import { and, eq, gte, sql } from 'drizzle-orm'
import { getShopItem } from '@/lib/mascot'

// Deduct coins only if the balance covers it, so two quick taps can't go negative.
async function spend(userId: string, price: number) {
  if (price === 0) return true
  const rows = await db
    .update(users)
    .set({ coins: sql`${users.coins} - ${price}` })
    .where(and(eq(users.id, userId), gte(users.coins, price)))
    .returning({ id: users.id })
  return rows.length > 0
}

async function ensureMascot(userId: string) {
  await db.insert(mascot).values({ userId }).onConflictDoNothing()
}

async function owns(userId: string, itemId: string) {
  const [row] = await db
    .select({ id: mascotOwned.id })
    .from(mascotOwned)
    .where(and(eq(mascotOwned.userId, userId), eq(mascotOwned.itemId, itemId)))
    .limit(1)
  return Boolean(row)
}

// Snacks are eaten on purchase; backgrounds and accessories are bought once and equipped.
export async function buyItem(itemId: string) {
  const userId = await getUserId()
  const item = getShopItem(itemId)
  if (!item) throw new Error('invalid item')
  await ensureMascot(userId)

  if (item.kind === 'snack') {
    if (!(await spend(userId, item.price))) return { ok: false as const, error: 'insufficient_coins' as const }
    await db.update(mascot).set({ love: sql`${mascot.love} + ${item.love ?? 1}`, updatedAt: new Date() }).where(eq(mascot.userId, userId))
    return { ok: true as const }
  }

  if (item.price > 0 && !(await owns(userId, itemId))) {
    if (!(await spend(userId, item.price))) return { ok: false as const, error: 'insufficient_coins' as const }
    await db.insert(mascotOwned).values({ userId, itemId }).onConflictDoNothing()
  }
  const column = item.kind === 'background' ? { background: itemId } : { accessory: itemId }
  await db.update(mascot).set({ ...column, updatedAt: new Date() }).where(eq(mascot.userId, userId))
  return { ok: true as const }
}
