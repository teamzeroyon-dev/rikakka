'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import {
  WORLD_H,
  WORLD_W,
  getMapRegion,
  getNodesForRegion,
  getPrevNodeInRegion,
  getSugorokuNode,
  mapRegions,
  themeColors,
  type MapRegion,
} from '@/lib/world'
import {
  clampW,
  deriveH,
  easeInOutCubic,
  kFromW,
  pointInPolygon,
  polygonBBox,
  screenToWorld,
  type VBState,
} from '@/lib/viewbox'
import { MapIsland } from '@/components/MapIsland'
import { MapSugoroku, getNodeStatus } from '@/components/MapSugoroku'
import { MapControls } from '@/components/MapControls'
import { useSave } from '@/lib/progress'
import { getProblem } from '@/lib/problems'
import { getChemStage } from '@/lib/quizProblems'

type Toast = { id: number; message: string }
type Pointer = { x: number; y: number }
type Gesture = { type: 'pan' } | { type: 'pinch'; startDist: number; startVb: VBState; startMid: Pointer }

function computeRegionTarget(region: MapRegion, aspect: number): VBState {
  const { minX, maxX, minY, maxY } = polygonBBox(region.polygon)
  const w0 = (maxX - minX) * 1.24
  const h0 = (maxY - minY) * 1.24
  let targetW = Math.max(w0, h0 * aspect)
  if (WORLD_W / targetW < 3.2) targetW = WORLD_W / 4
  targetW = clampW(targetW)
  const targetH = targetW / aspect
  return { x: (minX + maxX) / 2 - targetW / 2, y: (minY + maxY) / 2 - targetH / 2, w: targetW }
}

