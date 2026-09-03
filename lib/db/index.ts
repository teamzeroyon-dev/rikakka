import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// PG_POOL_MAX lets serverless deployments cap connections per instance (and lets
// a single-connection local dev DB avoid concurrent-socket errors). Unset = pg's
// default pool size, so production behaviour is unchanged unless opted in.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(process.env.PG_POOL_MAX ? { max: Number(process.env.PG_POOL_MAX) } : {}),
  ...(process.env.PG_POOL_IDLE_MS ? { idleTimeoutMillis: Number(process.env.PG_POOL_IDLE_MS) } : {}),
})
export const db = drizzle(pool, { schema })
