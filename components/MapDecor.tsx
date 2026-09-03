import { useMemo } from 'react'
import { GRID_CELL, getNodesForRegion, type MapRegion, type Point } from '@/lib/world'
import { pointInPolygon, polygonBBox } from '@/lib/viewbox'
import { seededRandom } from '@/lib/mapShapes'

type DecorKind = 'grass' | 'rock' | 'house' | 'flask' | 'thermometer' | 'rubber-car' | 'magnet' | 'pendulum'

type DecorCell = { x: number; y: number; kind: DecorKind; seed: number }

const ROAD_MARGIN = GRID_CELL * 0.55
const NODE_MARGIN = GRID_CELL * 0.62

function distToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const lenSq = dx * dx + dy * dy
  if (lenSq === 0) return Math.hypot(p.x - a.x, p.y - a.y)
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq
  t = Math.max(0, Math.min(1, t))
  const projX = a.x + t * dx
  const projY = a.y + t * dy
  return Math.hypot(p.x - projX, p.y - projY)
}

function buildDecorCells(region: MapRegion, kinds: DecorKind[], weights: number[], seedBase: number): DecorCell[] {
  const nodes = getNodesForRegion(region.id)
  if (nodes.length === 0) return []
  const originX = nodes[0].x % GRID_CELL
  const originY = nodes[0].y % GRID_CELL
  const { minX, maxX, minY, maxY } = polygonBBox(region.polygon)
  const startI = Math.floor((minX - originX) / GRID_CELL) - 1
  const endI = Math.ceil((maxX - originX) / GRID_CELL) + 1
  const startJ = Math.floor((minY - originY) / GRID_CELL) - 1
  const endJ = Math.ceil((maxY - originY) / GRID_CELL) + 1

  const roads: [Point, Point][] = []
  for (let k = 1; k < nodes.length; k++) roads.push([nodes[k - 1], nodes[k]])

  const cells: DecorCell[] = []
  const rnd = seededRandom(seedBase)
  const totalWeight = weights.reduce((a, b) => a + b, 0)

  for (let i = startI; i <= endI; i++) {
    for (let j = startJ; j <= endJ; j++) {
      const x = originX + i * GRID_CELL
      const y = originY + j * GRID_CELL
      if (!pointInPolygon({ x, y }, region.polygon)) continue
      if (nodes.some((n) => Math.hypot(n.x - x, n.y - y) < NODE_MARGIN)) continue
      if (roads.some(([a, b]) => distToSegment({ x, y }, a, b) < ROAD_MARGIN)) continue
      // Deterministic per-cell decision so the layout never shifts between renders.
      const skipRoll = rnd()
      if (skipRoll < 0.32) continue
      let pick = rnd() * totalWeight
      let kind: DecorKind = kinds[0]
      for (let k = 0; k < kinds.length; k++) {
        if (pick < weights[k]) {
          kind = kinds[k]
          break
        }
        pick -= weights[k]
      }
      cells.push({ x, y, kind, seed: Math.floor(rnd() * 100000) + i * 131 + j * 977 })
    }
  }
  return cells
}

function Grass({ x, y, seed }: { x: number; y: number; seed: number }) {
  const rnd = seededRandom(seed)
  const s = 6 + rnd() * 3
  const tilt = (rnd() - 0.5) * 8
  return (
    <g style={{ pointerEvents: 'none' }}>
      <path d={`M ${x - s} ${y + s * 0.6} Q ${x - s * 0.4 + tilt} ${y - s} ${x} ${y + s * 0.5}`} fill="none" stroke="#5FA867" strokeWidth={2} strokeLinecap="round" />
      <path d={`M ${x} ${y + s * 0.6} Q ${x + s * 0.2 + tilt} ${y - s * 1.1} ${x + s} ${y + s * 0.4}`} fill="none" stroke="#4C8F52" strokeWidth={2} strokeLinecap="round" />
    </g>
  )
}

function RockDecor({ x, y, seed }: { x: number; y: number; seed: number }) {
  const rnd = seededRandom(seed)
  const r = 7 + rnd() * 4
  return (
    <g style={{ pointerEvents: 'none' }}>
      <ellipse cx={x} cy={y + r * 0.5} rx={r * 1.1} ry={r * 0.35} fill="#3D3A38" opacity={0.1} />
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.72} fill="#ADA08A" stroke="#8A7A5E" strokeWidth={1.5} />
    </g>
  )
}

function House({ x, y, seed }: { x: number; y: number; seed: number }) {
  const rnd = seededRandom(seed)
  const w = 20 + rnd() * 3
  const h = 14
  const roofColor = rnd() > 0.5 ? '#C25B4A' : '#4E8FC5'
  return (
    <g style={{ pointerEvents: 'none' }}>
      <ellipse cx={x} cy={y + h * 0.7} rx={w * 0.65} ry={4} fill="#3D3A38" opacity={0.1} />
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} fill="#F3E4BE" stroke="#8A7A5E" strokeWidth={1.5} />
      <polygon points={`${x - w / 2 - 3},${y - h / 2} ${x},${y - h} ${x + w / 2 + 3},${y - h / 2}`} fill={roofColor} stroke="#8A7A5E" strokeWidth={1.5} />
      <rect x={x - 3} y={y + h / 2 - 7} width={6} height={7} fill="#8A7A5E" />
    </g>
  )
}

