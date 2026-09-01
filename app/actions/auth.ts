'use server'

import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { setSessionCookie, clearSessionCookie } from '@/lib/session'
import { randomUUID } from 'crypto'

export async function createAccount(name: string, prefecture: string) {
  const trimmedName = name.trim().slice(0, 20)
  if (!trimmedName) throw new Error('name required')
  if (!prefecture) throw new Error('prefecture required')

  const id = randomUUID()
  await db.insert(users).values({ id, name: trimmedName, prefecture })
  await setSessionCookie(id)
  return { id }
}

export async function logout() {
  await clearSessionCookie()
}
