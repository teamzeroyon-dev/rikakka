'use server'

import { db } from '@/lib/db'
import { avatarEquipped, avatarOwned, users } from '@/lib/db/schema'
import { getUserId } from '@/lib/session'
import { eq, and, sql } from 'drizzle-orm'
import { getVariant, isFree, type PartType } from '@/lib/avatarParts'
import { revalidatePath } from 'next/cache'

const COLUMN_BY_PART: Record<PartType, keyof typeof avatarEquipped.$inferInsert> = {
  faceShape: 'faceShape',
  bodyType: 'bodyType',
  eyes: 'eyes',
  eyebrows: 'eyebrows',
  eyelashes: 'eyelashes',
  nose: 'nose',
  mouth: 'mouth',
  clothes: 'clothes',
}

async function ensureEquippedRow(userId: string) {
  const [existing] = await db.select().from(avatarEquipped).where(eq(avatarEquipped.userId, userId)).limit(1)
  if (existing) return existing
  const [created] = await db.insert(avatarEquipped).values({ userId }).returning()
  return created
}

export async function purchasePart(partType: PartType, variantId: string) {
  const userId = await getUserId()
  const variant = getVariant(partType, variantId)
  if (!variant) throw new Error('invalid variant')
  if (variant.price === 0) return { ok: true }

  const [owned] = await db
    .select()
    .from(avatarOwned)
    .where(and(eq(avatarOwned.userId, userId), eq(avatarOwned.partType, partType), eq(avatarOwned.variantId, variantId)))
    .limit(1)
  if (owned) return { ok: true }

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  if (!user || user.coins < variant.price) return { ok: false, error: 'insufficient_coins' as const }

  await db.update(users).set({ coins: sql`${users.coins} - ${variant.price}` }).where(eq(users.id, userId))
  await db.insert(avatarOwned).values({ userId, partType, variantId })
  revalidatePath('/avatar')
  return { ok: true }
}

export async function equipPart(partType: PartType, variantId: string) {
  const userId = await getUserId()

  if (!isFree(partType, variantId)) {
    const [owned] = await db
      .select()
      .from(avatarOwned)
      .where(and(eq(avatarOwned.userId, userId), eq(avatarOwned.partType, partType), eq(avatarOwned.variantId, variantId)))
      .limit(1)
    if (!owned) throw new Error('not owned')
  }

  await ensureEquippedRow(userId)
  const column = COLUMN_BY_PART[partType]
  await db
    .update(avatarEquipped)
    .set({ [column]: variantId, updatedAt: new Date() } as never)
    .where(eq(avatarEquipped.userId, userId))

  revalidatePath('/avatar')
  return { ok: true }
}
