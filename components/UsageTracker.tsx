'use client'
import { useEffect } from 'react'

// Mounted once near the app root. Sends a heartbeat every 30s only while the
// tab is visible and focused, so backgrounded/closed tabs stop accumulating time.
export function UsageTracker() {
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

    const send = () => {
      if (document.visibilityState !== 'visible') return
      fetch('/api/heartbeat', { method: 'POST' }).catch(() => {})
    }

    const start = () => {
      if (interval) return
      send()
      interval = setInterval(send, 30_000)
    }
    const stop = () => {
      if (interval) clearInterval(interval)
      interval = null
    }

    const onVisibility = () => (document.visibilityState === 'visible' ? start() : stop())

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', start)
    window.addEventListener('blur', stop)
    start()

    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', start)
      window.removeEventListener('blur', stop)
    }
  }, [])

  return null
}
