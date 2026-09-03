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
    hair text NOT NULL DEFAULT 'hair-1',
    "hairColor" text NOT NULL DEFAULT 'hairColor-1',
    "faceShape" text NOT NULL DEFAULT 'faceShape-1',
    "bodyType" text NOT NULL DEFAULT 'bodyType-1',
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
  // The original setup script created problem_clears with a "clearedAt" column,
  // but the app's schema tracks "count" + "lastClearedAt". Bring older databases
  // (and any created by the old CREATE above) into line.
  `ALTER TABLE problem_clears ADD COLUMN IF NOT EXISTS count integer NOT NULL DEFAULT 1`,
  `ALTER TABLE problem_clears ADD COLUMN IF NOT EXISTS "lastClearedAt" timestamptz NOT NULL DEFAULT now()`,
  // Existing databases predate the hair parts, and shipped placeholder defaults
  // for faceShape/bodyType that did not match any real variant id.
  `ALTER TABLE avatar_equipped ADD COLUMN IF NOT EXISTS hair text NOT NULL DEFAULT 'hair-1'`,
  `ALTER TABLE avatar_equipped ADD COLUMN IF NOT EXISTS "hairColor" text NOT NULL DEFAULT 'hairColor-1'`,
  `ALTER TABLE avatar_equipped ALTER COLUMN "faceShape" SET DEFAULT 'faceShape-1'`,
  `ALTER TABLE avatar_equipped ALTER COLUMN "bodyType" SET DEFAULT 'bodyType-1'`,
  `UPDATE avatar_equipped SET "faceShape" = 'faceShape-1' WHERE "faceShape" = 'face-1'`,
  `UPDATE avatar_equipped SET "bodyType" = 'bodyType-1' WHERE "bodyType" = 'body-1'`,
]

for (const [i, sql] of statements.entries()) {
  console.log(`[setup-db] running statement ${i + 1}/${statements.length}`)
  await pool.query(sql)
}

console.log('[setup-db] done')
await pool.end()
