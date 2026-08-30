'use client'
import { useRef, useState } from 'react'
import type { ChemExperimentConfig } from '@/lib/quizProblems'

const VB = '0 0 340 220'

function Chip({ x, y, label, color = 'var(--chem-metal)', onPointerDown, dimmed }: { x: number; y: number; label: string; color?: string; onPointerDown?: (e: React.PointerEvent) => void; dimmed?: boolean }) {
  return (
    <g transform={`translate(${x},${y})`} onPointerDown={onPointerDown} className={onPointerDown ? 'cursor-grab active:cursor-grabbing' : ''} opacity={dimmed ? 0.35 : 1}>
      <rect x={-34} y={-16} width={68} height={32} rx={10} fill={color} stroke="white" strokeWidth={2} />
      <text x={0} y={5} textAnchor="middle" fontSize={11} fontWeight={700} fill="white">{label}</text>
    </g>
  )
}

function Instruction({ text }: { text: string }) {
  return <p className="text-center text-sm font-bold leading-relaxed text-muted-foreground">{text}</p>
}

/** 1. Two-pan balance: itemA is preset on the left pan, itemB is dragged onto the right pan. */
function BalanceExperiment({ itemA, itemB, onDone }: { itemA: { label: string; grams: number; color: string }; itemB: { label: string; grams: number; color: string }; onDone: () => void }) {
  const [placed, setPlaced] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragY, setDragY] = useState<number | null>(null)
  const tilt = placed ? Math.max(-14, Math.min(14, (itemB.grams - itemA.grams) / Math.max(itemA.grams, itemB.grams) * 14)) : 0

  const down = (e: React.PointerEvent) => {
    if (placed) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragY(0)
  }
  const move = (e: React.PointerEvent) => {
    if (dragY === null) return
    const rect = svgRef.current!.getBoundingClientRect()
    const y = ((e.clientY - rect.top) / rect.height) * 220
    setDragY(y)
  }
  const up = () => {
    if (dragY !== null && dragY > 90) {
      setPlaced(true)
      setTimeout(onDone, 600)
    }
    setDragY(null)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Instruction text={placed ? `${itemA.label} ${itemA.grams}g／${itemB.label} ${itemB.grams}g` : `${itemB.label}のチップを、右のさらまでドラッグしよう`} />
      <svg ref={svgRef} viewBox={VB} className="w-full max-w-[380px] select-none" style={{ touchAction: 'none' }} onPointerMove={move} onPointerUp={up} onPointerLeave={up}>
        <g style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: '170px 90px', transition: 'transform 300ms ease-out' }}>
          <line x1="60" y1="90" x2="280" y2="90" stroke="var(--chem-pan)" strokeWidth={6} strokeLinecap="round" />
          <rect x={38} y={80} width={44} height={26} rx={6} fill={itemA.color} stroke="white" strokeWidth={2} />
          <text x={60} y={98} textAnchor="middle" fontSize={10} fontWeight={700} fill="white">{itemA.grams}g</text>
          {placed && (
            <>
              <rect x={238} y={80} width={44} height={26} rx={6} fill={itemB.color} stroke="white" strokeWidth={2} />
              <text x={260} y={98} textAnchor="middle" fontSize={10} fontWeight={700} fill="white">{itemB.grams}g</text>
            </>
          )}
        </g>
        <path d="M170 90 L150 130 L190 130 Z" fill="var(--chem-pan)" />
        <circle cx={170} cy={90} r={5} fill="var(--chem-pan)" />
        {!placed && (
          <Chip x={dragY !== null ? 260 : 260} y={dragY !== null ? dragY : 170} label={itemB.label} color={itemB.color} onPointerDown={down} />
        )}
      </svg>
    </div>
  )
}

