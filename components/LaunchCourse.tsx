'use client'
import { useRef, useState } from 'react'
import type { LaunchLane } from '@/lib/problems'
import { LaunchLog, type LaunchRecord } from './LaunchLog'

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

const POST_X = 70
const TRACK_END_X = 348
const PX_PER_CM_PULL = 5

function rubberStrand(x1: number, y1: number, x2: number, y2: number, amplitude: number, segments: number) {
  const dx = (x2 - x1) / segments
  const dy = (y2 - y1) / segments
  let d = `M ${x1} ${y1}`
  for (let i = 1; i < segments; i++) {
    const px = x1 + dx * i
    const py = y1 + dy * i
    const off = (i % 2 === 0 ? -1 : 1) * amplitude
    d += ` L ${px} ${py + off}`
  }
  d += ` L ${x2} ${y2}`
  return d
}

export function LaunchCourse({
  lanes,
  length,
  maxStretch,
  onSolved,
}: {
  lanes: LaunchLane[]
  length: number
  maxStretch: number
  onSolved: () => void
}) {
  const [stretches, setStretches] = useState<Record<string, number>>({})
  const [records, setRecords] = useState<Record<string, LaunchRecord[]>>({})
  const [selected, setSelected] = useState(lanes[0].id)
  const [dragging, setDragging] = useState(false)
  const [carOffset, setCarOffset] = useState<Record<string, number>>({})
  const [launching, setLaunching] = useState<Record<string, boolean>>({})
  const animRef = useRef<number | null>(null)

  const current = stretches[selected] ?? 0
  const scale = 278 / length
  const isLaunching = !!launching[selected]

  const setStretch = (e: React.PointerEvent<SVGSVGElement>) => {
    if (launching[selected]) return
    const rect = e.currentTarget.getBoundingClientRect()
    const dx = ((e.clientX - rect.left) / rect.width) * 360
    setStretches((s) => ({
      ...s,
      [selected]: clamp(Math.round((POST_X - dx) / PX_PER_CM_PULL), 0, maxStretch),
    }))
  }

  const fire = (id = selected) => {
    const stretch = stretches[id] ?? 0
    setDragging(false)
    if (stretch <= 0 || launching[id]) return
    const distance = 4 * stretch * stretch
    const lane = lanes.find((l) => l.id === id)!
    const travelPx = Math.min(distance * scale, TRACK_END_X - POST_X - 17)

    setLaunching((l) => ({ ...l, [id]: true }))
    const t0 = performance.now()
    const duration = 480 + Math.min(420, stretch * 22)
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setCarOffset((c) => ({ ...c, [id]: travelPx * eased }))
      if (t < 1) {
        animRef.current = requestAnimationFrame(step)
      } else {
        animRef.current = null
        setLaunching((l) => ({ ...l, [id]: false }))
        setStretches((s) => ({ ...s, [id]: 0 }))
        setCarOffset((c) => ({ ...c, [id]: 0 }))
        setRecords((r) => {
          const updated = { ...r, [id]: [...(r[id] ?? []), { stretch, distance }] }
          const allDone = lanes.every((l) => (updated[l.id] ?? []).some((x) => Math.abs(x.distance - l.goalCenterCm) <= l.goalToleranceCm))
          if (allDone) setTimeout(onSolved, 400)
          return updated
        })
      }
    }
    animRef.current = requestAnimationFrame(step)
    void lane
  }

  const all = lanes.flatMap((l) => records[l.id] ?? [])

  return (
    <div className="flex flex-col gap-3">
      <svg
        viewBox={`0 0 360 ${lanes.length === 1 ? 130 : 230}`}
        className="w-full"
        style={{ touchAction: 'none' }}
        onPointerMove={(e) => dragging && setStretch(e)}
        onPointerUp={() => fire()}
      >
        {lanes.map((lane, i) => {
          const y = i * 105 + 20
          const stretch = stretches[lane.id] ?? 0
          const hookX = POST_X - stretch * PX_PER_CM_PULL
          const offset = carOffset[lane.id] ?? 0
          const carX = launching[lane.id] ? POST_X + offset : hookX
          const goalX = POST_X + lane.goalCenterCm * scale
          const tension = stretch / maxStretch
          const amplitude = 7 * (1 - tension) + 0.5
          const bandColor = `rgb(${217 + Math.round(38 * tension)}, ${83 - Math.round(50 * tension)}, ${79 - Math.round(50 * tension)})`
          const rulerY = y + 56
          const rulerStartX = POST_X - maxStretch * PX_PER_CM_PULL

          return (
            <g key={lane.id} onPointerDown={() => !isLaunching && setSelected(lane.id)}>
              <text x="8" y={y} fontSize="11" fontWeight="bold">
                {lane.label}
              </text>

              {/* track */}
              <line x1={POST_X} y1={y + 42} x2={TRACK_END_X} y2={y + 42} stroke="#B9A88A" strokeWidth="3" />

              {/* goal zone */}
              <rect x={goalX - lane.goalToleranceCm * scale} y={y + 18} width={lane.goalToleranceCm * 2 * scale} height="48" fill="#5FB85F" opacity=".3" />
              <text x={goalX} y={y + 15} textAnchor="middle" fontSize="12">
                🏁 {lane.goalCenterCm}cm
              </text>

              {/* pull-back ruler */}
              <line x1={rulerStartX} y1={rulerY} x2={POST_X} y2={rulerY} stroke="#C9BFA8" strokeWidth="2" />
              {Array.from({ length: maxStretch / 5 + 1 }, (_, n) => n * 5).map((cm) => {
                const tx = POST_X - cm * PX_PER_CM_PULL
                return (
                  <g key={cm}>
                    <line x1={tx} y1={rulerY - 4} x2={tx} y2={rulerY + 4} stroke="#9A6B45" strokeWidth="1.5" />
                    <text x={tx} y={rulerY + 15} textAnchor="middle" fontSize="8" fill="#7A6A52">
                      {cm}
                    </text>
                  </g>
                )
              })}
              {selected === lane.id && stretch > 0 && (
                <g style={{ transition: 'transform 60ms linear' }} transform={`translate(${hookX}, ${rulerY})`}>
                  <path d="M 0 -9 L -5 -16 L 5 -16 Z" fill="#D9534F" />
                  <text x="0" y="-19" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#D9534F">
                    {stretch}cm
                  </text>
                </g>
              )}

              {/* post */}
              <line x1={POST_X} y1={y + 10} x2={POST_X} y2={y + 42} stroke="#7A6A52" strokeWidth="5" />

              {/* rubber strands */}
              <path
                d={rubberStrand(POST_X, y + 10, carX + 17, y + 10, amplitude, 6)}
                fill="none"
                stroke={bandColor}
                strokeWidth={3 + tension}
                strokeLinecap="round"
              />
              <path
                d={rubberStrand(POST_X, y + 10, carX + 17, y + 20, amplitude, 6)}
                fill="none"
                stroke={bandColor}
                strokeWidth={3 + tension}
                strokeLinecap="round"
              />

              {/* car */}
              <g
                onPointerDown={(e) => {
                  if (isLaunching) return
                  e.stopPropagation()
                  setSelected(lane.id)
                  setDragging(true)
                }}
              >
                {launching[lane.id] && (
                  <g opacity={0.5}>
                    <line x1={carX - 6} y1={y + 10} x2={carX - 16} y2={y + 10} stroke="#B9A88A" strokeWidth="2" strokeDasharray="2 3" />
                  </g>
                )}
                <rect x={carX} y={y - 1} width="34" height="22" rx="6" fill="#FF9040" />
                <circle cx={carX + 8} cy={y + 22} r="4" fill="#3D3A38" />
                <circle cx={carX + 27} cy={y + 22} r="4" fill="#3D3A38" />
                <circle cx={carX + 17} cy={y + 10} r="28" fill="transparent" />
              </g>
            </g>
          )
        })}
      </svg>

      <div className="flex items-center justify-between rounded-xl bg-accent/40 px-4 py-3">
        <span>のばした 長さ</span>
        <strong className="text-2xl">{current}cm</strong>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => fire()}
          disabled={isLaunching || current === 0}
          className="min-h-12 flex-1 rounded-xl bg-primary px-4 font-bold text-primary-foreground disabled:opacity-50"
        >
          🚀 はなす
        </button>
        <button
          onClick={() => setStretches((s) => ({ ...s, [selected]: 0 }))}
          disabled={isLaunching}
          className="min-h-12 rounded-xl border border-border px-4 font-bold disabled:opacity-50"
        >
          ↩ もどす
        </button>
      </div>

      <LaunchLog records={all} courseLength={length} />
    </div>
  )
}
