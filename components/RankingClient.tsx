'use client'
import Link from 'next/link'
import useSWR from 'swr'
import { ArrowLeft, Trophy } from 'lucide-react'

type Board = {
  weekStart: string
  board: { rank: number; name: string; prefecture: string; minutes: number; isMe: boolean }[]
  myRank: number | null
  lastWeekWinners: { userId: string; rank: number; coinsAwarded: number; name: string }[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const MEDAL = ['🥇', '🥈', '🥉']

export function RankingClient() {
  const { data } = useSWR<Board>('/api/ranking', fetcher, { refreshInterval: 15_000 })

  return (
    <main className="min-h-screen bg-background px-5 py-6 text-foreground">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
        <header className="flex items-center gap-3">
          <Link href="/" className="flex size-12 items-center justify-center rounded-lg border border-border" aria-label="もどる">
            <ArrowLeft />
          </Link>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <Trophy className="size-6 text-primary" /> 今週の がんばりランキング
          </h1>
        </header>

        <p className="rounded-2xl bg-card p-4 text-sm leading-6 text-muted-foreground shadow-sm">
          アプリを つかった 時間の ランキングだよ。毎週 月曜日に 上位3人に コインが プレゼントされるよ！
        </p>

        {data?.lastWeekWinners && data.lastWeekWinners.length > 0 && (
          <section className="rounded-2xl border border-border bg-card p-4">
            <h2 className="mb-2 text-sm font-bold text-muted-foreground">先週の 受賞者</h2>
            <ul className="flex flex-col gap-1">
              {data.lastWeekWinners.map((w) => (
                <li key={w.userId} className="flex items-center justify-between text-sm">
                  <span>
                    {MEDAL[w.rank - 1] ?? '🏅'} {w.name}
                  </span>
                  <span className="font-bold text-primary">+{w.coinsAwarded}✨</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="flex flex-col gap-2">
          {!data && <p className="text-center text-sm text-muted-foreground">読みこみ中…</p>}
          {data?.board.length === 0 && (
            <p className="rounded-2xl bg-card p-6 text-center text-sm text-muted-foreground shadow-sm">
              まだ 今週の きろくが ないよ。アプリを つかって 1位を めざそう！
            </p>
          )}
          {data?.board.map((row) => (
            <div
              key={row.rank}
              className={`flex items-center gap-3 rounded-2xl border p-3 shadow-sm ${row.isMe ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}
            >
              <span className="w-8 text-center font-black">{MEDAL[row.rank - 1] ?? row.rank}</span>
              <div className="flex-1">
                <p className="font-bold">
                  {row.name} {row.isMe && <span className="text-xs text-primary">（きみ）</span>}
                </p>
                <p className="text-xs text-muted-foreground">{row.prefecture}</p>
              </div>
              <span className="font-bold">{row.minutes}分</span>
            </div>
          ))}
        </section>

        {data && data.myRank === null && data.board.length > 0 && (
          <p className="text-center text-sm text-muted-foreground">きみは まだ 今週の きろくが ないよ</p>
        )}
      </div>
    </main>
  )
}
