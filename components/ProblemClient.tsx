'use client'
import Link from 'next/link'
import { ArrowLeft, Minus, Plus, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { getNextProblem, getProblem, isLaunchProblem } from '@/lib/problems'
import { refreshSave } from '@/lib/progress'
import { recordClear } from '@/app/actions/progress'
import { Lever } from '@/components/Lever'
import { LaunchCourse } from '@/components/LaunchCourse'
import { SolvedOverlay } from '@/components/SolvedOverlay'
export function ProblemClient({ id }: { id: string }) {
 const problem=getProblem(id)??getProblem('lever-01')!; const [solved,setSolved]=useState(false); const [weights,setWeights]=useState('weights' in problem?problem.weights:[]); const [grams,setGrams]=useState(5); const [launchFormula,setLaunchFormula]=useState('')
 const solve=()=>{setSolved(true);recordClear(problem.id).then(refreshSave)}
 const solveLaunch=(achieved:{label:string;stretch:number;distance:number}[])=>{setLaunchFormula(achieved.map(a=>`${a.stretch}cm のばす → ${a.distance}cm`).join('　／　'));setSolved(true);recordClear(problem.id).then(refreshSave)}
 if(isLaunchProblem(problem)) return <main className="min-h-screen bg-background px-5 py-6 text-foreground"><div className="mx-auto flex w-full max-w-xl flex-col gap-5"><header className="flex items-center gap-3"><Link href="/" className="flex size-12 items-center justify-center rounded-lg border border-border" aria-label="もどる"><ArrowLeft /></Link><h1 className="text-xl font-bold">{problem.title}</h1></header><p className="rounded-2xl bg-card p-4 text-center leading-6 shadow-sm">{problem.prompt}</p>{solved?<SolvedOverlay problem={{...problem,solved:{...problem.solved,formula:launchFormula||problem.solved.formula}} as never} next={getNextProblem(problem.id) as never} onRetry={()=>setSolved(false)}/>:<LaunchCourse lanes={problem.lanes} length={problem.courseLengthCm} maxStretch={problem.maxStretchCm} onSolved={solveLaunch}/>}</div></main>
 const change=(id:string,pos:number)=>setWeights(ws=>ws.map(w=>w.id===id?{...w,position:pos}:w)); const editable=weights.find(w=>w.gramsEditable)
 return <main className="min-h-screen bg-background px-5 py-6 text-foreground"><div className="mx-auto flex w-full max-w-xl flex-col gap-5"><header className="flex items-center gap-3"><Link href="/" className="flex size-12 items-center justify-center rounded-lg border border-border" aria-label="もどる"><ArrowLeft /></Link><h1 className="text-xl font-bold">{problem.title}</h1></header><p className="rounded-2xl bg-card p-4 text-center leading-6 shadow-sm">{problem.prompt}</p><div className="rounded-3xl border border-border bg-card px-3 py-7 shadow-sm"><Lever weights={weights} notches={problem.notches} onChange={change} onSolved={solve}/></div>{editable&&<div className="flex items-center justify-center gap-5"><button onClick={()=>setGrams(g=>Math.max(5,g-5))} className="flex size-12 items-center justify-center rounded-lg border border-border" aria-label="おもりを軽くする"><Minus/></button><span>{grams}g</span><button onClick={()=>setGrams(g=>Math.min(30,g+5))} className="flex size-12 items-center justify-center rounded-lg border border-border" aria-label="おもりを重くする"><Plus/></button></div>}{solved&&<SolvedOverlay problem={problem} next={getNextProblem(problem.id)} onRetry={()=>setSolved(false)}/>} {!solved&&<button onClick={()=>setWeights(problem.weights)} className="mx-auto flex min-h-12 items-center gap-2 rounded-lg px-4 text-sm font-bold text-muted-foreground"><RotateCcw/>もういちど</button>}</div></main>
}
