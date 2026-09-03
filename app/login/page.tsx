'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createAccount } from '@/app/actions/auth'
import { PREFECTURES } from '@/lib/prefectures'

export default function LoginPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [prefecture, setPrefecture] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const canSubmit = name.trim().length > 0 && prefecture.length > 0 && !isPending

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setError(null)
    startTransition(async () => {
      try {
        await createAccount(name, prefecture)
        // First stop after signing up is the avatar picker; the map comes after.
        router.push('/avatar?new=1')
        router.refresh()
      } catch {
        setError('うまく はじめられなかったよ。もう一度 ためしてね。')
      }
    })
  }

  return (
    <main className="flex min-h-[var(--stage-h)] items-center justify-center bg-[#CFE6EE] px-5 py-10">
      <div className="w-full max-w-sm rounded-3xl border-2 border-[#0e4b69] bg-[#fffbf5] p-6 shadow-[0_6px_0_#174d70]">
        <div className="mb-5 flex flex-col items-center gap-2 text-center">
          <span className="text-4xl" aria-hidden="true">
            
          </span>
          <h1 className="text-xl font-black text-[#3d3a38]">さわって わかる さんすう・りか</h1>
          <p className="text-sm leading-6 text-[#8a8478]">なまえと とどうふけんを えらんだら、つぎは アバターだよ</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-bold text-[#3d3a38]">
              なまえ
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder="あおい"
              className="min-h-12 rounded-2xl border-2 border-[#e4dfce] bg-white px-4 text-base font-bold text-[#3d3a38] outline-none focus:border-[#0e4b69]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="prefecture" className="text-sm font-bold text-[#3d3a38]">
              とどうふけん
            </label>
            <select
              id="prefecture"
              value={prefecture}
              onChange={(e) => setPrefecture(e.target.value)}
              className="min-h-12 rounded-2xl border-2 border-[#e4dfce] bg-white px-4 text-base font-bold text-[#3d3a38] outline-none focus:border-[#0e4b69]"
            >
              <option value="">えらんでね</option>
              {PREFECTURES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-center text-sm font-bold text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 flex min-h-14 items-center justify-center rounded-2xl border-2 border-[#0e4b69] bg-[#f7c94b] text-lg font-black text-[#3d3a38] shadow-[0_4px_0_#174d70] disabled:opacity-50"
          >
            {isPending ? 'はじめてるよ…' : 'はじめる'}
          </button>
        </form>
      </div>
    </main>
  )
}
