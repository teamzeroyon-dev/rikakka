'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getProblem } from '@/lib/problems'
import { getNode, getNodesForRegion, getRegion, type Node } from '@/lib/world'
import { defaultSave, readSave, type Save } from '@/lib/progress'
import { isFaded } from '@/lib/economy'

export function WorldMap({ regionId }: { regionId: string }) {
  const region = getRegion(regionId)!
  const mapNodes = getNodesForRegion(regionId)
  const [save, setSave] = useState<Save>(defaultSave)
  const [locked, setLocked] = useState<Node | null>(null)
  const [toast, setToast] = useState('')
  useEffect(() => setSave(readSave()), [])
  const available = (node: Node) => save.unlockedRegions.includes(regionId) && (!node.prerequisites.length || node.prerequisites.every((id) => save.cleared[id]) || node.bridges.some((id) => save.cleared[id]))
  const clearToast = () => { setToast(''); }
  return <div className="relative mx-auto w-full max-w-xl pb-10">
    <div className="sticky top-0 z-10 flex items-center justify-between bg-background/95 px-5 py-4 backdrop-blur"><Link href={`/c/${region.continentId}`} className="rounded-full px-3 py-2 text-sm font-bold">← もどる</Link><strong>{region.emoji} {region.name}</strong><span className="font-bold text-primary">✨ {save.points}</span></div>
    <div className="px-5"><Link href={`/r/${regionId}`} className="mb-3 flex items-center justify-center rounded-2xl bg-primary py-3 font-bold text-primary-foreground">▶ れんぞくで あそぶ</Link></div>
    <div className="relative mx-5 h-[560px] overflow-hidden rounded-[2rem] border border-border bg-card" style={{ background: `linear-gradient(135deg, ${region.themeColor}14, transparent 55%)` }}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 560" preserveAspectRatio="none" aria-hidden="true">{mapNodes.flatMap((node) => node.prerequisites.map((pre) => { const from = getNode(pre); if (!from) return null; return <path key={`${pre}-${node.id}`} d={`M ${from.x} ${from.y} C ${from.x} ${(from.y+node.y)/2}, ${node.x} ${(from.y+node.y)/2}, ${node.x} ${node.y}`} fill="none" stroke={available(node) ? region.themeColor : '#c8c4bd'} strokeWidth="1.5" strokeDasharray={available(node) ? undefined : '3 3'} vectorEffect="non-scaling-stroke" /> }))}</svg>
      {mapNodes.map((node) => { const cleared = save.cleared[node.id]; const ready = available(node); const implemented = !!getProblem(node.id); const faded = !!cleared && isFaded(cleared.lastClearedAt); return <div key={node.id} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: `${node.x}%`, top: node.y }}><button aria-label={node.label} onClick={() => { if (!implemented) { setToast('じゅんびちゅう'); setTimeout(clearToast, 1800) } else if (ready) window.location.href = `/q/${node.id}`; else setLocked(node) }} className={`relative flex ${node.isMainPath ? 'size-20' : 'size-[72px]'} items-center justify-center rounded-full border-4 border-background text-3xl shadow-md transition active:scale-95 ${ready ? 'text-primary-foreground' : 'bg-muted text-muted-foreground'} ${faded ? 'opacity-50' : ''}`} style={ready ? { backgroundColor: region.themeColor } : undefined}>{implemented ? node.emoji : '…'}{cleared && <span className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full bg-card text-sm shadow">{faded ? '↻' : '✓'}</span>}</button><div className="mt-1 whitespace-nowrap text-xs font-bold">{node.label}</div></div> })}
    </div>
    {toast && <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-5 py-3 text-sm text-background shadow-lg">{toast}</div>}
    {locked && <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-xl rounded-t-[2rem] border border-border bg-card p-6 shadow-2xl"><button onClick={() => setLocked(null)} className="absolute right-5 top-4 text-xl" aria-label="とじる">×</button><h2 className="text-xl font-bold">これを あそぶには</h2><p className="mt-2 text-sm text-muted-foreground">このもんだいを ひらくには、つぎの もんだいを さわってみよう。</p><div className="mt-4 flex flex-col gap-2">{locked.prerequisites.map((id) => { const n = getNode(id)!; return <Link key={id} href={`/q/${id}`} className="rounded-2xl bg-muted p-3 font-bold">{n.emoji} {n.label}</Link> })}</div></div>}
  </div>
}
