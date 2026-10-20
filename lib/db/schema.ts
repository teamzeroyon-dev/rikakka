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

// Mascot: look comes from clears; this row stores what coins changed.
export const mascot = pgTable('mascot', {
  userId: text('userId').primaryKey(),
  background: text('background').notNull().default('bg-sky'),
  accessory: text('accessory').notNull().default('acc-none'),
  love: integer('love').notNull().default(0),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull().defaultNow(),
})

export const mascotOwned = pgTable('mascot_owned', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  itemId: text('itemId').notNull(),
  purchasedAt: timestamp('purchasedAt', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  mascotOwnedUnique: unique().on(t.userId, t.itemId),
}))

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
