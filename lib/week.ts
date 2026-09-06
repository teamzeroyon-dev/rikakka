// Ranking week: Sunday 18:00 JST (09:00 UTC), formatted as YYYY-MM-DD.
export function currentWeekStart(now = new Date()): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 9))
  const day = now.getUTCDay()
  const beforeBoundary = now.getUTCHours() < 9
  const daysSinceSunday = day
  d.setUTCDate(d.getUTCDate() - daysSinceSunday - (beforeBoundary ? 7 : 0))
  return d.toISOString().slice(0, 10)
}

export function previousWeekStart(now = new Date()): string {
  const current = new Date(currentWeekStart(now))
  current.setUTCDate(current.getUTCDate() - 7)
  return current.toISOString().slice(0, 10)
}

// The moment the CURRENT ranking week finalizes: the next Sunday 09:00 UTC
// (18:00 JST) boundary. Returned as a full ISO timestamp for countdowns.
export function nextWeekBoundary(now = new Date()): string {
  const start = new Date(currentWeekStart(now) + 'T09:00:00.000Z')
  start.setUTCDate(start.getUTCDate() + 7)
  return start.toISOString()
}
