'use client'
import { useMemo } from 'react'
import { islands, mapRegions, type MapRegion } from '@/lib/world'
import { lerpClamp } from '@/lib/viewbox'
import { jaggedOutline, polygonCentroid, scalePolygon, scatterPointsInPolygon, seededRandom, smoothClosedPath } from '@/lib/mapShapes'
import { MapDecor } from '@/components/MapDecor'

const toPoints = (polygon: { x: number; y: number }[]) => polygon.map((p) => `${p.x},${p.y}`).join(' ')

// --- Terrain decoration primitives -----------------------------------------

function Mountain({ x, y, s, seed }: { x: number; y: number; s: number; seed: number }) {
  const rnd = seededRandom(seed)
  const h = s * (0.75 + rnd() * 0.5)
  const w = s * (0.9 + rnd() * 0.4)
  const tipX = x + (rnd() - 0.5) * w * 0.3
  return (
    <g style={{ pointerEvents: 'none' }}>
      <polygon points={`${x - w / 2},${y} ${tipX},${y - h} ${x + w / 2},${y}`} fill="#8A7159" opacity={0.9} />
      <polygon points={`${x - w / 2},${y} ${tipX - w * 0.08},${y - h * 0.55} ${tipX + w * 0.04},${y - h * 0.55}`} fill="#7A6247" opacity={0.55} />
      <polygon
        points={`${tipX - w * 0.13},${y - h * 0.62} ${tipX},${y - h} ${tipX + w * 0.13},${y - h * 0.62} ${tipX},${y - h * 0.72}`}
        fill="#F5EFE2"
        opacity={0.9}
      />
    </g>
  )
}

function Tree({ x, y, s, seed }: { x: number; y: number; s: number; seed: number }) {
  const rnd = seededRandom(seed)
  const r = s * (0.55 + rnd() * 0.35)
  const green1 = '#4C8F52'
  const green2 = '#5FA867'
  return (
    <g style={{ pointerEvents: 'none' }}>
      <ellipse cx={x} cy={y + r * 0.35} rx={r * 0.7} ry={r * 0.22} fill="#3D3A38" opacity={0.12} />
      <rect x={x - r * 0.09} y={y - r * 0.1} width={r * 0.18} height={r * 0.5} fill="#7A5A3A" rx={r * 0.05} />
      <circle cx={x - r * 0.32} cy={y - r * 0.35} r={r * 0.5} fill={green1} opacity={0.92} />
      <circle cx={x + r * 0.32} cy={y - r * 0.3} r={r * 0.48} fill={green2} opacity={0.92} />
      <circle cx={x} cy={y - r * 0.68} r={r * 0.55} fill={green2} />
    </g>
  )
}

// --- Per-region decoration sets ---------------------------------------------

function useRegionDecorations() {
  return useMemo(() => {
    const chigaku = mapRegions.find((r) => r.id === 'chigaku')!
    const seibutsu = mapRegions.find((r) => r.id === 'seibutsu')!

    const mountains = scatterPointsInPolygon(chigaku.polygon, 6, 101, 36)
    const mountainContours = scatterPointsInPolygon(chigaku.polygon, 4, 202, 20)

    const trees = scatterPointsInPolygon(seibutsu.polygon, 11, 606, 18)

    return { mountains, mountainContours, trees }
  }, [])
}

function RegionTerrain({ region, decor }: { region: MapRegion; decor: ReturnType<typeof useRegionDecorations> }) {
  if (region.id === 'chigaku') {
    return (
      <>
        {decor.mountainContours.map((p, i) => (
          <path
            key={`mc-${i}`}
            d={`M ${p.x - 30} ${p.y} Q ${p.x} ${p.y - 12} ${p.x + 30} ${p.y}`}
            fill="none"
            stroke="#8A7159"
            strokeWidth={3}
            opacity={0.22}
            style={{ pointerEvents: 'none' }}
          />
        ))}
        {decor.mountains.map((p, i) => <Mountain key={i} x={p.x} y={p.y} s={42} seed={101 + i * 7} />)}
      </>
    )
  }
  if (region.id === 'kagaku' || region.id === 'butsuri') {
    return <MapDecor region={region} />
  }
  if (region.id === 'seibutsu') {
    return <>{decor.trees.map((p, i) => <Tree key={i} x={p.x} y={p.y} s={30} seed={606 + i * 11} />)}</>
  }
  return null
}

