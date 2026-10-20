import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const statements = [
  `CREATE TABLE IF NOT EXISTS users (
    id text PRIMARY KEY,
    name text NOT NULL,
    prefecture text NOT NULL,
    coins integer NOT NULL DEFAULT 0,
    "createdAt" timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS problem_clears (
    id serial PRIMARY KEY,
    "userId" text NOT NULL,
    "problemId" text NOT NULL,
    count integer NOT NULL DEFAULT 1,
    "lastClearedAt" timestamptz NOT NULL DEFAULT now(),
    UNIQUE ("userId", "problemId")
  )`,
  `CREATE TABLE IF NOT EXISTS mascot (
    "userId" text PRIMARY KEY,
    background text NOT NULL DEFAULT 'bg-sky',
    accessory text NOT NULL DEFAULT 'acc-none',
    love integer NOT NULL DEFAULT 0,
    "updatedAt" timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS mascot_owned (
    id serial PRIMARY KEY,
    "userId" text NOT NULL,
    "itemId" text NOT NULL,
    "purchasedAt" timestamptz NOT NULL DEFAULT now(),
    UNIQUE ("userId", "itemId")
  )`,
  `CREATE TABLE IF NOT EXISTS usage_weekly (
    id serial PRIMARY KEY,
    "userId" text NOT NULL,
    "weekStart" date NOT NULL,
    seconds integer NOT NULL DEFAULT 0,
    UNIQUE ("userId", "weekStart")
  )`,
  `CREATE TABLE IF NOT EXISTS weekly_rewards (
    id serial PRIMARY KEY,
    "weekStart" date NOT NULL,
    "userId" text NOT NULL,
    rank integer NOT NULL,
    "coinsAwarded" integer NOT NULL,
    "awardedAt" timestamptz NOT NULL DEFAULT now(),
    UNIQUE ("weekStart", "userId")
  )`,
  // The original setup script created problem_clears with a "clearedAt" column,
  // but the app's schema tracks "count" + "lastClearedAt". Bring older databases
  // (and any created by the old CREATE above) into line.
  `ALTER TABLE problem_clears ADD COLUMN IF NOT EXISTS count integer NOT NULL DEFAULT 1`,
  `ALTER TABLE problem_clears ADD COLUMN IF NOT EXISTS "lastClearedAt" timestamptz NOT NULL DEFAULT now()`,
  // The avatar_owned / avatar_equipped tables from the old avatar feature are
  // left in place on existing databases (no longer read or written).
]

for (const [i, sql] of statements.entries()) {
  console.log(`[setup-db] running statement ${i + 1}/${statements.length}`)
  await pool.query(sql)
}

console.log('[setup-db] done')
await pool.end()