function Flask({ x, y, seed }: { x: number; y: number; seed: number }) {
  const rnd = seededRandom(seed)
  const liquid = rnd() > 0.5 ? '#5FA867' : '#4E8FC5'
  return (
    <g style={{ pointerEvents: 'none' }}>
      <ellipse cx={x} cy={y + 8} rx={9} ry={2.5} fill="#3D3A38" opacity={0.1} />
      <path d="M -3 -10 L -3 -2 L -9 9 A 9 6 0 0 0 9 9 L 3 -2 L 3 -10 Z" transform={`translate(${x} ${y})`} fill="#EAF3F6" stroke="#7A8288" strokeWidth={1.5} />
      <path d="M -6 4 A 8 5 0 0 0 6 4 L 3 -2 L -3 -2 Z" transform={`translate(${x} ${y})`} fill={liquid} opacity={0.85} />
      <rect x={x - 4} y={y - 12} width={8} height={2.5} fill="#7A8288" />
    </g>
  )
}

function Thermometer({ x, y, seed }: { x: number; y: number; seed: number }) {
  const rnd = seededRandom(seed)
  const fill = 4 + rnd() * 6
  return (
    <g style={{ pointerEvents: 'none' }}>
      <ellipse cx={x} cy={y + 10} rx={6} ry={2} fill="#3D3A38" opacity={0.1} />
      <rect x={x - 2.5} y={y - 12} width={5} height={18} rx={2.5} fill="#EAF3F6" stroke="#7A8288" strokeWidth={1.3} />
      <circle cx={x} cy={y + 8} r={4.5} fill="#C25B4A" stroke="#7A8288" strokeWidth={1.3} />
      <rect x={x - 1.2} y={y + 8 - fill} width={2.4} height={fill} fill="#C25B4A" />
    </g>
  )
}

function RubberCar({ x, y, seed }: { x: number; y: number; seed: number }) {
  const rnd = seededRandom(seed)
  const bodyColor = rnd() > 0.5 ? '#FF9040' : '#E8B33A'
  const facing = rnd() > 0.5 ? 1 : -1
  return (
    <g style={{ pointerEvents: 'none' }} transform={`translate(${x} ${y}) scale(${facing} 1)`}>
      <ellipse cx={0} cy={9} rx={14} ry={3} fill="#3D3A38" opacity={0.12} />
      <rect x={-13} y={-4} width={26} height={9} rx={3} fill={bodyColor} stroke="#8A6237" strokeWidth={1.3} />
      <path d="M -6 -4 L -2 -11 L 8 -11 L 10 -4 Z" fill={bodyColor} stroke="#8A6237" strokeWidth={1.3} />
      <circle cx={-7} cy={6} r={3.4} fill="#3D3A38" />
      <circle cx={7} cy={6} r={3.4} fill="#3D3A38" />
      <line x1={13} y1={0} x2={20} y2={0} stroke="#C25B4A" strokeWidth={2} strokeLinecap="round" />
    </g>
  )
}

function MagnetDecor({ x, y, seed }: { x: number; y: number; seed: number }) {
  const rnd = seededRandom(seed)
  const rot = (rnd() - 0.5) * 24
  return (
    <g style={{ pointerEvents: 'none' }} transform={`translate(${x} ${y}) rotate(${rot})`}>
      <ellipse cx={0} cy={9} rx={9} ry={2.5} fill="#3D3A38" opacity={0.1} />
      <path d="M -8 6 L -8 -4 A 8 8 0 0 1 8 -4 L 8 6" fill="none" stroke="#C0392B" strokeWidth={5} strokeLinecap="round" />
      <path d="M -8 6 L -8 -4" stroke="#EAEAEA" strokeWidth={5} strokeLinecap="round" transform="translate(16 0) scale(-1 1) translate(-16 0)" opacity={0} />
      <rect x={-9.5} y={2} width={5} height={9} fill="#EAEAEA" stroke="#7A8288" strokeWidth={1} />
      <rect x={4.5} y={2} width={5} height={9} fill="#3D3A38" stroke="#7A8288" strokeWidth={1} />
    </g>
  )
}

function PendulumDecor({ x, y, seed }: { x: number; y: number; seed: number }) {
  const rnd = seededRandom(seed)
  const swing = (rnd() - 0.5) * 14
  return (
    <g style={{ pointerEvents: 'none' }}>
      <ellipse cx={x} cy={y + 14} rx={12} ry={2.5} fill="#3D3A38" opacity={0.1} />
      <line x1={x - 12} y1={y - 14} x2={x + 12} y2={y - 14} stroke="#8A7A5E" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={x} y1={y - 14} x2={x + swing} y2={y + 8} stroke="#7A8288" strokeWidth={1.4} />
      <circle cx={x + swing} cy={y + 8} r={4.5} fill="#4E8FC5" stroke="#3D3A38" strokeWidth={1} />
    </g>
  )
}

const decorRenderers: Record<DecorKind, (p: { x: number; y: number; seed: number }) => React.JSX.Element> = {
  grass: Grass,
  rock: RockDecor,
  house: House,
  flask: Flask,
  thermometer: Thermometer,
  'rubber-car': RubberCar,
  magnet: MagnetDecor,
  pendulum: PendulumDecor,
}

export function MapDecor({ region }: { region: MapRegion }) {
  const kinds: DecorKind[] =
    region.id === 'kagaku'
      ? ['grass', 'rock', 'flask', 'thermometer', 'house']
      : ['grass', 'rock', 'rubber-car', 'magnet', 'pendulum', 'house']
  const weights =
    region.id === 'kagaku' ? [46, 18, 16, 14, 6] : [40, 16, 16, 12, 10, 6]
  const cells = useMemo(
    () => buildDecorCells(region, kinds, weights, region.id === 'kagaku' ? 7001 : 8002),
    [region, kinds, weights],
  )

  return (
    <>
      {cells.map((cell, i) => {
        const Renderer = decorRenderers[cell.kind]
        return <Renderer key={i} x={cell.x} y={cell.y} seed={cell.seed} />
      })}
    </>
  )
}
