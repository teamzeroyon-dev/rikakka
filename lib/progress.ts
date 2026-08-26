export type ClearRecord = { count: number; lastClearedAt: number }
export type Save = { version: 1; points: number; cleared: Record<string, ClearRecord>; unlockedRegions: string[]; dexUnlocked: string[]; avatarOwned: string[]; avatarEquipped: string | null; lastVisitedRegionAt: Record<string, number> }
export const defaultSave: Save = { version: 1, points: 128, cleared: {}, unlockedRegions: ['physics', 'change'], dexUnlocked: [], avatarOwned: [], avatarEquipped: null, lastVisitedRegionAt: {} }
const KEY = 'sawatte-save'
export function readSave(): Save { try { const raw = localStorage.getItem(KEY); return raw ? { ...defaultSave, ...JSON.parse(raw) } : defaultSave } catch { return defaultSave } }
export function writeSave(save: Save) { try { localStorage.setItem(KEY, JSON.stringify(save)) } catch {} }
export function getSolvedIds(): string[] { try { return Object.keys(readSave().cleared) } catch { return [] } }
export function markSolved(id: string) { try { const save = readSave(); const prior = save.cleared[id]; save.cleared[id] = { count: (prior?.count || 0) + 1, lastClearedAt: Date.now() }; save.points += prior ? 2 : 10; writeSave(save) } catch {} }
