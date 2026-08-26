'use client'
import { useRef, useState } from 'react'
import type { Weight } from '@/lib/problems'

type Props = { weights: Weight[]; notches: number; onChange: (id: string, position: number) => void; onSolved: () => void }
export function Lever({ weights, notches, onChange, onSolved }: Props) {
  const svgRef = useRef<SVGSVGElement>(null); const [dragging, setDragging] = useState<string | null>(null)
  const left = weights.filter(w => w.position < 0).reduce((sum, w) => sum + w.grams * Math.abs(w.position), 0)
  const right = weights.filter(w => w.position > 0).reduce((sum, w) => sum + w.grams * Math.abs(w.position), 0)
  const max = Math.max(...weights.map(w => w.grams)) * notches
  const tilt = Math.max(-25, Math.min(25, (left - right) / max * 25))
  const point = (event: React.PointerEvent) => { const rect = svgRef.current!.getBoundingClientRect(); return Math.round(Math.max(-notches, Math.min(notches, ((event.clientX - rect.left) / rect.width * 360 - 180) / 24))) }
  const move = (event: React.PointerEvent) => { if (!dragging) return; onChange(dragging, point(event)) }
  const up = () => { if (dragging && left === right) onSolved(); setDragging(null) }
  return <svg ref={svgRef} viewBox="0 0 360 220" className="w-full max-w-[440px] select-none" role="img" aria-label="おもりを動かせるてこ" style={{ touchAction: 'none' }} onPointerMove={move} onPointerUp={up} onPointerLeave={up}>
    <g style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: '180px 140px', transition: 'transform 200ms ease-out' }}>
      <line x1="36" y1="140" x2="324" y2="140" stroke="var(--lever-line)" strokeWidth="8" strokeLinecap="round" />
      {Array.from({ length: notches * 2 + 1 }, (_, i) => { const x = 180 + (i - notches) * 24; return <line key={x} x1={x} y1="130" x2={x} y2="150" stroke="var(--lever-mark)" strokeWidth="2" /> })}
      {weights.map(w => { const x = 180 + w.position * 24; return <g key={w.id} onPointerDown={e => { if (w.movable) { e.currentTarget.setPointerCapture(e.pointerId); setDragging(w.id) } }} className={w.movable ? 'cursor-grab active:cursor-grabbing' : ''}>
        <rect x={x - 20} y="95" width="40" height="40" rx="8" fill={w.movable ? 'var(--lever-move)' : 'var(--lever-fixed)'} /><rect x={x - 28} y="87" width="56" height="56" fill="transparent" />
        <text x={x} y="120" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">{w.grams}g</text>
      </g> })}
    </g><path d="M180 140 L154 184 L206 184 Z" fill="var(--lever-pivot)" /><circle cx="180" cy="140" r="7" fill="var(--lever-pivot)" />
  </svg>
}
