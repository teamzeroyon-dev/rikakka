'use client'
import useSWR, { mutate as globalMutate } from 'swr'

export type ClearRecord = { count: number; lastClearedAt: number }
export type AvatarEquipped = {
  hair: string
  hairColor: string
  faceShape: string
  bodyType: string
  eyes: string
  eyebrows: string
  eyelashes: string
  nose: string
  mouth: string
  clothes: string
}
export type Save = {
  points: number
  name: string
  prefecture: string
  cleared: Record<string, ClearRecord>
  avatarOwned: string[]
  avatarEquipped: AvatarEquipped | null
}

export const defaultSave: Save = { points: 0, name: '', prefecture: '', cleared: {}, avatarOwned: [], avatarEquipped: null }

const SAVE_KEY = '/api/save'
const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useSave() {
  const { data, isLoading, error } = useSWR<Save>(SAVE_KEY, fetcher)
  return { save: data ?? defaultSave, isLoading, error }
}

export function refreshSave() {
  globalMutate(SAVE_KEY)
}