export function MapIsland({ k }: { k: number }) {
  const islandLabelOpacity = 1 - lerpClamp(k, 1.4, 1.8)
  const regionFillOpacity = 0.35 + 0.65 * lerpClamp(k, 1.4, 1.8)
  const regionBorderOpacity = lerpClamp(k, 1.4, 1.8)
  const regionBigLabelOpacity = lerpClamp(k, 1.4, 1.8) * (1 - lerpClamp(k, 3.0, 3.6))
  const regionSmallLabelOpacity = lerpClamp(k, 3.0, 3.6)
  const decor = useRegionDecorations()

  const islandShapes = useMemo(
    () =>
      islands.map((island) => {
        const jagged = jaggedOutline(island.outline, island.id === 'science' ? 14 : 10, island.id === 'science' ? 11 : 22)
        const centroid = polygonCentroid(island.outline)
        const sandRing = scalePolygon(jagged, centroid, 1.035)
        return {
          island,
          coastPath: smoothClosedPath(jagged),
          sandPath: smoothClosedPath(sandRing),
        }
      }),
    [],
  )

  return (
    <g>
      {islandShapes.map(({ island, coastPath, sandPath }) => (
        <g key={island.id}>
          <path d={sandPath} fill="#F3E4BE" stroke="#B7D9E4" strokeWidth={16} strokeLinejoin="round" />
          <path d={coastPath} fill={island.fill} stroke={island.stroke} strokeWidth={3} />
          {mapRegions
            .filter((r) => r.islandId === island.id)
            .map((region) => (
              <g key={`terrain-${region.id}`} clipPath={`url(#clip-${region.id})`}>
                <clipPath id={`clip-${region.id}`}>
                  <polygon points={toPoints(region.polygon)} />
                </clipPath>
                <RegionTerrain region={region} decor={decor} />
              </g>
            ))}
          <text
            x={island.labelPos.x}
            y={island.labelPos.y}
            textAnchor="middle"
            fontSize={40}
            fontWeight={900}
            fill="#3D3A38"
            stroke="#FFFFFF"
            strokeWidth={6}
            paintOrder="stroke"
            opacity={islandLabelOpacity}
            style={{ pointerEvents: 'none' }}
          >
            {island.name}
          </text>
        </g>
      ))}
      {mapRegions.map((region) => (
        <g key={region.id}>
          <polygon
            points={toPoints(region.polygon)}
            fill={region.color}
            opacity={region.status === 'comingSoon' ? regionFillOpacity * 0.22 : regionFillOpacity * 0.55}
            data-hit="region"
            data-region-id={region.id}
            style={{ cursor: 'pointer' }}
          />
          <polygon
            points={toPoints(region.polygon)}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={2.5}
            opacity={regionBorderOpacity}
            style={{ pointerEvents: 'none' }}
          />
          <text
            x={region.labelPos.x}
            y={region.labelPos.y}
            textAnchor="middle"
            fontSize={30}
            fontWeight={900}
            fill="#3D3A38"
            stroke="#FFFFFF"
            strokeWidth={6}
            paintOrder="stroke"
            opacity={regionBigLabelOpacity}
            data-hit="region"
            data-region-id={region.id}
            style={{ cursor: 'pointer' }}
          >
            {region.name}
          </text>
          <text
            x={region.labelPos.x}
            y={region.polygon[0] ? Math.min(...region.polygon.map((p) => p.y)) + 24 : region.labelPos.y}
            textAnchor="middle"
            fontSize={18}
            fontWeight={900}
            fill="#3D3A38"
            stroke="#FFFFFF"
            strokeWidth={5}
            paintOrder="stroke"
            opacity={regionSmallLabelOpacity}
            style={{ pointerEvents: 'none' }}
          >
            {region.name}
          </text>
        </g>
      ))}
    </g>
  )
}
