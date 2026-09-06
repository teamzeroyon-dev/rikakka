'use client'
import { useEffect, useRef, useState } from 'react'
import { SkipForward, Volume2, VolumeX } from 'lucide-react'

// Once per visit: sessionStorage survives in-app navigation (going to a stage
// and back to the map) and reloads, but clears when the tab/browser closes — so
// the intro plays on the first home view of a visit and not again.
const PLAYED_KEY = 'rikakka-intro-played'

// Fullscreen intro video. Tries to play with sound; if the browser blocks
// autoplay-with-audio it falls back to muted and offers a tap-to-unmute button.
// A skip button and the video ending both dismiss it.
export function IntroOverlay() {
  const [show, setShow] = useState(false)
  const [muted, setMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Decide on the client only, so the server renders nothing and there is no
  // hydration mismatch (and no flash of the overlay on repeat visits).
  useEffect(() => {
    let played = false
    try {
      played = sessionStorage.getItem(PLAYED_KEY) === '1'
    } catch {
      // storage blocked (private mode etc.) — fall through and just play it
    }
    if (played) return
    try {
      sessionStorage.setItem(PLAYED_KEY, '1')
    } catch {
      // ignore — worst case the intro plays again next navigation
    }
    setShow(true)
  }, [])

  useEffect(() => {
    if (!show) return
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => {
      // Autoplay with sound blocked — retry muted so it still plays.
      v.muted = true
      setMuted(true)
      v.play().catch(() => setShow(false))
    })
  }, [show])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        src="/intro.mp4"
        className="max-h-full max-w-full"
        playsInline
        onEnded={() => setShow(false)}
        onClick={() => {
          const v = videoRef.current
          if (v && v.muted) {
            v.muted = false
            setMuted(false)
          }
        }}
      />
      {muted && (
        <button
          type="button"
          onClick={() => {
            const v = videoRef.current
            if (v) {
              v.muted = false
              setMuted(false)
            }
          }}
          className="absolute bottom-5 left-5 flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-[#3d3a38] shadow-lg"
        >
          <VolumeX className="size-4" /> 音を出す
        </button>
      )}
      {!muted && (
        <span className="absolute bottom-5 left-5 flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-2 text-xs font-black text-white">
          <Volume2 className="size-4" />
        </span>
      )}
      <button
        type="button"
        onClick={() => setShow(false)}
        className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-[#3d3a38] shadow-lg"
      >
        スキップ <SkipForward className="size-4" />
      </button>
    </div>
  )
}
