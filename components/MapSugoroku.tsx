import { mapRegions, sugorokuNodes, themeColors, type SugorokuNode } from '@/lib/world'
import { lerpClamp } from '@/lib/viewbox'
import { getProblem } from '@/lib/problems'
import { isFaded } from '@/lib/economy'
import type { Save } from '@/lib/progress'

export type NodeStatus = 'cleared' | 'available' | 'locked' | 'faded'

export function getNodeStatus(node: SugorokuNode, index: number, save: Save): NodeStatus {
  const record = save.cleared[node.id]
  if (record) return isFaded(record.lastClearedAt) ? 'faded' : 'cleared'
  const prev = sugorokuNodes[index - 1]
  const unlocked = index === 0 || (prev ? !!save.cleared[prev.id] : false)
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
            🪧 じゅんびちゅう
          </text>
        ))}
      <g opacity={nodeOpacity} style={{ pointerEvents: 'none' }} aria-hidden="true">
        <path d="M 655 575 C 684 548, 730 548, 758 575" fill="none" stroke="#9A6B45" strokeWidth={4} strokeLinecap="round" />
        <path d="M 675 575 L 668 628 M 738 575 L 748 622" stroke="#9A6B45" strokeWidth={4} strokeLinecap="round" />
        <circle cx="668" cy="628" r="8" fill="#F3C84B" stroke="#9A6B45" strokeWidth={3} />
        <circle cx="748" cy="622" r="8" fill="#F3C84B" stroke="#9A6B45" strokeWidth={3} />
        <rect x="807" y="552" width="48" height="34" rx="5" fill="#F2A65A" stroke="#9A6B45" strokeWidth={3} />
        <path d="M 815 552 L 815 536 Q 831 524 847 536 L 847 552" fill="none" stroke="#9A6B45" strokeWidth={3} />
        <path d="M 816 575 H 846 M 831 560 V 578" stroke="#FFF4DD" strokeWidth={3} strokeLinecap="round" />
        <text x="724" y="535" textAnchor="middle" fontSize={13} fontWeight={900} fill="#7A6A4E">ゴムの実験コーナー</text>
      </g>
      {sugorokuNodes.slice(1).map((node, i) => {
        const from = sugorokuNodes[i]
        const to = node
        const status = getNodeStatus(to, i + 1, save)
        const color = status === 'locked' ? '#B9BFC4' : themeColors[to.theme]
        const midX = (from.x + to.x) / 2
        const midY = (from.y + to.y) / 2 - 14
        return (
          <path
            key={`${from.id}-${to.id}`}
            d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeDasharray="2 8"
            strokeLinecap="round"
            opacity={nodeOpacity}
            style={{ pointerEvents: 'none' }}
          />
        )
      })}
      {sugorokuNodes.map((node, index) => {
        const status = getNodeStatus(node, index, save)
        const implemented = !!getProblem(node.id)
        const themeColor = themeColors[node.theme]
        const highlighted = highlightedNodeId === node.id
        const dotColor = status === 'locked' ? '#B9BFC4' : themeColor
        return (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r={3} fill={dotColor} opacity={dotOpacity} style={{ pointerEvents: 'none' }} />
            <g opacity={nodeOpacity} style={{ pointerEvents: nodeOpacity > 0.4 ? 'auto' : 'none' }}>
              {status === 'available' && (
                <circle cx={node.x} cy={node.y} r={18} fill="none" stroke="#FFFFFF" strokeWidth={3} className="animate-node-pulse" />
              )}
              {highlighted && <circle cx={node.x} cy={node.y} r={22} fill="none" stroke="#FFFFFF" strokeWidth={4} className="animate-node-flash" />}
              <circle
                cx={node.x}
                cy={node.y}
                r={12}
                fill={status === 'locked' ? '#C9CFD4' : status === 'faded' ? `${themeColor}80` : themeColor}
                stroke="#FFFFFF"
                strokeWidth={status === 'available' ? 3 : 2}
              />
              {status === 'cleared' && (
                <text x={node.x + 12} y={node.y + 16} fontSize={14} fontWeight={900} fill="#3D8A3D" stroke="#FFFFFF" strokeWidth={3} paintOrder="stroke">
                  ✓
                </text>
              )}
              {status === 'faded' && (
                <text x={node.x + 12} y={node.y + 16} fontSize={13} fontWeight={900} fill="#3D3A38" stroke="#FFFFFF" strokeWidth={3} paintOrder="stroke">
                  ↻
                </text>
              )}
              {status === 'locked' && (
                <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize={14} fill="#7A8288">
                  ⌘
                </text>
              )}
              <text
                x={node.x}
                y={node.y + 24}
                textAnchor="middle"
                fontSize={10}
                fontWeight={900}
                fill="#3D3A38"
                stroke="#FFFFFF"
                strokeWidth={4}
                paintOrder="stroke"
                style={{ pointerEvents: 'none' }}
              >
                {node.label}
              </text>
              {!implemented && status !== 'locked' && (
                <text x={node.x} y={node.y - 26} textAnchor="middle" fontSize={11} fontWeight={900} fill="#7A8288">
                  もうすぐ
                </text>
              )}
              <circle cx={node.x} cy={node.y} r={28} fill="transparent" data-hit="node" data-node-id={node.id} style={{ cursor: 'pointer' }} />
            </g>
          </g>
        )
      })}
    </g>
  )
}
