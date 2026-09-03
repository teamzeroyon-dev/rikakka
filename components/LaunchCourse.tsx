'use client'
import { useEffect, useRef, useState } from 'react'
import type { LaunchLane } from '@/lib/problems'
import { LaunchLog, type LaunchRecord } from './LaunchLog'

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

const POST_X = 70
const TRACK_END_X = 348
const PX_PER_CM_PULL = 5
const CAR_WIDTH = 34

type Goal = { minCm: number }
type Achieved = { label: string; stretch: number; distance: number }

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
  onSolved: (achieved: Achieved[]) => void
}) {
  const [goals, setGoals] = useState<Record<string, Goal> | null>(null)
  const [stretches, setStretches] = useState<Record<string, number>>({})
  const [records, setRecords] = useState<Record<string, LaunchRecord[]>>({})
  const [selected, setSelected] = useState(lanes[0].id)
  const [dragging, setDragging] = useState(false)
  const [carOffset, setCarOffset] = useState<Record<string, number>>({})
  const [launching, setLaunching] = useState<Record<string, boolean>>({})
  const [restDistance, setRestDistance] = useState<Record<string, number | null>>({})
  const animRef = useRef<number | null>(null)

  // Randomize goals on the client only after mount, so each attempt (and each fresh
  // mount after a retry) gets a different target and the answer can't be memorized.
  useEffect(() => {
    const g: Record<string, Goal> = {}
    const groupPicks: Record<string, number> = {}
    for (const lane of lanes) {
      let minCm: number
      if (lane.shareGoalGroup) {
        if (!(lane.shareGoalGroup in groupPicks)) {
          const [dmin, dmax] = lane.targetDistanceRange ?? [60, 100]
          groupPicks[lane.shareGoalGroup] = dmin + Math.floor(Math.random() * (dmax - dmin + 1))
        }
        minCm = groupPicks[lane.shareGoalGroup]
      } else if (lane.targetDistanceRange) {
        const [dmin, dmax] = lane.targetDistanceRange
        minCm = dmin + Math.floor(Math.random() * (dmax - dmin + 1))
      } else {
        const [min, max] = lane.targetStretchRange ?? [6, 13]
        const targetStretch = min + Math.floor(Math.random() * (max - min + 1))
        minCm = 4 * (lane.bandCount ?? 1) * targetStretch * targetStretch
      }
      g[lane.id] = { minCm }
    }
    setGoals(g)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const startDrag = (laneId: string) => {
    if (launching[laneId]) return
    setSelected(laneId)
    setDragging(true)
    setRestDistance((r) => ({ ...r, [laneId]: null }))
  }

  const resetLane = (laneId: string) => {
    setStretches((s) => ({ ...s, [laneId]: 0 }))
    setRestDistance((r) => ({ ...r, [laneId]: null }))
  }

  const fire = (id = selected) => {
    if (!goals) return
    const stretch = stretches[id] ?? 0
    setDragging(false)
    if (stretch <= 0 || launching[id]) return
    const bandCount = lanes.find((l) => l.id === id)?.bandCount ?? 1
    const distance = 4 * bandCount * stretch * stretch
    const travelPx = Math.min(distance * scale, TRACK_END_X - POST_X)

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
        setRestDistance((r) => ({ ...r, [id]: distance }))
        setRecords((r) => {
          const hit = Math.round(distance) === Math.round(goals[id].minCm)
          const updated = { ...r, [id]: [...(r[id] ?? []), { stretch, distance, hit }] }
          const allDone = lanes.every((l) => (updated[l.id] ?? []).some((x) => x.hit))
          if (allDone) {
            const achieved: Achieved[] = lanes.map((l) => {
              const hitRecord = (updated[l.id] ?? []).find((x) => x.hit)!
              return { label: l.label, stretch: hitRecord.stretch, distance: Math.round(hitRecord.distance) }
            })
            setTimeout(() => onSolved(achieved), 600)
          }
          return updated
        })
      }
    }
    animRef.current = requestAnimationFrame(step)
  }

  const all = lanes.flatMap((l) => records[l.id] ?? [])
  const currentRest = restDistance[selected] ?? null
  const currentGoal = goals?.[selected]
  const currentHit = currentRest != null && currentGoal ? Math.round(currentRest) === Math.round(currentGoal.minCm) : null

  if (!goals) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl bg-card text-sm text-muted-foreground shadow-sm">
        じゅんび中…
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <svg
        viewBox={`0 0 360 ${lanes.length === 1 ? 130 : lanes.length * 105 + 10}`}
        className="w-full"
        style={{ touchAction: 'none' }}
        onPointerMove={(e) => dragging && setStretch(e)}
        onPointerUp={() => fire()}
      >
        {lanes.map((lane, i) => {
          const goal = goals[lane.id]
          const y = i * 105 + 20
          const stretch = stretches[lane.id] ?? 0
          const rest = restDistance[lane.id] ?? null
          const isLaneLaunching = !!launching[lane.id]
          const frontBumperX = isLaneLaunching
            ? POST_X + (carOffset[lane.id] ?? 0)
            : rest != null
              ? POST_X + rest * scale
              : POST_X - stretch * PX_PER_CM_PULL
          const carX = frontBumperX - CAR_WIDTH
          const goalX = POST_X + goal.minCm * scale
          const tension = stretch / maxStretch
          const amplitude = 7 * (1 - tension) + 0.5
          const bandColor = `rgb(${217 + Math.round(38 * tension)}, ${83 - Math.round(50 * tension)}, ${79 - Math.round(50 * tension)})`
          const rulerY = y + 56
          const rulerStartX = POST_X - maxStretch * PX_PER_CM_PULL

          return (
            <g key={lane.id} onPointerDown={() => !isLaneLaunching && setSelected(lane.id)}>
              <text x="8" y={y} fontSize="11" fontWeight="bold">
                {lane.label}
              </text>

              {/* track */}
              <line x1={POST_X} y1={y + 42} x2={TRACK_END_X} y2={y + 42} stroke="#B9A88A" strokeWidth="3" />

              {/* success zone: reaching or passing the goal line counts */}
              <rect x={goalX} y={y + 37} width={Math.max(0, TRACK_END_X - goalX)} height="10" fill="#5FB85F" opacity="0.22" />

              {/* goal line */}
              <line x1={goalX} y1={y + 8} x2={goalX} y2={y + 50} stroke="#3D8B3D" strokeWidth="2" strokeDasharray="4 3" />
              <text x={goalX} y={y + 4} textAnchor="middle" fontSize="14">
                
              </text>
              <text x={goalX} y={y + 62} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#3D8B3D">
                {Math.round(goal.minCm)}cmまで
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
              {selected === lane.id && stretch > 0 && rest == null && (
                <g style={{ transition: 'transform 60ms linear' }} transform={`translate(${POST_X - stretch * PX_PER_CM_PULL}, ${rulerY})`}>
                  <path d="M 0 -9 L -5 -16 L 5 -16 Z" fill="#D9534F" />
                  <text x="0" y="-19" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#D9534F">
                    {stretch}cm
                  </text>
                </g>
              )}

              {/* post */}
              <line x1={POST_X} y1={y + 10} x2={POST_X} y2={y + 42} stroke="#7A6A52" strokeWidth="5" />

              {/* rubber strands (only visible while pulled back, not after launch settles) */}
              {rest == null && (
                <>
                  <path
                    d={rubberStrand(POST_X, y + 10, frontBumperX, y + 10, amplitude, 6)}
                    fill="none"
                    stroke={bandColor}
                    strokeWidth={3 + tension}
                    strokeLinecap="round"
                  />
                  <path
                    d={rubberStrand(POST_X, y + 10, frontBumperX, y + 20, amplitude, 6)}
                    fill="none"
                    stroke={bandColor}
                    strokeWidth={3 + tension}
                    strokeLinecap="round"
                  />
                </>
              )}

              {/* car */}
              <g onPointerDown={(e) => { e.stopPropagation(); startDrag(lane.id) }}>
                {rest != null && !isLaneLaunching && (
                  <text x={carX + 17} y={y - 8} textAnchor="middle" fontSize="14">
                    {rest >= goal.minCm ? '' : ''}
                  </text>
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

      {currentHit != null && (
        <p className={`rounded-xl px-4 py-2 text-center text-sm font-bold ${currentHit ? 'bg-[#5FB85F]/20 text-[#3D8B3D]' : 'bg-accent text-muted-foreground'}`}>
          {currentHit ? 'ゴールに ぴったり とどいた！' : `ゴールまで あと ${Math.abs(Math.round((currentGoal?.minCm ?? 0) - (currentRest ?? 0)))}cm。長さを 調整しよう`}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => fire()}
          disabled={isLaunching || current === 0}
          className="min-h-12 flex-1 rounded-xl bg-primary px-4 font-bold text-primary-foreground disabled:opacity-50"
        >
           はなす
        </button>
        <button
          onClick={() => resetLane(selected)}
          disabled={isLaunching}
          className="min-h-12 rounded-xl border border-border px-4 font-bold disabled:opacity-50"
        >
          もどす
        </button>
      </div>

      <LaunchLog records={all} courseLength={length} />
    </div>
  )
}