/** 2. Sequential single-pan weighing that reveals a conserved sum. */
function ConserveWeightExperiment({ itemA, itemB, onDone }: { itemA: { label: string; grams: number }; itemB: { label: string; grams: number }; onDone: () => void }) {
  const [onPan, setOnPan] = useState<string[]>([])
  const total = onPan.reduce((sum, id) => sum + (id === 'a' ? itemA.grams : itemB.grams), 0)
  const place = (id: string) => {
    if (onPan.includes(id)) return
    const next = [...onPan, id]
    setOnPan(next)
    if (next.length === 2) setTimeout(onDone, 700)
  }
  return (
    <div className="flex flex-col items-center gap-3">
      <Instruction text={onPan.length < 2 ? 'ふたつのチップを、順番にはかりへドラッグしよう' : `合わせた重さは ${total}g だよ`} />
      <svg viewBox={VB} className="w-full max-w-[380px] select-none" style={{ touchAction: 'none' }}>
        <rect x={110} y={110} width={120} height={16} rx={8} fill="var(--chem-pan)" />
        <rect x={150} y={70} width={40} height={40} rx={8} fill="var(--card)" stroke="var(--chem-pan)" strokeWidth={3} />
        <text x={170} y={95} textAnchor="middle" fontSize={13} fontWeight={900} fill="var(--foreground)">{total}g</text>
        <rect x={150} y={126} width={40} height={64} fill="var(--chem-pan)" />
        {(['a', 'b'] as const).map((id, i) => {
          const item = id === 'a' ? itemA : itemB
          const placed = onPan.includes(id)
          return (
            <Chip
              key={id}
              x={placed ? 170 : 70 + i * 200}
              y={placed ? 60 - onPan.indexOf(id) * 4 : 40}
              label={`${item.label} ${item.grams}g`}
              color={id === 'a' ? 'var(--chem-water-dark)' : 'var(--chem-salt)'}
              dimmed={placed}
              onPointerDown={placed ? undefined : () => place(id)}
            />
          )
        })}
      </svg>
      <p className="text-xs font-bold text-muted-foreground">（チップはタップでも置けるよ）</p>
    </div>
  )
}

/** 3. Drag the clay downward to flatten it; weight stays the same. */
function ClayPressExperiment({ label, grams, onDone }: { label: string; grams: number; onDone: () => void }) {
  const [squish, setSquish] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)
  const down = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragging.current = true
  }
  const move = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const rect = svgRef.current!.getBoundingClientRect()
    const local = ((e.clientY - rect.top) / rect.height) * 220 - 90
    setSquish(Math.max(0, Math.min(1, local / 50)))
  }
  const up = () => {
    dragging.current = false
    if (squish > 0.7) setTimeout(onDone, 500)
  }
  const rx = 40 + squish * 32
  const ry = 40 - squish * 24
  return (
    <div className="flex flex-col items-center gap-3">
      <Instruction text={squish > 0.7 ? `重さは ${grams}g のまま、形だけ変わったね` : `${label}を下にドラッグして、おしつぶしてみよう`} />
      <svg ref={svgRef} viewBox={VB} className="w-full max-w-[380px] select-none" style={{ touchAction: 'none' }} onPointerMove={move} onPointerUp={up} onPointerLeave={up}>
        <rect x={130} y={165} width={80} height={14} rx={7} fill="var(--chem-pan)" />
        <ellipse cx={170} cy={165 - ry} rx={rx} ry={Math.max(18, ry)} fill="#c9a876" stroke="#9c8058" strokeWidth={3} onPointerDown={down} className="cursor-grab active:cursor-grabbing" />
        <text x={170} y={168} textAnchor="middle" fontSize={11} fontWeight={900} fill="var(--foreground)">{grams}g</text>
      </svg>
    </div>
  )
}

