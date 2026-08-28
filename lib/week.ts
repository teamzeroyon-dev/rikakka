// ISO week: Monday 00:00 UTC as the week boundary, formatted as YYYY-MM-DD for the `date` column.
export function currentWeekStart(now = new Date()): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const day = d.getUTCDay() // 0 = Sunday
  const diffToMonday = day === 0 ? -6 : 1 - day
  d.setUTCDate(d.getUTCDate() + diffToMonday)
  return d.toISOString().slice(0, 10)
}

export function previousWeekStart(now = new Date()): string {
  const current = new Date(currentWeekStart(now))
  current.setUTCDate(current.getUTCDate() - 7)
  return current.toISOString().slice(0, 10)
}
