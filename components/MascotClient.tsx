'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
import { ArrowLeft, Check, Heart, Sparkles } from 'lucide-react'
import { defaultSave, refreshSave, useSave } from '@/lib/progress'
import {
  BODY_STAGE_LABEL,
  FIELD_INFO,
  MASCOT_FIELDS,
  SHOP_ITEMS,
  computeMascotLook,
  heartsFor,
  nextFieldGoal,
  type MascotField,
  type ShopKind,
} from '@/lib/mascot'
import { MascotView, type MascotMood } from '@/components/MascotView'
import { buyItem } from '@/app/actions/mascot'

const TABS: { kind: ShopKind; label: string }[] = [
  { kind: 'snack', label: 'おやつ' },
  { kind: 'background', label: 'はいけい' },
  { kind: 'accessory', label: 'こもの' },
]

const TALK: Record<MascotField | 'none', string> = {
  none: 'いっしょに じっけん しようね！',
  butsuri: 'ちからこぶ みて！ てこも ゴムも まかせて！',
  kagaku: 'ぶくぶく…ふしぎな まぜもの、だいすき！',
  chigaku: 'そらも いしも、キラキラ してるね！',
  seibutsu: 'こけが ふかふか…しょくぶつと なかよしだよ',
}

export function MascotClient() {
  const { save } = useSave()
  const isNew = useSearchParams().get('new') === '1'
  const m = save.mascot ?? defaultSave.mascot
  const look = computeMascotLook(save.cleared ?? {})
  const owned = new Set(m.owned)

  const [tab, setTab] = useState<ShopKind>('snack')
  const [mood, setMood] = useState<MascotMood>('normal')
  const [talk, setTalk] = useState<string | null>(null)
  const [eating, setEating] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const later = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms))

  const top = MASCOT_FIELDS.reduce<MascotField | 'none'>(
    (best, f) => (look.counts[f] > 0 && (best === 'none' || look.counts[f] > look.counts[best]) ? f : best),
    'none',
  )

  const poke = () => {
    if (eating) return
    setMood('happy')
    setTalk(TALK[top])
    later(1600, () => {
      setMood('normal')
      setTalk(null)
    })
  }

  const onBuy = (itemId: string, emoji: string, kind: ShopKind) => {
    setPendingId(itemId)
    startTransition(async () => {
      try {
        const res = await buyItem(itemId)
        if (!res.ok) {
          setMessage('コインが たりないよ')
          later(1800, () => setMessage(null))
          return
        }
        if (kind === 'snack') {
          setEating(emoji)
          setMood('eat')
          later(1200, () => {
            setEating(null)
            setMood('happy')
            setTalk('おいしい！ ありがとう！')
          })
          later(2600, () => {
            setMood('normal')
            setTalk(null)
          })
        }
        refreshSave()
      } finally {
        setPendingId(null)
      }
    })
  }

  const hearts = heartsFor(m.love)

  return (
    <main className="min-h-[var(--stage-h)] bg-[#fdf9ef] px-4 py-5 text-[#3d3a38]">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <div className="flex items-center justify-between">
          {isNew ? (
            <span className="text-sm font-black text-[#8a8478]">きみの なかまが うまれたよ！</span>
          ) : (
            <Link href="/" className="flex items-center gap-1 text-sm font-bold" aria-label="もどる">
              <ArrowLeft className="size-4" /> もどる
            </Link>
          )}
          <span className="flex items-center gap-1 rounded-full border-2 border-[#0e4b69] bg-[#f7c94b] px-3 py-1 text-sm font-black shadow-[0_3px_0_#174d70]">
            <Sparkles className="size-4" /> {save.points}
          </span>
        </div>

        <div className="relative overflow-hidden rounded-3xl border-2 border-[#0e4b69] shadow-[0_4px_0_#174d70]">
          <button onClick={poke} className="block w-full" aria-label="マスコットを なでる">
            <MascotView look={look} background={m.background} accessory={m.accessory} mood={mood} size={360} className="h-auto w-full" />
          </button>
          {talk && (
            <div className="pointer-events-none absolute inset-x-6 top-3 rounded-2xl border-2 border-[#0e4b69] bg-white px-3 py-2 text-center text-sm font-black shadow-[0_3px_0_#174d70]">
              {talk}
            </div>
          )}
          {eating && (
            <span className="mascot-snack pointer-events-none absolute left-1/2 top-[8%] -translate-x-1/2 text-5xl" aria-hidden="true">
              {eating}
            </span>
          )}
          <div className="absolute bottom-2 left-3 rounded-full bg-white/85 px-3 py-1 text-xs font-black">
            {BODY_STAGE_LABEL[look.body - 1]}
          </div>
          <div className="absolute bottom-2 right-3 flex gap-0.5 rounded-full bg-white/85 px-2 py-1" aria-label={`なかよし ${hearts} / 5`}>
            {Array.from({ length: 5 }, (_, i) => (
              <Heart key={i} className="size-4" fill={i < hearts ? '#f27aa0' : 'none'} stroke={i < hearts ? '#f27aa0' : '#c9c4b6'} />
            ))}
          </div>
        </div>

        {isNew && (
          <Link
            href="/"
            className="flex min-h-14 items-center justify-center rounded-2xl border-2 border-[#0e4b69] bg-[#f7c94b] text-lg font-black shadow-[0_4px_0_#174d70]"
          >
            いっしょに はじめる
          </Link>
        )}

        <section className="rounded-3xl border-2 border-[#e4dfce] bg-white p-4">
          <h2 className="mb-1 text-sm font-black">そだちかた</h2>
          <p className="mb-3 text-xs font-bold text-[#8a8478]">クリアした ぶんやで すがたが かわるよ</p>
          <div className="flex flex-col gap-2.5">
            {MASCOT_FIELDS.map((f) => {
              const info = FIELD_INFO[f]
              const lv = look.fields[f]
              const goal = nextFieldGoal(look.counts[f])
              return (
                <div key={f} className="flex items-center gap-3">
                  <span className="w-10 shrink-0 text-xs font-black" style={{ color: info.color }}>
                    {info.label}
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((n) => (
                      <span key={n} className="size-4 rounded-full border-2" style={{ borderColor: info.color, background: lv >= n ? info.color : 'transparent' }} />
                    ))}
                  </div>
                  <span className="min-w-0 flex-1 text-[11px] font-bold leading-4 text-[#8a8478]">
                    {goal === null ? `${info.grows}！ MAX` : `あと ${goal}回 クリアで ${info.grows}`}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex gap-2">
            {TABS.map((t) => (
              <button
                key={t.kind}
                onClick={() => setTab(t.kind)}
                className={`flex-1 rounded-full border-2 border-[#0e4b69] py-2 text-sm font-black ${tab === t.kind ? 'bg-[#0e4b69] text-white' : 'bg-white'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {message && <p className="text-center text-sm font-black text-red-600">{message}</p>}
          <div className="grid grid-cols-3 gap-2">
            {SHOP_ITEMS.filter((i) => i.kind === tab).map((item) => {
              const equipped = item.id === m.background || item.id === m.accessory
              const have = item.kind !== 'snack' && (item.price === 0 || owned.has(item.id))
              const short = !have && save.points < item.price
              return (
                <button
                  key={item.id}
                  onClick={() => onBuy(item.id, item.emoji, item.kind)}
                  disabled={pendingId !== null || equipped || Boolean(eating)}
                  className="flex flex-col items-center gap-1 rounded-2xl border-2 bg-white p-2.5 disabled:opacity-100"
                  style={{ borderColor: equipped ? '#0e4b69' : '#e4dfce', opacity: short ? 0.55 : 1 }}
                >
                  <span className="text-3xl" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <span className="text-xs font-black">{item.name}</span>
                  <span className="flex items-center gap-1 text-[11px] font-black text-[#8a6a1e]">
                    {equipped ? (
                      <>
                        <Check className="size-3" /> つけてる
                      </>
                    ) : have ? (
                      'もってる'
                    ) : (
                      <>
                        <Sparkles className="size-3" /> {item.price}
                      </>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
          {tab === 'snack' && <p className="text-center text-xs font-bold text-[#8a8478]">おやつを あげると なかよし ハートが ふえるよ</p>}
        </section>
      </div>
    </main>
  )
}
