import { WORLD_W, type Point } from '@/lib/world'

export type VBState = { x: number; y: number; w: number }
export type ViewBox = { x: number; y: number; w: number; h: number }

export const MIN_K = 0.8
export const MAX_K = 8.0
export const MIN_W = WORLD_W / MAX_K
export const MAX_W = WORLD_W / MIN_K

export const clampW = (w: number) => Math.min(MAX_W, Math.max(MIN_W, w))
export const kFromW = (w: number) => WORLD_W / w
export const deriveH = (w: number, containerW: number, containerH: number) => (containerW ? (w * containerH) / containerW : w)

export const toViewBox = (vb: VBState, containerW: number, containerH: number): ViewBox => ({
  x: vb.x,
  y: vb.y,
  w: vb.w,
  h: deriveH(vb.w, containerW, containerH),
})

export const screenToWorld = (
  vb: VBState,
  rect: { left: number; top: number; width: number; height: number },
  screenX: number,
  screenY: number,
): Point => {
  const h = deriveH(vb.w, rect.width, rect.height)
  return {
    x: vb.x + ((screenX - rect.left) / rect.width) * vb.w,
    y: vb.y + ((screenY - rect.top) / rect.height) * h,
  }
}

export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export const pointInPolygon = (point: Point, polygon: Point[]) => {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x
    const yi = polygon[i].y
    const xj = polygon[j].x
    const yj = polygon[j].y
    const intersect =
      yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

export const polygonBBox = (polygon: Point[]) => {
  const xs = polygon.map((p) => p.x)
  const ys = polygon.map((p) => p.y)
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) }
}

export const lerpClamp = (k: number, k0: number, k1: number) => Math.max(0, Math.min(1, (k - k0) / (k1 - k0)))
