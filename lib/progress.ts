const KEY = 'sawatte-solved'
export function getSolvedIds(): string[] { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] } }
export function markSolved(id: string) { try { const ids = getSolvedIds(); if (!ids.includes(id)) localStorage.setItem(KEY, JSON.stringify([...ids, id])) } catch {} }
