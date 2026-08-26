'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, Backpack, BatteryCharging, BookOpen, ChevronRight, CircleHelp, Cloud, Gem, Lightbulb, LockKeyhole, Mountain, Sparkles, Star, Sun, Zap } from 'lucide-react'
import { continents } from '@/lib/world'
import { defaultSave, readSave, type Save } from '@/lib/progress'

const topics = [
  { label: 'でんき', icon: Zap, color: 'bg-[#f7c94b]', position: 'left-[8%] top-[25%]', href: '/c/science' },
  { label: 'てんき', icon: Sun, color: 'bg-[#f08b54]', position: 'left-[36%] top-[18%]', href: '/c/science' },
  { label: 'てこ', icon: Gem, color: 'bg-[#55c9c1]', position: 'left-[63%] top-[27%]', href: '/c/science' },
  { label: 'ふりこ', icon: CircleHelp, color: 'bg-[#ee7d9b]', position: 'left-[19%] top-[58%]', href: '/c/science' },
  { label: 'せいめい', icon: Cloud, color: 'bg-[#8bcf6a]', position: 'left-[50%] top-[53%]', href: '/c/life' },
]

const nodes = [
  { x: '16%', y: '42%', label: 'はじめ', color: 'bg-[#73c9ba]', done: true },
  { x: '29%', y: '34%', label: 'でんき', color: 'bg-[#f0c546]', done: true },
  { x: '43%', y: '41%', label: 'てんき', color: 'bg-[#f28b54]', done: false },
  { x: '57%', y: '34%', label: 'てこ', color: 'bg-[#55c9c1]', done: false, href: '/c/science' },
  { x: '72%', y: '43%', label: 'まとめ', color: 'bg-[#738ed1]', done: false },
  { x: '33%', y: '69%', label: 'チャレンジ', color: 'bg-[#8d75c8]', done: false },
  { x: '61%', y: '65%', label: 'スペシャル', color: 'bg-[#e68cbd]', done: false },
]

export default function Home() {
  const [save, setSave] = useState<Save>(defaultSave)
  useEffect(() => setSave(readSave()), [])
  return (
    <main className="min-h-screen bg-[#102f48] p-3 text-[#173047] sm:p-6">
      <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-6xl overflow-hidden rounded-[2rem] border-4 border-[#0b263c] bg-[#2d7196] shadow-2xl sm:min-h-[620px]">
        <header className="flex items-center justify-between border-b-4 border-[#123d5b] bg-[#174d70] px-4 py-3 text-white sm:px-7">
          <div className="flex items-center gap-3"><Link href="/" aria-label="もどる" className="rounded-full bg-[#2c7595] p-2"><ArrowLeft className="size-5" /></Link><div className="flex items-center gap-2 text-lg font-black tracking-tight"><BookOpen className="size-5 text-[#f7c94b]" /> 学習開始!</div></div>
          <div className="hidden items-center gap-3 rounded-full bg-[#0e3b5b] px-5 py-2 text-sm font-bold sm:flex">小学5・6年 単元選択 <span className="text-[#f7c94b]">▰</span></div>
          <Link href="/bag" aria-label="もちもの" className="rounded-xl bg-[#286b8e] p-2"><Backpack className="size-6" /></Link>
        </header>
        <div className="relative flex min-h-[550px] flex-col gap-4 p-4 sm:p-7">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="rounded-2xl border-2 border-[#0e4b69] bg-[#e9f0d2] px-5 py-3 shadow-[0_5px_0_#174d70]"><p className="text-xs font-black text-[#53727b]">しょうがっこう 5・6ねん</p><p className="text-xl font-black">りかの ミッション</p></div>
            <div className="flex items-center gap-2 rounded-full border-2 border-[#0e4b69] bg-[#f7c94b] px-4 py-2 font-black shadow-[0_4px_0_#174d70]"><Sparkles className="size-5" /> {save.points} キラ</div>
          </div>
          <section className="relative min-h-[430px] flex-1 overflow-hidden rounded-[2rem] border-4 border-[#174d70] bg-[#73b4a5] shadow-inner" aria-label="単元選択マップ">
            <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(#d7edc8 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
            <div className="absolute -bottom-20 left-1/2 size-80 -translate-x-1/2 rounded-[45%] bg-[#d5df9e] opacity-70" />
            <div className="absolute right-[-4%] top-[4%] size-44 rounded-[40%] bg-[#8bcb8f] opacity-80" />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M 12 44 Q 28 25 43 41 T 75 42" fill="none" stroke="#f5e39b" strokeWidth="2.2" strokeDasharray="2 2" /><path d="M 32 70 Q 45 49 59 65" fill="none" stroke="#f5e39b" strokeWidth="2.2" strokeDasharray="2 2" /></svg>
            {topics.map(({ label, icon: Icon, color, position, href }) => <Link key={label} href={href} className={`absolute ${position} z-10 flex w-24 -translate-x-1/2 flex-col items-center gap-1 sm:w-32`}><span className={`flex size-14 items-center justify-center rounded-[35%] border-4 border-[#174d70] ${color} shadow-[0_4px_0_#174d70] sm:size-16`}><Icon className="size-8 text-white drop-shadow" /></span><span className="rounded-full bg-[#174d70] px-2 py-1 text-xs font-black text-white">{label}</span></Link>)}
            {nodes.map((node, index) => <Link key={node.label} href={node.href ?? '#'} aria-label={node.label} className={`absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center ${node.x} ${node.y}`}><span className={`relative flex size-12 rotate-45 items-center justify-center rounded-xl border-4 border-[#174d70] ${node.color} shadow-[0_4px_0_#174d70] sm:size-14`}>{node.done ? <Star className="size-6 -rotate-45 fill-white text-white" /> : index === 4 ? <LockKeyhole className="size-5 -rotate-45 text-white" /> : <ChevronRight className="size-6 -rotate-45 text-white" />}</span><span className="mt-2 whitespace-nowrap rounded bg-[#174d70] px-2 py-1 text-[10px] font-black text-white">{node.label}</span></Link>)}
            <div className="absolute bottom-4 left-4 z-20 rounded-xl border-2 border-[#174d70] bg-[#e9f0d2] px-3 py-2 text-xs font-black shadow-[0_3px_0_#174d70]"><BatteryCharging className="mr-1 inline size-4 text-[#e58b45]" /> すすみぐあい 18%</div>
          </section>
          <div className="flex justify-end"><Link href="/c/physics" className="flex items-center gap-2 rounded-2xl border-4 border-[#174d70] bg-[#f7c94b] px-6 py-3 text-lg font-black shadow-[0_5px_0_#174d70] transition hover:-translate-y-1">ミッション開始! <ChevronRight /></Link></div>
        </div>
      </div>
    </main>
  )
}
