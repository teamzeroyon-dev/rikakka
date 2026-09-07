export const FIRST_CLEAR = 10
export const REPEAT = 2
export const FADED_REVIEW = 8
export const NEGLECT_MULTIPLIER = 2
export const RUN_BONUS: Record<number, number> = { 3: 5, 5: 12, 10: 30 }
export const isFaded = (last: number) => Date.now() - last > 14 * 24 * 60 * 60 * 1000
export const isNeglected = (last: number | undefined) => !last || Date.now() - last > 7 * 24 * 60 * 60 * 1000

// Coins paid to the weekly usage-time ranking, by finishing rank (1st/2nd/3rd).
export const WEEKLY_REWARD_BY_RANK = [250, 200, 150, 100, 50]