/** 4. Linear push (syringe): drag the plunger to compress the trapped air. */
function LinearPushExperiment({ label, onDone }: { label: string; onDone: () => void }) {
  const [push, setPush] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)
  const down = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragging.current = true
  }
  const move = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const rect = svgRef.current!.getBoundingClientRect()
    const local = ((e.clientX - rect.left) / rect.width) * 340
    const clamped = Math.max(70, Math.min(210, local))
    setPush((clamped - 70) / 140)
  }
  const up = () => {
    dragging.current = false
    if (push > 0.6) setTimeout(onDone, 500)
  }
  const plungerX = 70 + push * 140
  return (
    <div className="flex flex-col items-center gap-3">
      <Instruction text={push > 0.6 ? `${label}がぎゅっとちぢんだね` : '取っ手を右にドラッグして、空気を押してみよう'} />
      <svg ref={svgRef} viewBox={VB} className="w-full max-w-[380px] select-none" style={{ touchAction: 'none' }} onPointerMove={move} onPointerUp={up} onPointerLeave={up}>
        <rect x={210} y={80} width={90} height={44} rx={6} fill="none" stroke="var(--chem-metal)" strokeWidth={4} />
        <rect x={plungerX + 140} y={84} width={210 - plungerX} height={36} fill="var(--chem-water)" opacity={0.7} />
        <rect x={plungerX} y={70} width={10} height={64} rx={3} fill="var(--chem-metal)" onPointerDown={down} className="cursor-grab active:cursor-grabbing" />
        <rect x={plungerX - 26} y={92} width={26} height={20} rx={4} fill="var(--chem-metal)" onPointerDown={down} className="cursor-grab active:cursor-grabbing" />
      </svg>
    </div>
  )
}

