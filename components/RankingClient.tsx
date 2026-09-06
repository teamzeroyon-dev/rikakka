'use client'
import Link from 'next/link'
import useSWR from 'swr'
import { ArrowLeft, Crown, Trophy } from 'lucide-react'

type Board = {
  weekStart: string
  board: { rank: number; name: string; prefecture: string; minutes: number; isMe: boolean }[]
  myRank: number | null
  lastWeekWinners: { userId: string; rank: number; coinsAwarded: number; name: string }[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

// gold / silver / bronze for the top three, a neutral chip below.
const RANK_LOOK = [
  { bg: 'linear-gradient(#ffe27a,#f7c94b)', ring: '#d9a72c', text: '#7a5a10' },
  { bg: 'linear-gradient(#eef2f6,#cfd8e0)', ring: '#9aa8b4', text: '#4a5560' },
  { bg: 'linear-gradient(#f4cfa2,#e0a86a)', ring: '#b8814a', text: '#6e4a22' },
]
function rankLook(rank: number) {
  return RANK_LOOK[rank - 1] ?? { bg: '#eef4f7', ring: '#cfe0e8', text: '#3d3a38' }
}

export function RankingClient() {
  const { data } = useSWR<Board>('/api/ranking', fetcher, { refreshInterval: 15_000 })

  return (
    <main className="min-h-[var(--stage-h)] px-4 py-5 text-foreground" style={{ background: 'linear-gradient(#fff4d9,#ffe4bd)' }}>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <header className="flex items-center gap-3 rounded-3xl bg-gradient-to-r from-[#F0A63E] to-[#F7C94B] px-4 py-3 text-white shadow-[0_5px_0_#c96a1e]">
          <Link href="/" className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/25" aria-label="もどる">
            <ArrowLeft />
          </Link>
          <h1 className="flex items-center gap-2 text-lg font-black">
            <Trophy className="size-6" /> 今週の がんばりランキング
          </h1>
        </header>

        <p className="rounded-2xl bg-white/85 p-4 text-sm font-bold leading-6 text-[#5f5a52] shadow-sm">
          アプリを つかった 時間の ランキングだよ。毎週 日曜 午後6時に こうしんされて、上位3人に コインが プレゼント！
        </p>

        {data?.lastWeekWinners && data.lastWeekWinners.length > 0 && (
          <section className="rounded-3xl border-4 border-[#f7c94b] bg-white/90 p-4 shadow-[0_5px_0_#d9a72c]">
            <h2 className="mb-2 flex items-center gap-1 text-sm font-black text-[#c96a1e]">
              <Crown className="size-4" /> 先週の じゅしょう者
            </h2>
            <ul className="flex flex-col gap-2">
              {data.lastWeekWinners.map((w) => {
                const look = rankLook(w.rank)
                return (
                  <li key={w.userId} className="flex items-center gap-2 text-sm">
                    <span className="flex size-7 items-center justify-center rounded-full text-xs font-black" style={{ background: look.bg, border: `2px solid ${look.ring}`, color: look.text }}>
                      {w.rank}
                    </span>
                    <span className="flex-1 font-black text-[#3d3a38]">{w.name}</span>
                    <span className="rounded-full bg-[#f7c94b] px-3 py-0.5 text-xs font-black text-[#7a5a10]">+{w.coinsAwarded}</span>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        <section className="flex flex-col gap-2">
          {!data && <p className="text-center text-sm font-bold text-[#8a8478]">読みこみ中…</p>}
          {data?.board.length === 0 && (
            <p className="rounded-3xl bg-white/85 p-6 text-center text-sm font-bold text-[#8a8478] shadow-sm">
              まだ 今週の きろくが ないよ。アプリを つかって 1位を めざそう！
            </p>
          )}
          {data?.board.map((row) => {
            const look = rankLook(row.rank)
            const top3 = row.rank <= 3
            return (
              <div
                key={row.rank}
                className="flex items-center gap-3 rounded-2xl border-4 p-3 shadow-[0_4px_0_rgba(14,75,105,0.15)]"
                style={{
                  borderColor: row.isMe ? '#4E8FC5' : top3 ? look.ring : '#eadfc8',
                  background: row.isMe ? 'linear-gradient(#eaf3fb,#d9ecfa)' : top3 ? look.bg : '#fffdf8',
                }}
              >
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full text-base font-black"
                  style={{ background: '#fff', border: `2px solid ${look.ring}`, color: look.text }}
                >
                  {row.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-black text-[#3d3a38]">
                    {row.name} {row.isMe && <span className="text-xs text-[#2f6fa3]">（きみ）</span>}
                  </p>
                  <p className="text-xs font-bold text-[#8a8478]">{row.prefecture}</p>
                </div>
                <span className="shrink-0 rounded-full bg-white/70 px-3 py-1 text-sm font-black text-[#3d3a38]">{row.minutes}分</span>
              </div>
            )
          })}
        </section>

        {data && data.myRank === null && data.board.length > 0 && (
          <p className="text-center text-sm font-bold text-[#8a8478]">きみは まだ 今週の きろくが ないよ</p>
        )}
      </div>
    </main>
  )
}
