'use client'
import Link from 'next/link'
import { Backpack, Home, Minus, Plus, Smile, Sparkles, Trophy } from 'lucide-react'

export function MapControls({
  points,
  showHome,
  onZoomIn,
  onZoomOut,
  onHome,
  regionPill,
}: {
  points: number
  showHome: boolean
  onZoomIn: () => void
  onZoomOut: () => void
  onHome: () => void
  regionPill: { name: string; cleared: number; total: number } | null
}) {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-4">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border-2 border-[#0e4b69] bg-[#f7c94b] px-4 py-2 font-black text-[#3d3a38] shadow-[0_4px_0_#174d70]">
          <Sparkles className="size-5" /> {points}
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
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