/** 5. Dissolve: drag spoon/chip items into one or more cups; items dissolve, sink, or float. */
function DissolveExperiment({ cups, onDone }: { cups: { label: string; items: { label: string; behavior: 'dissolve' | 'sink' | 'float'; limit?: number }[] }[]; onDone: () => void }) {
  const [state, setState] = useState<Record<number, { dissolvedCount: number; addedFixed: string[] }>>({})

  const totalSteps = cups.reduce((s, c) => s + (c.items[0]?.limit ? c.items[0].limit : c.items.length), 0)
  const doneSteps = Object.values(state).reduce((s, v) => s + v.dissolvedCount + v.addedFixed.length, 0)

  const addToCup = (cupIndex: number) => {
    const cup = cups[cupIndex]
    const cur = state[cupIndex] ?? { dissolvedCount: 0, addedFixed: [] }
    if (cup.items.length === 1 && cup.items[0].limit) {
      if (cur.dissolvedCount >= cup.items[0].limit + 2) return
      const next = { ...cur, dissolvedCount: cur.dissolvedCount + 1 }
      setState((s) => ({ ...s, [cupIndex]: next }))
    } else {
      const remaining = cup.items.filter((it) => !cur.addedFixed.includes(it.label))
      if (remaining.length === 0) return
      const next = { ...cur, addedFixed: [...cur.addedFixed, remaining[0].label] }
      setState((s) => ({ ...s, [cupIndex]: next }))
    }
  }

  const allDone = doneSteps >= totalSteps
  const checkDone = () => {
    if (Object.values({ ...state }).reduce((s, v) => s + v.dissolvedCount + v.addedFixed.length, 0) >= totalSteps) {
      setTimeout(onDone, 500)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Instruction text={allDone ? 'ようすを見てみよう' : 'カップの上のボタンをタップして、水に入れてみよう'} />
      <div className="flex w-full max-w-[380px] justify-center gap-6">
        {cups.map((cup, ci) => {
          const cur = state[ci] ?? { dissolvedCount: 0, addedFixed: [] }
          const limit = cup.items[0]?.limit
          const saturated = limit ? cur.dissolvedCount > limit : false
          const pileCount = limit ? Math.max(0, cur.dissolvedCount - limit) : 0
          return (
            <div key={cup.label} className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground">{cup.label}</span>
              <svg viewBox="0 0 120 150" className="w-28 select-none">
                <path d="M20 30 L30 130 Q30 140 40 140 L80 140 Q90 140 90 130 L100 30 Z" fill="var(--chem-water)" opacity={0.8} stroke="var(--chem-water-dark)" strokeWidth={3} />
                {Array.from({ length: pileCount }).map((_, i) => (
                  <ellipse key={i} cx={60} cy={130 - i * 5} rx={22 - i} ry={6} fill="var(--chem-salt)" stroke="#c9b98a" strokeWidth={1} />
                ))}
                {cur.addedFixed.map((label, i) => {
                  const item = cup.items.find((it) => it.label === label)!
                  const y = item.behavior === 'float' ? 42 : item.behavior === 'sink' ? 128 : 80
                  return (
                    <g key={label} className="animate-chem-fade-in">
                      <circle cx={40 + i * 20} cy={y} r={9} fill={item.behavior === 'dissolve' ? 'var(--chem-water-dark)' : item.behavior === 'float' ? '#e8b33a' : '#a56a34'} opacity={item.behavior === 'dissolve' ? 0.25 : 1} />
                    </g>
                  )
                })}
                {saturated && <text x={60} y={20} textAnchor="middle" fontSize={9} fontWeight={900} fill="var(--chem-accent, #e2596b)">とけなくなった！</text>}
              </svg>
              {cup.items.length === 1 && cup.items[0].limit ? (
                <button
                  onClick={() => {
                    addToCup(ci)
                    checkDone()
                  }}
                  className="min-h-9 rounded-full bg-[#174d70] px-4 text-xs font-black text-white active:scale-95"
                >
                  {cup.items[0].label}をひとさじ入れる
                </button>
              ) : (
                <div className="flex flex-wrap justify-center gap-1.5">
                  {cup.items.map((it) => (
                    <button
                      key={it.label}
                      disabled={cur.addedFixed.includes(it.label)}
                      onClick={() => {
                        addToCup(ci)
                        checkDone()
                      }}
                      className="min-h-9 rounded-full bg-[#174d70] px-3 text-xs font-black text-white disabled:opacity-30"
                    >
                      {it.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** 6. Heat / cool: drag a flame or ice icon onto the object to trigger a state or size change. */
function HeatCoolExperiment({ mode, itemLabel, onDone }: { mode: 'heat-water' | 'freeze-water' | 'expand-metal' | 'shrink-metal'; itemLabel: string; onDone: () => void }) {
  const [applied, setApplied] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)

  const toolLabel = mode === 'heat-water' || mode === 'expand-metal' ? '🔥' : '🧊'
  const isWater = mode === 'heat-water' || mode === 'freeze-water'

  const down = (e: React.PointerEvent) => {
    if (applied) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragging.current = true
  }
  const move = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const rect = svgRef.current!.getBoundingClientRect()
    setPos({ x: ((e.clientX - rect.left) / rect.width) * 340, y: ((e.clientY - rect.top) / rect.height) * 220 })
  }
  const up = () => {
    dragging.current = false
    if (pos && Math.hypot(pos.x - 170, pos.y - 130) < 60) {
      setApplied(true)
      setTimeout(onDone, 900)
    }
    setPos(null)
  }

  const instruction = applied
    ? mode === 'heat-water'
      ? 'ふっとうして水蒸気になったね'
      : mode === 'freeze-water'
        ? '氷になって、少し体積が大きくなったね'
        : mode === 'expand-metal'
          ? '金属がふくらんで大きくなったね'
          : '金属がちぢんで小さくなったね'
    : `${toolLabel}のアイコンを、${itemLabel}までドラッグしよう`

  return (
    <div className="flex flex-col items-center gap-3">
      <Instruction text={instruction} />
      <svg ref={svgRef} viewBox={VB} className="w-full max-w-[380px] select-none" style={{ touchAction: 'none' }} onPointerMove={move} onPointerUp={up} onPointerLeave={up}>
        {isWater ? (
          <>
            <rect x={110} y={110} width={120} height={80} rx={10} fill="none" stroke="var(--chem-metal)" strokeWidth={4} />
            <rect x={114} y={140} width={112} height={48} fill={applied && mode === 'freeze-water' ? 'var(--chem-ice)' : 'var(--chem-water)'} opacity={0.85} />
            {applied && mode === 'heat-water' && (
              <>
                {[0, 1, 2].map((i) => (
                  <circle key={i} cx={140 + i * 30} cy={175} r={4} fill="white" opacity={0.8} className="animate-chem-bubble-rise" style={{ animationDelay: `${i * 0.3}s` }} />
                ))}
                <path d="M150 105 Q145 90 155 80 M190 105 Q185 90 195 80" stroke="#d9d9d9" strokeWidth={4} fill="none" strokeLinecap="round" opacity={applied ? 0.8 : 0} />
              </>
            )}
            {applied && mode === 'freeze-water' && (
              <rect x={114} y={126} width={112} height={4} fill="white" opacity={0.9} />
            )}
          </>
        ) : (
          <>
            <circle cx={170} cy={150} r={applied ? (mode === 'expand-metal' ? 30 : 20) : 24} fill="var(--chem-metal)" stroke="white" strokeWidth={3} style={{ transition: 'r 500ms ease-out' }} />
            <rect x={140} y={110} width={60} height={10} rx={5} fill="none" stroke="#7A6A4E" strokeWidth={4} />
          </>
        )}
        {!applied && (
          <g transform={`translate(${pos?.x ?? 60},${pos?.y ?? 50})`} onPointerDown={down} className="cursor-grab active:cursor-grabbing">
            <circle r={20} fill={toolLabel === '🔥' ? 'var(--chem-flame)' : 'var(--chem-ice)'} stroke="white" strokeWidth={3} />
            <text y={6} textAnchor="middle" fontSize={18}>{toolLabel}</text>
          </g>
        )}
      </svg>
    </div>
  )
}

/** 7. Sweep: drag a tool horizontally across a row of targets; matching targets react. */
function SweepExperiment({ mode, targets, onDone }: { mode: 'evaporate' | 'magnet'; targets: { label: string; reacts: boolean }[]; onDone: () => void }) {
  const [hit, setHit] = useState<Set<number>>(new Set())
  const svgRef = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)
  const [toolX, setToolX] = useState(40)
  const spacing = 260 / Math.max(1, targets.length)

  const down = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragging.current = true
  }
  const move = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const rect = svgRef.current!.getBoundingClientRect()
    const x = Math.max(30, Math.min(310, ((e.clientX - rect.left) / rect.width) * 340))
    setToolX(x)
    targets.forEach((t, i) => {
      const cx = 50 + i * spacing
      if (Math.abs(x - cx) < 24) {
        setHit((prev) => {
          if (prev.has(i)) return prev
          const next = new Set(prev)
          next.add(i)
          return next
        })
      }
    })
  }
  const up = () => {
    dragging.current = false
    if (hit.size >= targets.length) setTimeout(onDone, 500)
  }

  const toolEmoji = mode === 'evaporate' ? '☀️' : '🧲'

  return (
    <div className="flex flex-col items-center gap-3">
      <Instruction text={hit.size >= targets.length ? 'ぜんぶ たしかめられたね' : `${toolEmoji}を左右にドラッグして、それぞれに近づけよう`} />
      <svg ref={svgRef} viewBox={VB} className="w-full max-w-[380px] select-none" style={{ touchAction: 'none' }} onPointerMove={move} onPointerUp={up} onPointerLeave={up}>
        {targets.map((t, i) => {
          const cx = 50 + i * spacing
          const reacted = hit.has(i) && t.reacts
          const evaporated = mode === 'evaporate' && reacted
          return (
            <g key={t.label}>
              {mode === 'evaporate' ? (
                <ellipse cx={cx} cy={170} rx={evaporated ? 4 : 26} ry={evaporated ? 2 : 8} fill="var(--chem-water)" opacity={evaporated ? 0.15 : 0.85} style={{ transition: 'all 500ms ease-out' }} />
              ) : (
                <rect x={cx - 24} y={155} width={48} height={30} rx={6} fill={hit.has(i) ? (t.reacts ? '#8b95a1' : '#c9cfd4') : '#c9cfd4'} stroke="white" strokeWidth={2} style={{ transform: reacted ? `translateY(${toolX > cx ? -6 : 6}px)` : 'none', transition: 'transform 300ms' }} />
              )}
              <text x={cx} y={200} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">{t.label}</text>
            </g>
          )
        })}
        <g transform={`translate(${toolX},50)`} onPointerDown={down} className="cursor-grab active:cursor-grabbing">
          <circle r={18} fill="var(--chem-glow)" stroke="white" strokeWidth={3} />
          <text y={6} textAnchor="middle" fontSize={16}>{toolEmoji}</text>
        </g>
      </svg>
    </div>
  )
}

/** 8. Condense: drag an ice cube into a cup; droplets form on the outside. */
function CondenseExperiment({ onDone }: { onDone: () => void }) {
  const [dropped, setDropped] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)

  const down = (e: React.PointerEvent) => {
    if (dropped) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragging.current = true
  }
  const move = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const rect = svgRef.current!.getBoundingClientRect()
    setPos({ x: ((e.clientX - rect.left) / rect.width) * 340, y: ((e.clientY - rect.top) / rect.height) * 220 })
  }
  const up = () => {
    dragging.current = false
    if (pos && Math.hypot(pos.x - 170, pos.y - 140) < 60) {
      setDropped(true)
      setTimeout(onDone, 1400)
    }
    setPos(null)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Instruction text={dropped ? 'コップの外側に水てきがついたね' : '🧊の氷を、コップの中までドラッグしよう'} />
      <svg ref={svgRef} viewBox={VB} className="w-full max-w-[380px] select-none" style={{ touchAction: 'none' }} onPointerMove={move} onPointerUp={up} onPointerLeave={up}>
        <path d="M130 90 L145 190 Q145 198 153 198 L187 198 Q195 198 195 190 L210 90 Z" fill="none" stroke="var(--chem-water-dark)" strokeWidth={4} />
        {dropped && (
          <>
            <path d="M133 100 L147 188 Q147 194 153 194 L187 194 Q193 194 193 188 L207 100 Z" fill="var(--chem-water)" opacity={0.5} />
            {[0, 1, 2, 3].map((i) => (
              <circle key={i} cx={125 + i * 30} cy={110 + (i % 2) * 40} r={3.5} fill="var(--chem-water-dark)" opacity={0} className="animate-chem-fade-in" style={{ animationDelay: `${0.3 + i * 0.25}s` }} />
            ))}
          </>
        )}
        {!dropped && (
          <g transform={`translate(${pos?.x ?? 260},${pos?.y ?? 60})`} onPointerDown={down} className="cursor-grab active:cursor-grabbing">
            <rect x={-16} y={-16} width={32} height={32} rx={6} fill="var(--chem-ice)" stroke="white" strokeWidth={3} />
            <text y={5} textAnchor="middle" fontSize={16}>🧊</text>
          </g>
        )}
      </svg>
    </div>
  )
}

/** 9. Filter: drag muddy water into a funnel; sand stays on the paper, clear water drips through. */
function FilterExperiment({ onDone }: { onDone: () => void }) {
  const [poured, setPoured] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)

  const down = (e: React.PointerEvent) => {
    if (poured) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragging.current = true
  }
  const move = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const rect = svgRef.current!.getBoundingClientRect()
    setPos({ x: ((e.clientX - rect.left) / rect.width) * 340, y: ((e.clientY - rect.top) / rect.height) * 220 })
  }
  const up = () => {
    dragging.current = false
    if (pos && Math.hypot(pos.x - 170, pos.y - 80) < 60) {
      setPoured(true)
      setTimeout(onDone, 1400)
    }
    setPos(null)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Instruction text={poured ? '砂はろ紙に残り、すきとおった水だけが下に落ちたね' : 'どろ水のコップを、ろうとまでドラッグしよう'} />
      <svg ref={svgRef} viewBox={VB} className="w-full max-w-[380px] select-none" style={{ touchAction: 'none' }} onPointerMove={move} onPointerUp={up} onPointerLeave={up}>
        <path d="M130 60 L210 60 L180 110 L160 110 Z" fill="none" stroke="var(--chem-metal)" strokeWidth={4} />
        {poured && <path d="M133 63 L207 63 L182 105 L158 105 Z" fill="#a56a34" opacity={0.5} />}
        {poured && <ellipse cx={170} cy={100} rx={22} ry={6} fill="#a56a34" opacity={0.85} />}
        <rect x={145} y={150} width={50} height={44} rx={6} fill="none" stroke="var(--chem-water-dark)" strokeWidth={3} />
        {poured && (
          <>
            <rect x={148} y={175} width={44} height={16} fill="var(--chem-water)" opacity={0.7} />
            <circle cx={170} cy={125} r={3} fill="var(--chem-water)" className="animate-chem-drip" />
          </>
        )}
        {!poured && (
          <g transform={`translate(${pos?.x ?? 60},${pos?.y ?? 150})`} onPointerDown={down} className="cursor-grab active:cursor-grabbing">
            <rect x={-20} y={-24} width={40} height={44} rx={6} fill="#a56a34" opacity={0.7} stroke="white" strokeWidth={2} />
            <text y={2} textAnchor="middle" fontSize={9} fontWeight={900} fill="white">どろ水</text>
          </g>
        )}
      </svg>
    </div>
  )
}

/** 10. Circuit: drag material chips into a gap; the bulb glows only for conductors. */
function CircuitExperiment({ materials, onDone }: { materials: { label: string; conducts: boolean }[]; onDone: () => void }) {
  const [current, setCurrent] = useState<number | null>(null)
  const [tried, setTried] = useState<Set<number>>(new Set())

  const place = (i: number) => {
    setCurrent(i)
    setTried((prev) => {
      const next = new Set(prev)
      next.add(i)
      if (next.size >= 2) setTimeout(onDone, 700)
      return next
    })
  }

  const lit = current !== null && materials[current].conducts

  return (
    <div className="flex flex-col items-center gap-3">
      <Instruction text="下の材料をタップして、回路のすきまに入れてみよう" />
      <svg viewBox={VB} className="w-full max-w-[380px] select-none">
        <rect x={90} y={70} width={160} height={90} rx={12} fill="none" stroke="var(--chem-metal)" strokeWidth={4} />
        <circle cx={170} cy={70} r={16} fill={lit ? 'var(--chem-glow)' : 'var(--chem-salt)'} stroke="var(--chem-metal)" strokeWidth={3} className={lit ? 'animate-chem-glow-pulse' : ''} />
        <text x={170} y={40} textAnchor="middle" fontSize={22}>💡</text>
        <rect x={95} y={150} width={30} height={16} rx={3} fill="var(--chem-metal)" />
        <rect x={90} y={100} width={12} height={30} fill="none" />
        <text x={170} y={165} textAnchor="middle" fontSize={10} fontWeight={900} fill="var(--foreground)">
          {current !== null ? materials[current].label : 'すきま'}
        </text>
      </svg>
      <div className="flex flex-wrap justify-center gap-2">
        {materials.map((m, i) => (
          <button
            key={m.label}
            onClick={() => place(i)}
            className={`min-h-10 rounded-full border-2 px-4 text-xs font-black transition ${current === i ? 'border-[#174d70] bg-[#174d70] text-white' : 'border-border bg-card text-foreground'}`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ChemExperiment({ experiment, onDone }: { experiment: ChemExperimentConfig; onDone: () => void }) {
  switch (experiment.kind) {
    case 'balance':
      return <BalanceExperiment itemA={experiment.itemA} itemB={experiment.itemB} onDone={onDone} />
    case 'conserve-weight':
      return <ConserveWeightExperiment itemA={experiment.itemA} itemB={experiment.itemB} onDone={onDone} />
    case 'clay-press':
      return <ClayPressExperiment label={experiment.label} grams={experiment.grams} onDone={onDone} />
    case 'linear-push':
      return <LinearPushExperiment label={experiment.label} onDone={onDone} />
    case 'dissolve':
      return <DissolveExperiment cups={experiment.cups} onDone={onDone} />
    case 'heat-cool':
      return <HeatCoolExperiment mode={experiment.mode} itemLabel={experiment.itemLabel} onDone={onDone} />
    case 'sweep':
      return <SweepExperiment mode={experiment.mode} targets={experiment.targets} onDone={onDone} />
    case 'condense':
      return <CondenseExperiment onDone={onDone} />
    case 'filter':
      return <FilterExperiment onDone={onDone} />
    case 'circuit':
      return <CircuitExperiment materials={experiment.materials} onDone={onDone} />
    default:
      return null
  }
}
