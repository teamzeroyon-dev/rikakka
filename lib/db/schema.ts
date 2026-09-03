import { pgTable, text, integer, timestamp, date, serial, unique } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  prefecture: text('prefecture').notNull(),
  coins: integer('coins').notNull().default(0),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
})

export const problemClears = pgTable('problem_clears', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  problemId: text('problemId').notNull(),
  count: integer('count').notNull().default(1),
  lastClearedAt: timestamp('lastClearedAt', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  userProblemUnique: unique().on(t.userId, t.problemId),
}))

export const avatarOwned = pgTable('avatar_owned', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  partType: text('partType').notNull(),
  variantId: text('variantId').notNull(),
  purchasedAt: timestamp('purchasedAt', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  ownedUnique: unique().on(t.userId, t.partType, t.variantId),
}))

export const avatarEquipped = pgTable('avatar_equipped', {
  userId: text('userId').primaryKey(),
  hair: text('hair').notNull().default('hair-1'),
  hairColor: text('hairColor').notNull().default('hairColor-1'),
  faceShape: text('faceShape').notNull().default('faceShape-1'),
  bodyType: text('bodyType').notNull().default('bodyType-1'),
  eyes: text('eyes').notNull().default('eyes-1'),
  eyebrows: text('eyebrows').notNull().default('eyebrows-1'),
  eyelashes: text('eyelashes').notNull().default('eyelashes-1'),
  nose: text('nose').notNull().default('nose-1'),
  mouth: text('mouth').notNull().default('mouth-1'),
  clothes: text('clothes').notNull().default('clothes-1'),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull().defaultNow(),
})

export const usageWeekly = pgTable('usage_weekly', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  weekStart: date('weekStart').notNull(),
  seconds: integer('seconds').notNull().default(0),
}, (t) => ({
  weekUnique: unique().on(t.userId, t.weekStart),
}))

export const weeklyRewards = pgTable('weekly_rewards', {
  id: serial('id').primaryKey(),
  weekStart: date('weekStart').notNull(),
  userId: text('userId').notNull(),
  rank: integer('rank').notNull(),
  coinsAwarded: integer('coinsAwarded').notNull(),
  awardedAt: timestamp('awardedAt', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  rewardUnique: unique().on(t.weekStart, t.userId),
}))
