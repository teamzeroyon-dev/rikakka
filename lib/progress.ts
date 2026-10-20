'use client'
import useSWR, { mutate as globalMutate } from 'swr'

export type ClearRecord = { count: number; lastClearedAt: number }
export type MascotSave = { background: string; accessory: string; love: number; owned: string[] }
export type Save = {
  points: number
  name: string
  prefecture: string
  cleared: Record<string, ClearRecord>
  mascot: MascotSave
}

export const defaultSave: Save = { points: 0, name: '', prefecture: '', cleared: {}, mascot: { background: 'bg-sky', accessory: 'acc-none', love: 0, owned: [] } }

const SAVE_KEY = '/api/save'
const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useSave() {
  const { data, isLoading, error } = useSWR<Save>(SAVE_KEY, fetcher)
  return { save: data ?? defaultSave, isLoading, error }
}

export function refreshSave() {
  globalMutate(SAVE_KEY)
}
