import type { Point } from '@/lib/world'
import { pointInPolygon, polygonBBox } from '@/lib/viewbox'

// Catmull-Rom -> cubic bezier conversion for a closed loop of points.
// Produces a smooth, organic outline instead of a straight-edged polygon,
// which is what makes flat coordinate lists actually read as a coastline.
export function smoothClosedPath(points: Point[], tension = 0.72): string {
  const n = points.length
  if (n < 3) return ''
  const p = (i: number) => points[((i % n) + n) % n]
  let d = `M ${points[0].x} ${points[0].y} `
  for (let i = 0; i < n; i++) {
    const p0 = p(i - 1)
    const p1 = p(i)
    const p2 = p(i + 1)
    const p3 = p(i + 2)
    const c1x = p1.x + ((p2.x - p0.x) / 6) * tension
    const c1y = p1.y + ((p2.y - p0.y) / 6) * tension
    const c2x = p2.x - ((p3.x - p1.x) / 6) * tension
    const c2y = p2.y - ((p3.y - p1.y) / 6) * tension
    d += `C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y} `
  }
  return `${d}Z`
}

// Adds small deterministic jitter to each edge midpoint of a polygon so the
// silhouette reads as a natural coastline (coves/headlands) instead of a
// perfectly smoothed blob. Seeded so it's stable across renders.
export function jaggedOutline(points: Point[], amount: number, seed = 1): Point[] {
  const rnd = seededRandom(seed)
  const out: Point[] = []
  const n = points.length
  for (let i = 0; i < n; i++) {
    const a = points[i]
    const b = points[(i + 1) % n]
    out.push(a)
    const mx = (a.x + b.x) / 2
    const my = (a.y + b.y) / 2
    const dx = b.x - a.x
    const dy = b.y - a.y
    const len = Math.hypot(dx, dy) || 1
    // outward normal
    const nx = -dy / len
    const ny = dx / len
    const jitter = (rnd() * 2 - 1) * amount
    out.push({ x: mx + nx * jitter, y: my + ny * jitter })
  }
  return out
}

export function polygonCentroid(points: Point[]): Point {
  let x = 0
  let y = 0
  for (const p of points) {
    x += p.x
    y += p.y
  }
  return { x: x / points.length, y: y / points.length }
}

export function scalePolygon(points: Point[], center: Point, factor: number): Point[] {
  return points.map((p) => ({
    x: center.x + (p.x - center.x) * factor,
    y: center.y + (p.y - center.y) * factor,
  }))
}

// Small deterministic PRNG (mulberry32) so decorative scatter layouts never
// shift between renders/hydration.
export function seededRandom(seed: number) {
  let a = seed >>> 0 || 1
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function scatterPointsInPolygon(polygon: Point[], count: number, seed: number, margin = 0): Point[] {
  const { minX, maxX, minY, maxY } = polygonBBox(polygon)
  const rnd = seededRandom(seed)
  const pts: Point[] = []
  let attempts = 0
  while (pts.length < count && attempts < count * 40) {
    attempts++
    const x = minX + margin + rnd() * (maxX - minX - margin * 2)
    const y = minY + margin + rnd() * (maxY - minY - margin * 2)
    if (pointInPolygon({ x, y }, polygon)) pts.push({ x, y })
  }
  return pts
}
