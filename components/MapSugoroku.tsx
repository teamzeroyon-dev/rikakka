import { GRID_CELL, getPrevNodeInRegion, mapRegions, sugorokuNodes, themeColors, type SugorokuNode } from '@/lib/world'
import { lerpClamp } from '@/lib/viewbox'
import { getProblem } from '@/lib/problems'
import { getChemStage } from '@/lib/quizProblems'
import { isFaded } from '@/lib/economy'
import type { Save } from '@/lib/progress'

export type NodeStatus = 'cleared' | 'available' | 'locked' | 'faded'

export function getNodeStatus(node: SugorokuNode, prevNode: SugorokuNode | null, save: Save): NodeStatus {
  const record = save.cleared[node.id]
  if (record) return isFaded(record.lastClearedAt) ? 'faded' : 'cleared'
  const unlocked = !prevNode || !!save.cleared[prevNode.id]
  return unlocked ? 'available' : 'locked'
}

export function MapSugoroku({ k, save, highlightedNodeId }: { k: number; save: Save; highlightedNodeId: string | null }) {
  const nodeOpacity = lerpClamp(k, 3.0, 3.6)
  const dotOpacity = lerpClamp(k, 1.4, 1.8) * (1 - nodeOpacity)

  return (
    <g>
      {mapRegions
        .filter((region) => region.status === 'comingSoon')
        .map((region) => (
          <text
            key={`soon-${region.id}`}
            x={region.labelPos.x}
            y={(Math.min(...region.polygon.map((p) => p.y)) + Math.max(...region.polygon.map((p) => p.y))) / 2}
            textAnchor="middle"
            fontSize={22}
            fontWeight={900}
            fill="#7A6A4E"
            stroke="#FFF4DD"
            strokeWidth={5}
            paintOrder="stroke"
            opacity={nodeOpacity}
            style={{ pointerEvents: 'none' }}
          >
             じゅんびちゅう
          </text>
        ))}
      {sugorokuNodes.slice(1).map((node, i) => {
        const from = sugorokuNodes[i]
        const to = node
        if (from.regionId !== to.regionId) return null
        const status = getNodeStatus(to, from, save)
        const color = status === 'locked' ? '#B9BFC4' : themeColors[to.theme]
        const roadW = GRID_CELL * 0.42
        return (
          <g key={`${from.id}-${to.id}`} opacity={nodeOpacity} style={{ pointerEvents: 'none' }}>
            <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#E4D9BC" strokeWidth={roadW} strokeLinecap="square" />
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={color}
              strokeWidth={3}
              strokeDasharray="10 10"
              strokeLinecap="round"
            />
          </g>
        )
      })}
      {sugorokuNodes.map((node) => {
        const status = getNodeStatus(node, getPrevNodeInRegion(node.id), save)
        const implemented = !!getProblem(node.id) || !!getChemStage(node.id)
        const themeColor = themeColors[node.theme]
        const highlighted = highlightedNodeId === node.id
        const dotColor = status === 'locked' ? '#B9BFC4' : themeColor
        const tile = GRID_CELL * 0.42
        const half = tile / 2
        return (
          <g key={node.id}>
            <rect x={node.x - 3} y={node.y - 3} width={6} height={6} fill={dotColor} opacity={dotOpacity} style={{ pointerEvents: 'none' }} />
            <g opacity={nodeOpacity} style={{ pointerEvents: nodeOpacity > 0.4 ? 'auto' : 'none' }}>
              {status === 'available' && (
                <rect
                  x={node.x - half - 4}
                  y={node.y - half - 4}
                  width={tile + 8}
                  height={tile + 8}
                  rx={6}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={1.5}
                  className="animate-node-pulse"
                />
              )}
              {highlighted && (
                <rect
                  x={node.x - half - 6}
                  y={node.y - half - 6}
                  width={tile + 12}
                  height={tile + 12}
                  rx={7}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={2.5}
                  className="animate-node-flash"
                />
              )}
              <rect
                x={node.x - half}
                y={node.y - half}
                width={tile}
                height={tile}
                rx={5}
                fill={status === 'locked' ? '#C9CFD4' : status === 'faded' ? `${themeColor}80` : themeColor}
                stroke="#FFFFFF"
                strokeWidth={status === 'available' ? 2 : 1.25}
              />
              {status === 'cleared' && (
                <text x={node.x + half - 2} y={node.y - half + 9} fontSize={8.5} fontWeight={900} fill="#3D8A3D" stroke="#FFFFFF" strokeWidth={2} paintOrder="stroke">
                  済
                </text>
              )}
              {status === 'faded' && (
                <text x={node.x + half - 2} y={node.y - half + 9} fontSize={7.5} fontWeight={900} fill="#3D3A38" stroke="#FFFFFF" strokeWidth={2} paintOrder="stroke">
                  ↻
                </text>
              )}
              {status === 'locked' && (
                <text x={node.x} y={node.y + 2.5} textAnchor="middle" fontSize={9} fontWeight={900} fill="#7A8288">
                  鍵
                </text>
              )}
              <text
                x={node.x}
                y={node.y + half + 12}
                textAnchor="middle"
                fontSize={6.5}
                fontWeight={900}
                fill="#3D3A38"
                stroke="#FFFFFF"
                strokeWidth={2.5}
                paintOrder="stroke"
                style={{ pointerEvents: 'none' }}
              >
                {node.label}
              </text>
              {!implemented && status !== 'locked' && (
                <text x={node.x} y={node.y - half - 6} textAnchor="middle" fontSize={6.5} fontWeight={900} fill="#7A8288">
                  もうすぐ
                </text>
              )}
              <rect
                x={node.x - half - 10}
                y={node.y - half - 10}
                width={tile + 20}
                height={tile + 20}
                fill="transparent"
                data-hit="node"
                data-node-id={node.id}
                style={{ cursor: 'pointer' }}
              />
            </g>
          </g>
        )
      })}
    </g>
  )
}
