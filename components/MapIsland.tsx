import { islands, mapRegions, mathIslandCenter } from '@/lib/world'
import { lerpClamp } from '@/lib/viewbox'

const toPoints = (polygon: { x: number; y: number }[]) => polygon.map((p) => `${p.x},${p.y}`).join(' ')

export function MapIsland({ k }: { k: number }) {
  const islandLabelOpacity = 1 - lerpClamp(k, 1.4, 1.8)
  const regionFillOpacity = 0.35 + 0.65 * lerpClamp(k, 1.4, 1.8)
  const regionBorderOpacity = lerpClamp(k, 1.4, 1.8)
  const regionBigLabelOpacity = lerpClamp(k, 1.4, 1.8) * (1 - lerpClamp(k, 3.0, 3.6))
  const regionSmallLabelOpacity = lerpClamp(k, 3.0, 3.6)

  return (
    <g>
      {islands.map((island) => (
        <g key={island.id}>
          <polygon points={toPoints(island.outline)} fill="none" stroke="#B7D9E4" strokeWidth={16} strokeLinejoin="round" />
          <polygon points={toPoints(island.outline)} fill={island.fill} stroke={island.stroke} strokeWidth={3} />
          {island.status === 'comingSoon' && (
            <text x={mathIslandCenter.x} y={mathIslandCenter.y} textAnchor="middle" fontSize={140} fontWeight={900} fill="#8CA6A2" opacity={0.6} data-hit="math-island" style={{ cursor: 'pointer' }}>
              ?
            </text>
          )}
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
            opacity={island.status === 'comingSoon' ? 1 : islandLabelOpacity}
            style={{ pointerEvents: 'none' }}
          >
            {island.name}
          </text>
          {island.status === 'comingSoon' && (
            <polygon points={toPoints(island.outline)} fill="transparent" data-hit="math-island" style={{ cursor: 'pointer' }} />
          )}
        </g>
      ))}
      {mapRegions.map((region) => (
        <g key={region.id}>
          <polygon
            points={toPoints(region.polygon)}
            fill={region.color}
            opacity={region.status === 'comingSoon' ? regionFillOpacity * 0.5 : regionFillOpacity}
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
