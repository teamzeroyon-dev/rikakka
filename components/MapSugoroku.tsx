import { getPrevNodeInRegion, mapRegions, sugorokuNodes, themeColors, type SugorokuNode } from '@/lib/world'
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
        if (from.regionId !== to.regionId) return null
        const status = getNodeStatus(to, from, save)
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
      {sugorokuNodes.map((node) => {
        const status = getNodeStatus(node, getPrevNodeInRegion(node.id), save)
        const implemented = !!getProblem(node.id) || !!getChemStage(node.id)
        const themeColor = themeColors[node.theme]
        const highlighted = highlightedNodeId === node.id
        const dotColor = status === 'locked' ? '#B9BFC4' : themeColor
        return (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r={3} fill={dotColor} opacity={dotOpacity} style={{ pointerEvents: 'none' }} />
            <g opacity={nodeOpacity} style={{ pointerEvents: nodeOpacity > 0.4 ? 'auto' : 'none' }}>
              {status === 'available' && (
                <circle cx={node.x} cy={node.y} r={9} fill="none" stroke="#FFFFFF" strokeWidth={1.5} className="animate-node-pulse" />
              )}
              {highlighted && <circle cx={node.x} cy={node.y} r={11} fill="none" stroke="#FFFFFF" strokeWidth={2.5} className="animate-node-flash" />}
              <circle
                cx={node.x}
                cy={node.y}
                r={6}
                fill={status === 'locked' ? '#C9CFD4' : status === 'faded' ? `${themeColor}80` : themeColor}
                stroke="#FFFFFF"
                strokeWidth={status === 'available' ? 2 : 1.25}
              />
              {status === 'cleared' && (
                <text x={node.x + 6} y={node.y + 8.5} fontSize={8.5} fontWeight={900} fill="#3D8A3D" stroke="#FFFFFF" strokeWidth={2} paintOrder="stroke">
                  
                </text>
              )}
              {status === 'faded' && (
                <text x={node.x + 6} y={node.y + 8.5} fontSize={7.5} fontWeight={900} fill="#3D3A38" stroke="#FFFFFF" strokeWidth={2} paintOrder="stroke">
                  ↻
                </text>
              )}
              {status === 'locked' && (
                <text x={node.x} y={node.y + 2.5} textAnchor="middle" fontSize={7.5} fill="#7A8288">
                  ⌘
                </text>
              )}
              <text
                x={node.x}
                y={node.y + 14}
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
                <text x={node.x} y={node.y - 14} textAnchor="middle" fontSize={6.5} fontWeight={900} fill="#7A8288">
                  もうすぐ
                </text>
              )}
              <circle cx={node.x} cy={node.y} r={16} fill="transparent" data-hit="node" data-node-id={node.id} style={{ cursor: 'pointer' }} />
            </g>
          </g>
        )
      })}
    </g>
  )
}
