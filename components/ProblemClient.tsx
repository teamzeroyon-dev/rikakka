'use client'
import Link from 'next/link'
import { ArrowLeft, Minus, Plus, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { getNextProblem, getProblem } from '@/lib/problems'
import { markSolved } from '@/lib/progress'
import { Lever } from '@/components/Lever'
import { SolvedOverlay } from '@/components/SolvedOverlay'
export function ProblemClient({ id }: { id: string }) {
 const problem = getProblem(id) ?? getProblem('lever-01')!; const [weights, setWeights] = useState(problem.weights); const [solved, setSolved] = useState(false)
 const change = (weightId: string, position: number) => setWeights(current => current.map(w => w.id === weightId ? { ...w, position } : w))
 const solve = () => { setSolved(true); markSolved(problem.id) }; const retry = () => { setWeights(problem.weights); setSolved(false) }; const editable = weights.find(w => w.gramsEditable)
 return <main className="min-h-screen bg-background px-5 py-6 text-foreground sm:px-8"><div className="mx-auto flex w-full max-w-xl flex-col gap-5"><header className="flex items-center gap-3"><Link href="/" className="flex size-12 items-center justify-center rounded-lg border border-border" aria-label="もどる"><ArrowLeft className="size-5" /></Link><h1 className="text-xl font-bold">{problem.title}</h1></header><p className="rounded-2xl bg-card p-4 text-center leading-6 shadow-sm">{problem.prompt}</p><div className="rounded-3xl border border-border bg-card px-3 py-7 shadow-sm"><Lever weights={weights} notches={problem.notches} onChange={change} onSolved={solve} /></div>{editable && <div className="flex items-center justify-center gap-5"><button onClick={() => setWeights(current => current.map(w => w.id === editable.id ? { ...w, grams: Math.max(problem.gramsRange!.min, w.grams - problem.gramsRange!.step) } : w))} className="flex size-12 items-center justify-center rounded-lg border border-border" aria-label="おもりを軽くする"><Minus /></button><span className="min-w-16 text-center text-lg font-bold">{editable.grams}g</span><button onClick={() => setWeights(current => current.map(w => w.id === editable.id ? { ...w, grams: Math.min(problem.gramsRange!.max, w.grams + problem.gramsRange!.step) } : w))} className="flex size-12 items-center justify-center rounded-lg border border-border" aria-label="おもりを重くする"><Plus /></button></div>}{!solved && <button onClick={retry} className="mx-auto flex min-h-12 items-center gap-2 rounded-lg px-4 text-sm font-bold text-muted-foreground"><RotateCcw className="size-4" />もういちど</button>}{solved && <SolvedOverlay problem={problem} next={getNextProblem(problem.id)} onRetry={retry} />}</div></main>
}
