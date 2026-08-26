export const FIRST_CLEAR = 10
export const REPEAT = 2
export const FADED_REVIEW = 8
export const NEGLECT_MULTIPLIER = 2
export const RUN_BONUS: Record<number, number> = { 3: 5, 5: 12, 10: 30 }
export const isFaded = (last: number) => Date.now() - last > 14 * 24 * 60 * 60 * 1000
export const isNeglected = (last: number | undefined) => !last || Date.now() - last > 7 * 24 * 60 * 60 * 1000
