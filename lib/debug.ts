'use client'

// Debug unlock: when on, every map node is playable regardless of progress.
// Toggle by visiting the home map with ?debug=1 (or ?debug=0 to turn off); an
// on-screen chip also toggles it. Persisted per-browser in localStorage.
const KEY = 'rikakka-debug'

export function readDebug(): boolean {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function writeDebug(on: boolean): void {
  try {
    if (on) localStorage.setItem(KEY, '1')
    else localStorage.removeItem(KEY)
  } catch {
    // ignore (private mode / storage disabled)
  }
}
