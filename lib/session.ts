import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const COOKIE_NAME = 'uid'
const ONE_YEAR = 60 * 60 * 24 * 365

export async function getCurrentUser() {
  const store = await cookies()
  const id = store.get(COOKIE_NAME)?.value
  if (!id) return null
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1)
  return user ?? null
}

// Cheap cookie-only read for high-frequency endpoints (e.g. heartbeat) that don't
// need the full user row.
export async function getCurrentUserId() {
  const store = await cookies()
  return store.get(COOKIE_NAME)?.value ?? null
}

export async function getUserId() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  return user.id
}

export async function setSessionCookie(id: string) {
  const store = await cookies()
  const isDev = process.env.NODE_ENV !== 'production'
  store.set(COOKIE_NAME, id, {
    httpOnly: true,
    // Preview runs inside an iframe on a different origin, so dev cookies must be
    // SameSite=None + Secure to survive; production can use the stricter Lax.
    sameSite: isDev ? 'none' : 'lax',
    secure: true,
    maxAge: ONE_YEAR,
    path: '/',
  })
}

export async function clearSessionCookie() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}
