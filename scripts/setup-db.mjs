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
    "clearedAt" timestamptz NOT NULL DEFAULT now(),
    UNIQUE ("userId", "problemId")
  )`,
  `CREATE TABLE IF NOT EXISTS avatar_owned (
    id serial PRIMARY KEY,
    "userId" text NOT NULL,
    "partType" text NOT NULL,
    "variantId" text NOT NULL,
    "purchasedAt" timestamptz NOT NULL DEFAULT now(),
    UNIQUE ("userId", "partType", "variantId")
  )`,
  `CREATE TABLE IF NOT EXISTS avatar_equipped (
    "userId" text PRIMARY KEY,
    "faceShape" text NOT NULL DEFAULT 'face-1',
    "bodyType" text NOT NULL DEFAULT 'body-1',
    eyes text NOT NULL DEFAULT 'eyes-1',
    eyebrows text NOT NULL DEFAULT 'eyebrows-1',
    eyelashes text NOT NULL DEFAULT 'eyelashes-1',
    nose text NOT NULL DEFAULT 'nose-1',
    mouth text NOT NULL DEFAULT 'mouth-1',
    clothes text NOT NULL DEFAULT 'clothes-1',
    "updatedAt" timestamptz NOT NULL DEFAULT now()
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
]

for (const [i, sql] of statements.entries()) {
  console.log(`[setup-db] running statement ${i + 1}/${statements.length}`)
  await pool.query(sql)
}

console.log('[setup-db] done')
await pool.end()
