'use client'
import Link from 'next/link'
import { Backpack, Compass, Home, Minus, Plus, Smile, Sparkles, Trophy } from 'lucide-react'

export function MapControls({
  points,
  showHome,
  onZoomIn,
  onZoomOut,
  onHome,
  regionPill,
  diagnosisNear,
}: {
  points: number
  showHome: boolean
  onZoomIn: () => void
  onZoomOut: () => void
  onHome: () => void
  regionPill: { name: string; cleared: number; total: number } | null
  diagnosisNear: string | null
}) {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-2 p-3 sm:p-4">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border-2 border-[#0e4b69] bg-[#f7c94b] px-4 py-2 font-black text-[#3d3a38] shadow-[0_4px_0_#174d70]">
          <Sparkles className="size-5" /> {points}
        </div>
        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2">
          {/* Interest diagnosis — prominent, to the left of the round buttons. */}
          <Link
            href="/diagnosis"
            aria-label="きょうみ診断"
            className="flex h-12 items-center gap-2 rounded-full border-2 border-[#0e4b69] bg-gradient-to-b from-[#ffe888] to-[#f7c94b] px-3 shadow-[0_4px_0_#174d70] active:translate-y-0.5"
          >
            <Compass className="size-5 shrink-0 text-[#c96a1e]" />
            <span className="flex flex-col leading-none">
              <span className="text-[10px] font-bold text-[#8a6a1e]">いまの きみは</span>
              <span className="text-xs font-black text-[#3d3a38] sm:text-sm">
                {diagnosisNear ? `${diagnosisNear}に近い！` : 'しんだんしてみよう'}
              </span>
            </span>
            <span className="text-sm font-black text-[#8a6a1e]">›</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/avatar"
              aria-label="アバター"
              className="flex size-12 items-center justify-center rounded-full border-2 border-[#0e4b69] bg-[#e07a9b] text-white shadow-[0_4px_0_#174d70]"
            >
              <Smile className="size-6" />
            </Link>
            <Link
              href="/ranking"
              aria-label="ランキング"
              className="flex size-12 items-center justify-center rounded-full border-2 border-[#0e4b69] bg-[#f0a63e] text-white shadow-[0_4px_0_#174d70]"
            >
              <Trophy className="size-6" />
            </Link>
            <Link
              href="/bag"
              aria-label="もちもの"
              className="flex size-12 items-center justify-center rounded-full border-2 border-[#0e4b69] bg-[#286b8e] text-white shadow-[0_4px_0_#174d70]"
            >
              <Backpack className="size-6" />
            </Link>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-3 sm:p-4">
        {regionPill ? (
          <div className="pointer-events-auto rounded-full border-2 border-[#0e4b69] bg-[#e9f0d2] px-4 py-2 text-sm font-black text-[#3d3a38] shadow-[0_3px_0_#174d70]">
            {regionPill.total > 0 ? `${regionPill.name}  ${regionPill.cleared} / ${regionPill.total}` : `${regionPill.name}  じゅんびちゅう`}
          </div>
        ) : (
          <span />
        )}
        <div className="pointer-events-auto flex flex-col gap-2">
          {showHome && (
            <button
              onClick={onHome}
              aria-label="ぜんたいを見る"
              className="flex size-12 items-center justify-center rounded-full border-2 border-[#0e4b69] bg-[#286b8e] text-white shadow-[0_4px_0_#174d70]"
            >
              <Home className="size-5" />
            </button>
          )}
          <button
            onClick={onZoomIn}
            aria-label="ズームイン"
            className="flex size-12 items-center justify-center rounded-full border-2 border-[#0e4b69] bg-[#f7c94b] text-[#3d3a38] shadow-[0_4px_0_#174d70]"
          >
            <Plus className="size-5" />
          </button>
          <button
            onClick={onZoomOut}
            aria-label="ズームアウト"
            className="flex size-12 items-center justify-center rounded-full border-2 border-[#0e4b69] bg-[#f7c94b] text-[#3d3a38] shadow-[0_4px_0_#174d70]"
          >
            <Minus className="size-5" />
          </button>
        </div>
      </div>
    </>
  )
}