export function WorldMap() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [size, setSize] = useState({ w: 1, h: 1 })
  const [vb, setVb] = useState<VBState>({ x: 0, y: 0, w: WORLD_W })
  const vbRef = useRef(vb)
  const initializedRef = useRef(false)
  const { save } = useSave()
  const [toast, setToast] = useState<Toast | null>(null)
  const [lockedNode, setLockedNode] = useState<string | null>(null)
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null)

  useEffect(() => {
    vbRef.current = vb
  }, [vb])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      const cw = entry.contentRect.width
      const ch = entry.contentRect.height
      setSize({ w: cw, h: ch })
      if (!initializedRef.current && cw > 0 && ch > 0) {
        initializedRef.current = true
        const h = deriveH(WORLD_W, cw, ch)
        setVb({ x: 0, y: (WORLD_H - h) / 2, w: WORLD_W })
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const animRef = useRef<number | null>(null)
  const cancelAnim = useCallback(() => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current)
      animRef.current = null
    }
  }, [])
  const animateTo = useCallback(
    (target: VBState, duration = 520) => {
      cancelAnim()
      const start = { ...vbRef.current }
      const t0 = performance.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / duration)
        const e = easeInOutCubic(t)
        const next = {
          x: start.x + (target.x - start.x) * e,
          y: start.y + (target.y - start.y) * e,
          w: start.w + (target.w - start.w) * e,
        }
        vbRef.current = next
        setVb(next)
        if (t < 1) animRef.current = requestAnimationFrame(step)
        else animRef.current = null
      }
      animRef.current = requestAnimationFrame(step)
    },
    [cancelAnim],
  )

  const showToast = useCallback((message: string) => setToast({ id: Date.now(), message }), [])
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(timer)
  }, [toast])

  const getRect = () => svgRef.current!.getBoundingClientRect()

  const pointers = useRef(new Map<number, Pointer>())
  const gesture = useRef<Gesture | null>(null)
  const tapInfo = useRef<{ x: number; y: number; time: number; moved: boolean } | null>(null)
  const lastTapRef = useRef<{ x: number; y: number; time: number } | null>(null)

  const focusOnNode = useCallback(
    (id: string) => {
      const node = getSugorokuNode(id)
      if (!node) return
      const rect = getRect()
      const targetW = clampW(Math.min(vbRef.current.w, WORLD_W / 4))
      const targetH = deriveH(targetW, rect.width, rect.height)
      animateTo({ x: node.x - targetW / 2, y: node.y - targetH / 2, w: targetW })
      setHighlightedNodeId(id)
      setTimeout(() => setHighlightedNodeId(null), 1200)
    },
    [animateTo],
  )

  const handleNodeTap = useCallback(
    (nodeId: string) => {
      const node = getSugorokuNode(nodeId)
      if (!node) return
      const status = getNodeStatus(node, getPrevNodeInRegion(nodeId), save)
      if (status === 'locked') {
        setLockedNode(nodeId)
        return
      }
      if (node.regionId === 'kagaku') {
        if (!getChemStage(nodeId)) {
          showToast('じゅんびちゅう')
          return
        }
        router.push(`/chem/${nodeId}`)
        return
      }
      if (!getProblem(nodeId)) {
        showToast('じゅんびちゅう')
        return
      }
      router.push(`/q/${nodeId}`)
    },
    [save, router, showToast],
  )

  const doubleTapZoom = useCallback(
    (clientX: number, clientY: number) => {
      const rect = getRect()
      const cur = vbRef.current
      const world = screenToWorld(cur, rect, clientX, clientY)
      const targetW = clampW(cur.w / 2)
      const targetH = deriveH(targetW, rect.width, rect.height)
      animateTo({ x: world.x - targetW / 2, y: world.y - targetH / 2, w: targetW })
    },
    [animateTo],
  )

  const handleTap = useCallback(
    (clientX: number, clientY: number) => {
      const now = Date.now()
      const last = lastTapRef.current
      if (last && now - last.time < 350 && Math.hypot(clientX - last.x, clientY - last.y) < 30) {
        lastTapRef.current = null
        doubleTapZoom(clientX, clientY)
        return
      }
      lastTapRef.current = { x: clientX, y: clientY, time: now }
      const el = document.elementFromPoint(clientX, clientY)
      const hit = el?.closest('[data-hit]')
      if (!hit) return
      const kind = hit.getAttribute('data-hit')
      if (kind === 'math-island') {
        showToast('さんすう島は じゅんびちゅう')
        return
      }
      if (kind === 'region') {
        const regionId = hit.getAttribute('data-region-id')!
        const region = getMapRegion(regionId)
        if (!region) return
        const k = kFromW(vbRef.current.w)
        if (k < 3.2) {
          const rect = getRect()
          animateTo(computeRegionTarget(region, rect.width / rect.height))
        }
        return
      }
      if (kind === 'node') {
        const nodeId = hit.getAttribute('data-node-id')!
        handleNodeTap(nodeId)
      }
    },
    [animateTo, doubleTapZoom, handleNodeTap, showToast],
  )

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    cancelAnim()
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // Pointer may already be released (fast synthetic taps or some browsers); safe to ignore.
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 1) {
      tapInfo.current = { x: e.clientX, y: e.clientY, time: Date.now(), moved: false }
      gesture.current = { type: 'pan' }
    } else if (pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values())
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 }
      gesture.current = { type: 'pinch', startDist: dist, startVb: { ...vbRef.current }, startMid: mid }
      tapInfo.current = null
    }
  }

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const prev = pointers.current.get(e.pointerId)
    if (!prev) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const rect = getRect()
    if (gesture.current?.type === 'pan' && pointers.current.size === 1) {
      if (tapInfo.current && !tapInfo.current.moved) {
        const moved = Math.hypot(e.clientX - tapInfo.current.x, e.clientY - tapInfo.current.y)
        if (moved > 8) tapInfo.current.moved = true
      }
      const dx = e.clientX - prev.x
      const dy = e.clientY - prev.y
      const cur = vbRef.current
      const h = deriveH(cur.w, rect.width, rect.height)
      const next = { x: cur.x - (dx / rect.width) * cur.w, y: cur.y - (dy / rect.height) * h, w: cur.w }
      vbRef.current = next
      setVb(next)
    } else if (gesture.current?.type === 'pinch' && pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values())
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 }
      const g = gesture.current
      const newW = clampW(g.startVb.w / (dist / g.startDist))
      const newH = deriveH(newW, rect.width, rect.height)
      const midWorld = screenToWorld(g.startVb, rect, g.startMid.x, g.startMid.y)
      const ratioX = (mid.x - rect.left) / rect.width
      const ratioY = (mid.y - rect.top) / rect.height
      const next = { x: midWorld.x - ratioX * newW, y: midWorld.y - ratioY * newH, w: newW }
      vbRef.current = next
      setVb(next)
    }
  }

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size === 0) {
      const tap = tapInfo.current
      gesture.current = null
      tapInfo.current = null
      if (tap && !tap.moved && Date.now() - tap.time < 300) handleTap(tap.x, tap.y)
    } else if (pointers.current.size === 1) {
      gesture.current = { type: 'pan' }
      tapInfo.current = null
    }
  }

  const onWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault()
    cancelAnim()
    const rect = getRect()
    const cur = vbRef.current
    const world = screenToWorld(cur, rect, e.clientX, e.clientY)
    const factor = e.deltaY > 0 ? 1 / 1.1 : 1.1
    const targetW = clampW(cur.w / factor)
    const targetH = deriveH(targetW, rect.width, rect.height)
    const ratioX = (e.clientX - rect.left) / rect.width
    const ratioY = (e.clientY - rect.top) / rect.height
    const next = { x: world.x - ratioX * targetW, y: world.y - ratioY * targetH, w: targetW }
    vbRef.current = next
    setVb(next)
  }

  const zoomBy = (factor: number) => {
    const rect = getRect()
    const cur = vbRef.current
    const centerWorld = screenToWorld(cur, rect, rect.left + rect.width / 2, rect.top + rect.height / 2)
    const targetW = clampW(cur.w / factor)
    const targetH = deriveH(targetW, rect.width, rect.height)
    animateTo({ x: centerWorld.x - targetW / 2, y: centerWorld.y - targetH / 2, w: targetW })
  }

  const onHome = () => {
    const rect = getRect()
    const h = deriveH(WORLD_W, rect.width, rect.height)
    animateTo({ x: 0, y: (WORLD_H - h) / 2, w: WORLD_W })
  }

  const k = kFromW(vb.w)
  const h = deriveH(vb.w, size.w, size.h)
  const centerWorld = { x: vb.x + vb.w / 2, y: vb.y + h / 2 }
  const currentRegion = mapRegions.find((r) => pointInPolygon(centerWorld, r.polygon))
  const regionPill =
    k >= 3.2 && currentRegion
      ? {
          name: currentRegion.name,
          cleared: getNodesForRegion(currentRegion.id).filter((n) => save.cleared[n.id]).length,
          total: getNodesForRegion(currentRegion.id).length,
        }
      : null
  const lockedNodeData = lockedNode ? getSugorokuNode(lockedNode) : null
  const prevOfLocked = lockedNode ? getPrevNodeInRegion(lockedNode) : null

  return (
    <div ref={containerRef} className="relative h-[100dvh] w-full touch-none overflow-hidden overscroll-none bg-[#CFE6EE]">
      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full"
        viewBox={`${vb.x} ${vb.y} ${vb.w} ${h}`}
        style={{ touchAction: 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <rect x={-2000} y={-2000} width={WORLD_W + 4000} height={WORLD_H + 4000} fill="#CFE6EE" />
        <MapIsland k={k} />
        <MapSugoroku k={k} save={save} highlightedNodeId={highlightedNodeId} />
      </svg>

      <MapControls
        points={save.points}
        showHome={vb.w < WORLD_W / 1.2}
        onZoomIn={() => zoomBy(1.5)}
        onZoomOut={() => zoomBy(1 / 1.5)}
        onHome={onHome}
        regionPill={regionPill}
      />

      {toast && (
        <div className="pointer-events-none absolute inset-x-0 top-20 z-30 flex justify-center px-4">
          <div className="rounded-full bg-[#174d70] px-5 py-2 text-center text-sm font-black text-white shadow-lg">{toast.message}</div>
        </div>
      )}

      {lockedNodeData && (
        <div className="absolute inset-x-0 bottom-0 z-30 animate-sheet-up rounded-t-3xl border-t-4 border-[#0e4b69] bg-white p-5 shadow-2xl">
          <div className="mx-auto flex max-w-md flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-[#3d3a38]">これを あそぶには</h2>
              <button
                onClick={() => setLockedNode(null)}
                aria-label="とじる"
                className="flex size-9 items-center justify-center rounded-full bg-[#f1efe9]"
              >
                <X className="size-4" />
              </button>
            </div>
            {prevOfLocked ? (
              <button
                onClick={() => {
                  setLockedNode(null)
                  focusOnNode(prevOfLocked.id)
                }}
                className="flex items-center gap-3 rounded-2xl border-2 border-[#e4dfce] bg-[#fdf9ef] p-4 text-left"
              >
                <span
                  className="flex size-12 items-center justify-center rounded-xl text-lg font-black text-white"
                  style={{ backgroundColor: themeColors[prevOfLocked.theme] }}
                >
                  
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-black text-[#3d3a38]">{prevOfLocked.label}</span>
                  <span className="block text-xs text-[#8a8478]">まず、ここに 行ってみよう</span>
                </span>
              </button>
            ) : (
              <p className="text-sm text-[#8a8478]">さいしょの もんだいだよ。</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
