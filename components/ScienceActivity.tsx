'use client'
import { useEffect, useMemo, useState } from 'react'
import { Check, Hand, RotateCcw } from 'lucide-react'
import type { ActivityConfig } from '@/lib/scienceStages'

// Fixed scrambles, keyed by length: the boards must render identically on the
// server and the client, so nothing here may call Math.random().
const SCRAMBLE: Record<number, number[]> = {
  2: [1, 0],
  3: [2, 0, 1],
  4: [2, 0, 3, 1],
  5: [3, 1, 4, 0, 2],
}

function scramble<T>(items: T[]): T[] {
  const order = SCRAMBLE[items.length]
  return order ? order.map((i) => items[i]) : items
}

function Board({ sky, ground, children }: { sky: string; ground?: string; children: React.ReactNode }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border-4 border-white shadow-[0_6px_0_rgba(14,75,105,0.25)]" style={{ background: sky }}>
      {ground && <div className="absolute inset-x-0 bottom-0 h-[30%]" style={{ background: ground }} />}
      {children}
    </div>
  )
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center justify-center gap-2 rounded-full bg-white/90 px-4 py-2 text-center text-sm font-black text-[#174d70] shadow-sm">
      <Hand className="size-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  )
}

function DoneBanner({ text }: { text: string }) {
  return (
    <p className="animate-chem-fade-in flex items-center justify-center gap-2 rounded-full bg-[#3d8a3d] px-5 py-2 text-center text-base font-black text-white shadow-md">
      <Check className="size-5 shrink-0" aria-hidden="true" />
      {text}
    </p>
  )
}

/* ------------------------------------------------------------------ scenes */

function SliderScene({ scene, value, steps }: { scene: string; value: number; steps: number }) {
  const t = steps > 1 ? value / (steps - 1) : 0

  if (scene === 'fault') {
    const drop = t * 28
    return (
      <Board sky="linear-gradient(#cfe9f7,#eaf6fb)">
        <div className="absolute inset-x-0 bottom-0 top-[28%] flex">
          <div className="relative h-full w-1/2">
            {['#a97a4c', '#d8bd85', '#9c8567'].map((c, i) => (
              <div key={c} className="absolute inset-x-0" style={{ background: c, top: `${i * 33}%`, height: '33.4%' }} />
            ))}
          </div>
          <div className="relative h-full w-1/2 transition-transform duration-200" style={{ transform: `translateY(${drop}%)` }}>
            {['#a97a4c', '#d8bd85', '#9c8567'].map((c, i) => (
              <div key={c} className="absolute inset-x-0" style={{ background: c, top: `${i * 33}%`, height: '33.4%' }} />
            ))}
          </div>
        </div>
        {t > 0.15 && (
          <span className="absolute left-1/2 top-[30%] -translate-x-1/2 rounded-full bg-[#e2596b] px-3 py-1 text-xs font-black text-white shadow">
            だんそう
          </span>
        )}
        <span className="absolute left-3 top-3 text-3xl">{t > 0.6 ? '🫨' : '🏞️'}</span>
      </Board>
    )
  }

  if (scene === 'moon-phase') {
    // value walks the moon around the earth; index 4 sits opposite the sun.
    const angle = (value / steps) * Math.PI * 2
    const mx = 50 + 33 * Math.sin(angle)
    const my = 50 - 33 * Math.cos(angle)
    const lit = Math.round((1 - Math.cos(angle)) / 2 * 100)
    return (
      <Board sky="linear-gradient(#1c2b52,#33406e)">
        <span className="absolute left-[4%] top-1/2 -translate-y-1/2 text-4xl">☀️</span>
        <div className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4E8FC5] text-center text-3xl leading-[3.5rem]">🌏</div>
        <div
          className="absolute size-11 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#f7f0d8]"
          style={{ left: `${mx}%`, top: `${my}%`, background: `linear-gradient(90deg, #6b6d7d ${100 - lit}%, #fdf6d8 ${100 - lit}%)` }}
        />
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[#174d70]">
          見える 形: {lit > 88 ? '満月' : lit < 12 ? '新月' : lit > 55 ? 'ふくらんだ 月' : '三日月・半月'}
        </span>
      </Board>
    )
  }

  if (scene === 'moon-sky') {
    const mx = 12 + t * 72
    const my = 62 - Math.sin(t * Math.PI) * 42
    return (
      <Board sky="linear-gradient(#20305c,#5b6ea8)" ground="linear-gradient(#3c5a3c,#2c4530)">
        <div className="absolute size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fdf6d8] shadow-[0_0_24px_#fdf6d8]" style={{ left: `${mx}%`, top: `${my}%` }} />
        {[18, 34, 58, 76, 88].map((x, i) => (
          <span key={x} className="absolute text-xs text-white/80" style={{ left: `${x}%`, top: `${14 + (i % 3) * 9}%` }}>
            ✦
          </span>
        ))}
        <span className="absolute bottom-[8%] left-[8%] text-3xl">🏠</span>
        <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[#174d70]">
          {['よる 7じ', 'よる 8じ', 'よる 9じ', 'よる 10じ', 'よる 11じ'][value] ?? ''}
        </span>
      </Board>
    )
  }

  // Daytime scenes all share one sky + sun arc.
  const sx = 10 + t * 78
  const sy = 62 - Math.sin(t * Math.PI) * 46
  const sunHeight = Math.sin(t * Math.PI)

  if (scene === 'sunny-spot') {
    // The lit patch tracks the sun; the child stands still in the middle.
    const patch = 78 - t * 56
    const kid = 50
    const inSun = Math.abs(patch - kid) < 11
    return (
      <Board sky="linear-gradient(#bfe6f5,#eaf6fb)" ground="linear-gradient(#9ecb84,#7fb268)">
        <div className="absolute size-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffd54a] shadow-[0_0_30px_#ffd54a] transition-all duration-200" style={{ left: `${sx}%`, top: `${sy}%` }} />
        <div
          className="absolute bottom-[6%] h-[16%] w-[22%] -translate-x-1/2 rounded-[50%] bg-[#fff3b0] opacity-80 transition-all duration-200"
          style={{ left: `${patch}%` }}
        />
        <span className="absolute bottom-[10%] left-1/2 -translate-x-1/2 text-4xl">{inSun ? '🧒' : '🧍'}</span>
        <span className={`absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-black text-white ${inSun ? 'bg-[#3d8a3d]' : 'bg-[#7a8b99]'}`}>
          {inSun ? 'ひなた！ あたたかい' : 'いまは 日かげ'}
        </span>
        <span className="absolute bottom-[8%] right-[10%] text-4xl">🌳</span>
      </Board>
    )
  }

  if (scene === 'sun-sky') {
    const labels = ['あさ（東）', 'ごぜん', 'おひる（真上）', 'ごご（西より）', 'ゆうがた（西）']
    return (
      <Board sky="linear-gradient(#bfe6f5,#fdeccd)" ground="linear-gradient(#9ecb84,#7fb268)">
        <div className="absolute size-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffd54a] shadow-[0_0_34px_#ffd54a] transition-all duration-200" style={{ left: `${sx}%`, top: `${sy}%` }} />
        <span className="absolute bottom-[8%] left-[6%] rounded-full bg-white/90 px-2 py-0.5 text-xs font-black text-[#174d70]">東</span>
        <span className="absolute bottom-[8%] right-[6%] rounded-full bg-white/90 px-2 py-0.5 text-xs font-black text-[#174d70]">西</span>
        <span className="absolute bottom-[6%] left-1/2 -translate-x-1/2 text-4xl">🏫</span>
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#174d70] px-3 py-1 text-xs font-black text-white">
          {labels[value] ?? ''}
        </span>
      </Board>
    )
  }

  // sun-shadow: shadow stretches away from the sun and grows as the sun sinks.
  const shadowLen = 8 + (1 - sunHeight) * 52
  const toLeft = t > 0.5
  return (
    <Board sky="linear-gradient(#bfe6f5,#fdeccd)" ground="linear-gradient(#9ecb84,#7fb268)">
      <div className="absolute size-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffd54a] shadow-[0_0_34px_#ffd54a] transition-all duration-200" style={{ left: `${sx}%`, top: `${sy}%` }} />
      <div
        className="absolute bottom-[13%] h-3 rounded-full bg-[#5d6f5d]/70 transition-all duration-200"
        style={{ width: `${shadowLen}%`, left: toLeft ? undefined : '50%', right: toLeft ? '50%' : undefined }}
      />
      <span className="absolute bottom-[14%] left-1/2 -translate-x-1/2 text-4xl">🧍</span>
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[#174d70]">
        かげの ながさ: {shadowLen < 20 ? 'みじかい' : shadowLen < 42 ? 'ふつう' : 'とても ながい'}
      </span>
    </Board>
  )
}

function SliderActivity({
  config,
  onDone,
}: {
  config: Extract<ActivityConfig, { kind: 'slider-scene' }>
  onDone: () => void
}) {
  const [value, setValue] = useState(config.start ?? 0)
  const [reached, setReached] = useState(false)

  useEffect(() => {
    if (config.goal.includes(value)) setReached(true)
  }, [value, config.goal])

  return (
    <div className="flex flex-col gap-3">
      <SliderScene scene={config.scene} value={value} steps={config.steps} />
      <label className="flex flex-col gap-2">
        <span className="text-center text-sm font-black text-[#174d70]">{config.control}</span>
        <input
          type="range"
          min={0}
          max={config.steps - 1}
          step={1}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="h-4 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-[#4E8FC5] via-[#f7c94b] to-[#e2596b] accent-[#174d70]"
          aria-label={config.control}
        />
      </label>
      {reached ? <DoneBanner text="できた！" /> : <Hint>{config.goalHint}</Hint>}
      {reached && (
        <button onClick={onDone} className="min-h-12 rounded-2xl bg-[#174d70] text-base font-black text-white shadow-[0_4px_0_#0e3450] active:translate-y-0.5">
          つぎへ すすむ
        </button>
      )}
    </div>
  )
}

/* -------------------------------------------------------------- pick a spot */

const PICK_SCENES: Record<string, { sky: string; ground: string; extras: string[] }> = {
  'shadow-sun': { sky: 'linear-gradient(#bfe6f5,#fdeccd)', ground: 'linear-gradient(#9ecb84,#7fb268)', extras: [] },
  'park-bugs': { sky: 'linear-gradient(#d9f0c4,#eaf7dd)', ground: 'linear-gradient(#8fbf6b,#6fa054)', extras: ['🌳', '🌸'] },
  'season-park': { sky: 'linear-gradient(#cfeafb,#fdf3d6)', ground: 'linear-gradient(#9ecb84,#7fb268)', extras: ['🌳', '⛲'] },
}

function PickSpotActivity({
  config,
  onDone,
}: {
  config: Extract<ActivityConfig, { kind: 'pick-spot' }>
  onDone: () => void
}) {
  const scene = PICK_SCENES[config.scene]
  const [found, setFound] = useState<string[]>([])
  const [missed, setMissed] = useState<string | null>(null)
  const done = found.length >= config.needed

  const tap = (id: string, correct: boolean) => {
    if (done) return
    if (!correct) {
      setMissed(id)
      setTimeout(() => setMissed(null), 500)
      return
    }
    setFound((f) => (f.includes(id) ? f : [...f, id]))
  }

  return (
    <div className="flex flex-col gap-3">
      <Board sky={scene.sky} ground={scene.ground}>
        {config.scene === 'shadow-sun' && (
          <>
            <span className="absolute bottom-[16%] left-[46%] text-4xl">🧍</span>
            <div className="absolute bottom-[15%] left-[52%] h-3 w-[26%] rounded-full bg-[#5d6f5d]/70" />
            <span className="absolute bottom-[9%] right-[10%] rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-black text-[#174d70]">
              かげは こっち（東）
            </span>
          </>
        )}
        {scene.extras.map((e, i) => (
          <span key={e} className="absolute text-3xl opacity-80" style={{ left: `${8 + i * 78}%`, bottom: '8%' }}>
            {e}
          </span>
        ))}
        {config.spots.map((spot) => {
          const isFound = found.includes(spot.id)
          return (
            <button
              key={spot.id}
              onClick={() => tap(spot.id, spot.correct)}
              className={`absolute flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-2xl transition ${
                isFound ? 'border-[#3d8a3d] bg-white shadow-lg' : 'border-white/70 bg-white/55'
              } ${missed === spot.id ? 'animate-node-flash border-[#e2596b]' : ''}`}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              aria-label={spot.label}
            >
              {spot.emoji}
              {isFound && (
                <span className="absolute -bottom-6 whitespace-nowrap rounded-full bg-[#3d8a3d] px-2 py-0.5 text-[10px] font-black text-white">
                  {spot.label}
                </span>
              )}
            </button>
          )
        })}
      </Board>
      {done ? <DoneBanner text="ぜんぶ 見つけた！" /> : <Hint>{config.goalHint}（あと {config.needed - found.length}）</Hint>}
      {done && (
        <button onClick={onDone} className="min-h-12 rounded-2xl bg-[#174d70] text-base font-black text-white shadow-[0_4px_0_#0e3450] active:translate-y-0.5">
          つぎへ すすむ
        </button>
      )}
    </div>
  )
}

/* ------------------------------------------------------------- order cards */

const CARD_COLORS = ['#FF9040', '#4EC5C1', '#F7C94B', '#9B72CF', '#5FB85F']

function OrderCardsActivity({
  config,
  onDone,
}: {
  config: Extract<ActivityConfig, { kind: 'order-cards' }>
  onDone: () => void
}) {
  const shuffled = useMemo(() => scramble(config.cards), [config.cards])
  const [placed, setPlaced] = useState<string[]>([])
  const [wrong, setWrong] = useState<string | null>(null)
  const done = placed.length === config.cards.length

  const tap = (id: string) => {
    if (done || placed.includes(id)) return
    if (config.cards[placed.length].id === id) {
      setPlaced((p) => [...p, id])
    } else {
      setWrong(id)
      setTimeout(() => setWrong(null), 500)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-h-24 flex-wrap items-center justify-center gap-2 rounded-3xl border-4 border-dashed border-[#b8d8e6] bg-[#f2fafd] p-3">
        {config.cards.map((card, i) => {
          const filled = placed[i]
          const data = config.cards.find((c) => c.id === filled)
          return (
            <div
              key={card.id}
              className="flex size-20 flex-col items-center justify-center rounded-2xl border-2 text-center"
              style={{
                borderColor: data ? CARD_COLORS[i % CARD_COLORS.length] : '#cfe0e8',
                background: data ? CARD_COLORS[i % CARD_COLORS.length] + '22' : '#fff',
              }}
            >
              {data ? (
                <>
                  <span className="text-2xl">{data.emoji}</span>
                  <span className="px-1 text-[10px] font-black leading-tight text-[#3d3a38]">{data.label}</span>
                </>
              ) : (
                <span className="text-sm font-black text-[#a9bcc6]">{i + 1}</span>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {shuffled.map((card, i) => {
          const used = placed.includes(card.id)
          return (
            <button
              key={card.id}
              onClick={() => tap(card.id)}
              disabled={used}
              className={`flex size-20 flex-col items-center justify-center rounded-2xl border-2 border-[#0e4b69] text-center shadow-[0_3px_0_#174d70] transition disabled:opacity-25 ${
                wrong === card.id ? 'animate-node-flash' : ''
              }`}
              style={{ background: CARD_COLORS[i % CARD_COLORS.length] + '33' }}
            >
              <span className="text-2xl">{card.emoji}</span>
              <span className="px-1 text-[10px] font-black leading-tight text-[#3d3a38]">{card.label}</span>
            </button>
          )
        })}
      </div>

      {done ? <DoneBanner text="じゅんばん せいかい！" /> : <Hint>{config.goalHint}</Hint>}
      {done && (
        <button onClick={onDone} className="min-h-12 rounded-2xl bg-[#174d70] text-base font-black text-white shadow-[0_4px_0_#0e3450] active:translate-y-0.5">
          つぎへ すすむ
        </button>
      )}
    </div>
  )
}

/* ----------------------------------------------------------- place targets */

const BOARD_LOOK: Record<string, { sky: string; ground?: string; extras?: { emoji: string; x: number; y: number }[] }> = {
  sky: { sky: 'linear-gradient(#1c2b52,#3d4f86)' },
  volcano: { sky: 'linear-gradient(#8fb6d6,#d8c39b)', ground: 'linear-gradient(#8b6b45,#6d5335)' },
  pond: { sky: 'linear-gradient(#aee0ef,#6bb8d4)', ground: 'linear-gradient(#d8cba0,#bfae82)' },
  forest: { sky: 'linear-gradient(#d9f0c4,#eaf7dd)', ground: 'linear-gradient(#8fbf6b,#6fa054)', extras: [{ emoji: '🌳', x: 8, y: 30 }] },
  plant: { sky: 'linear-gradient(#cfeafb,#eaf7dd)', ground: 'linear-gradient(#b08050,#8b6b45)', extras: [{ emoji: '🪴', x: 50, y: 52 }] },
  body: { sky: 'linear-gradient(#fdeef0,#fbe0e4)', extras: [{ emoji: '🧍', x: 82, y: 62 }] },
}

function PlaceTargetsActivity({
  config,
  onDone,
}: {
  config: Extract<ActivityConfig, { kind: 'place-targets' }>
  onDone: () => void
}) {
  const look = BOARD_LOOK[config.board] ?? { sky: 'linear-gradient(#e8f3f8,#fff)' }
  const tray = useMemo(() => scramble(config.tokens), [config.tokens])
  const [picked, setPicked] = useState<string | null>(null)
  const [placed, setPlaced] = useState<Record<string, string>>({})
  const [wrongSlot, setWrongSlot] = useState<string | null>(null)
  const done = Object.keys(placed).length === config.tokens.length

  const dropOn = (slotId: string) => {
    if (!picked || placed[slotId]) return
    const token = config.tokens.find((t) => t.id === picked)!
    if (token.slotId === slotId) {
      setPlaced((p) => ({ ...p, [slotId]: token.id }))
      setPicked(null)
    } else {
      setWrongSlot(slotId)
      setTimeout(() => setWrongSlot(null), 500)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Board sky={look.sky} ground={look.ground}>
        {look.extras?.map((e) => (
          <span key={e.emoji} className="absolute -translate-x-1/2 -translate-y-1/2 text-4xl" style={{ left: `${e.x}%`, top: `${e.y}%` }}>
            {e.emoji}
          </span>
        ))}
        {config.board === 'sky' &&
          config.slots.map((slot, i) => {
            const next = config.slots[i + 1]
            if (!next || !placed[slot.id] || !placed[next.id]) return null
            const dx = next.x - slot.x
            const dy = next.y - slot.y
            return (
              <div
                key={`line-${slot.id}`}
                className="absolute h-0.5 origin-left bg-[#f7f0d8]"
                style={{
                  left: `${slot.x}%`,
                  top: `${slot.y}%`,
                  width: `${Math.hypot(dx, dy)}%`,
                  transform: `rotate(${(Math.atan2(dy, dx) * 180) / Math.PI}deg)`,
                }}
              />
            )
          })}
        {config.slots.map((slot) => {
          const tokenId = placed[slot.id]
          const token = config.tokens.find((t) => t.id === tokenId)
          return (
            <button
              key={slot.id}
              onClick={() => dropOn(slot.id)}
              className={`absolute flex size-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl border-2 text-2xl transition ${
                token ? 'border-[#3d8a3d] bg-white shadow-md' : 'border-dashed border-white bg-white/45'
              } ${wrongSlot === slot.id ? 'animate-node-flash border-[#e2596b]' : ''} ${picked && !token ? 'ring-4 ring-[#f7c94b]' : ''}`}
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              aria-label={slot.label}
            >
              {token ? token.emoji : <span className="px-1 text-[9px] font-black leading-tight text-[#174d70]">{slot.label}</span>}
            </button>
          )
        })}
      </Board>

      <div className="flex flex-wrap justify-center gap-2">
        {tray.map((token) => {
          const used = Object.values(placed).includes(token.id)
          return (
            <button
              key={token.id}
              onClick={() => setPicked(token.id)}
              disabled={used}
              className={`flex min-h-16 w-24 flex-col items-center justify-center rounded-2xl border-2 border-[#0e4b69] bg-[#fdf9ef] shadow-[0_3px_0_#174d70] transition disabled:opacity-25 ${
                picked === token.id ? 'ring-4 ring-[#f7c94b]' : ''
              }`}
            >
              <span className="text-2xl">{token.emoji}</span>
              <span className="px-1 text-[10px] font-black leading-tight text-[#3d3a38]">{token.label}</span>
            </button>
          )
        })}
      </div>

      {done ? <DoneBanner text="ぜんぶ おけた！" /> : <Hint>{picked ? 'おきたい ばしょを タップしよう' : config.goalHint}</Hint>}
      {done && (
        <button onClick={onDone} className="min-h-12 rounded-2xl bg-[#174d70] text-base font-black text-white shadow-[0_4px_0_#0e3450] active:translate-y-0.5">
          つぎへ すすむ
        </button>
      )}
    </div>
  )
}

/* -------------------------------------------------------------- match pairs */

function MatchPairsActivity({
  config,
  onDone,
}: {
  config: Extract<ActivityConfig, { kind: 'match-pairs' }>
  onDone: () => void
}) {
  const rights = useMemo(() => scramble(config.pairs), [config.pairs])
  const [picked, setPicked] = useState<string | null>(null)
  const [matched, setMatched] = useState<string[]>([])
  const [wrong, setWrong] = useState<string | null>(null)
  const done = matched.length === config.pairs.length

  const tapRight = (id: string) => {
    if (!picked) return
    if (picked === id) {
      setMatched((m) => [...m, id])
      setPicked(null)
    } else {
      setWrong(id)
      setTimeout(() => setWrong(null), 500)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 rounded-3xl bg-[#f2fafd] p-3">
        <div className="flex flex-col gap-2">
          {config.pairs.map((pair, i) => {
            const ok = matched.includes(pair.id)
            return (
              <button
                key={pair.id}
                onClick={() => !ok && setPicked(pair.id)}
                disabled={ok}
                className={`flex min-h-16 items-center gap-2 rounded-2xl border-2 px-3 text-left transition ${
                  ok ? 'border-[#3d8a3d] bg-[#eaf7ea] opacity-70' : 'border-[#0e4b69] shadow-[0_3px_0_#174d70]'
                } ${picked === pair.id ? 'ring-4 ring-[#f7c94b]' : ''}`}
                style={{ background: ok ? undefined : CARD_COLORS[i % CARD_COLORS.length] + '2e' }}
              >
                <span className="text-2xl">{pair.left.emoji}</span>
                <span className="flex-1 text-xs font-black leading-tight text-[#3d3a38]">{pair.left.label}</span>
              </button>
            )
          })}
        </div>
        <div className="flex flex-col gap-2">
          {rights.map((pair) => {
            const ok = matched.includes(pair.id)
            return (
              <button
                key={pair.id}
                onClick={() => tapRight(pair.id)}
                disabled={ok}
                className={`flex min-h-16 items-center gap-2 rounded-2xl border-2 bg-white px-3 text-left transition ${
                  ok ? 'border-[#3d8a3d] bg-[#eaf7ea] opacity-70' : 'border-[#0e4b69] shadow-[0_3px_0_#174d70]'
                } ${wrong === pair.id ? 'animate-node-flash border-[#e2596b]' : ''}`}
              >
                <span className="text-2xl">{pair.right.emoji}</span>
                <span className="flex-1 text-xs font-black leading-tight text-[#3d3a38]">{pair.right.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {done ? <DoneBanner text="ぜんぶ そろった！" /> : <Hint>{picked ? '右から あう ものを えらぼう' : config.goalHint}</Hint>}
      {done && (
        <button onClick={onDone} className="min-h-12 rounded-2xl bg-[#174d70] text-base font-black text-white shadow-[0_4px_0_#0e3450] active:translate-y-0.5">
          つぎへ すすむ
        </button>
      )}
    </div>
  )
}

/* ----------------------------------------------------------------- drag path */

const PATH_LOOK: Record<string, { sky: string; ground?: string }> = {
  map: { sky: 'linear-gradient(#cfeafb,#eaf6fb)', ground: 'linear-gradient(#a7c98d,#8fbf6b)' },
  garden: { sky: 'linear-gradient(#d9f0c4,#eaf7dd)', ground: 'linear-gradient(#b08050,#8b6b45)' },
  flower: { sky: 'linear-gradient(#e7f7ff,#fdf3d6)', ground: 'linear-gradient(#8fbf6b,#6fa054)' },
  'body-digest': { sky: 'linear-gradient(#fdeef0,#fbe0e4)' },
  'body-air': { sky: 'linear-gradient(#eaf6fb,#dcefff)' },
  'body-blood': { sky: 'linear-gradient(#fdeef0,#ffe4e8)' },
}

function DragPathActivity({
  config,
  onDone,
}: {
  config: Extract<ActivityConfig, { kind: 'drag-path' }>
  onDone: () => void
}) {
  const look = PATH_LOOK[config.board] ?? { sky: 'linear-gradient(#e8f3f8,#fff)' }
  const [at, setAt] = useState(-1)
  const [wrong, setWrong] = useState<string | null>(null)
  const done = at === config.stops.length - 1
  const pos = at < 0 ? { x: 50, y: 92 } : config.stops[at]

  const tap = (index: number) => {
    if (done) return
    if (index === at + 1) {
      setAt(index)
    } else {
      setWrong(config.stops[index].id)
      setTimeout(() => setWrong(null), 500)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Board sky={look.sky} ground={look.ground}>
        {config.stops.map((stop, i) => {
          const next = config.stops[i + 1]
          if (!next || at <= i) return null
          const dx = next.x - stop.x
          const dy = next.y - stop.y
          return (
            <div
              key={`t-${stop.id}`}
              className="absolute h-1 origin-left rounded-full bg-[#f7c94b]"
              style={{
                left: `${stop.x}%`,
                top: `${stop.y}%`,
                width: `${Math.hypot(dx, dy)}%`,
                transform: `rotate(${(Math.atan2(dy, dx) * 180) / Math.PI}deg)`,
              }}
            />
          )
        })}
        {config.stops.map((stop, i) => {
          const visited = at >= i
          return (
            <button
              key={stop.id}
              onClick={() => tap(i)}
              className={`absolute flex size-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 text-2xl transition ${
                visited ? 'border-[#3d8a3d] bg-white shadow-md' : 'border-white bg-white/60'
              } ${wrong === stop.id ? 'animate-node-flash border-[#e2596b]' : ''} ${i === at + 1 ? 'ring-4 ring-[#f7c94b]' : ''}`}
              style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
              aria-label={stop.label}
            >
              {stop.emoji}
              <span className="absolute -bottom-5 whitespace-nowrap rounded-full bg-[#174d70] px-2 py-0.5 text-[9px] font-black text-white">
                {stop.label}
              </span>
            </button>
          )
        })}
        <span
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-3xl transition-all duration-300"
          style={{ left: `${pos.x}%`, top: `${(pos.y ?? 92) - 9}%` }}
          aria-hidden="true"
        >
          {config.mover.emoji}
        </span>
      </Board>

      {done ? <DoneBanner text="さいごまで はこべた！" /> : <Hint>{config.goalHint}</Hint>}
      {done && (
        <button onClick={onDone} className="min-h-12 rounded-2xl bg-[#174d70] text-base font-black text-white shadow-[0_4px_0_#0e3450] active:translate-y-0.5">
          つぎへ すすむ
        </button>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- dig layers */

function DigLayersActivity({
  config,
  onDone,
}: {
  config: Extract<ActivityConfig, { kind: 'dig-layers' }>
  onDone: () => void
}) {
  const [dug, setDug] = useState(0)
  const [answer, setAnswer] = useState<string | null>(null)
  const [wrong, setWrong] = useState<string | null>(null)
  const allDug = dug >= config.layers.length
  const solved = answer === config.answerId

  const tapLayer = (index: number, id: string) => {
    if (!allDug) {
      if (index === dug) setDug((d) => d + 1)
      return
    }
    if (solved) return
    if (id === config.answerId) {
      setAnswer(id)
    } else {
      setWrong(id)
      setTimeout(() => setWrong(null), 500)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-3xl border-4 border-white shadow-[0_6px_0_rgba(14,75,105,0.25)]">
        <div className="flex h-8 items-center justify-center bg-gradient-to-b from-[#cfe9f7] to-[#eaf6fb] text-sm">🌾 🌿 🪵</div>
        {config.layers.map((layer, i) => {
          const revealed = i < dug
          const isAnswer = answer === layer.id
          return (
            <button
              key={layer.id}
              onClick={() => tapLayer(i, layer.id)}
              className={`relative flex h-16 w-full items-center justify-center border-t-2 border-white/40 transition ${
                wrong === layer.id ? 'animate-node-flash' : ''
              } ${isAnswer ? 'ring-4 ring-inset ring-[#3d8a3d]' : ''} ${i === dug && !allDug ? 'ring-4 ring-inset ring-[#f7c94b]' : ''}`}
              style={{ background: revealed ? layer.color : '#6b543a' }}
            >
              {revealed ? (
                <span className="flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-black text-[#3d3a38]">
                  {layer.find && <span className="text-lg">{layer.find}</span>}
                  {layer.label}
                  {i === config.layers.length - 1 && <span className="text-[10px] text-[#8a8478]">いちばん 下</span>}
                </span>
              ) : (
                <span className="text-xs font-black text-white/80">タップして ほる</span>
              )}
            </button>
          )
        })}
      </div>

      {!allDug && <Hint>{config.goalHint}</Hint>}
      {allDug && !solved && (
        <>
          <p className="rounded-2xl bg-[#fdf9ef] p-3 text-center text-base font-black text-[#3d3a38]">{config.question}</p>
          <Hint>そうを タップして こたえよう</Hint>
        </>
      )}
      {solved && <DoneBanner text="せいかい！" />}
      {solved && (
        <button onClick={onDone} className="min-h-12 rounded-2xl bg-[#174d70] text-base font-black text-white shadow-[0_4px_0_#0e3450] active:translate-y-0.5">
          つぎへ すすむ
        </button>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------- export */

export function ScienceActivity({ activity, onDone }: { activity: ActivityConfig; onDone: () => void }) {
  const [nonce, setNonce] = useState(0)

  const body = (() => {
    switch (activity.kind) {
      case 'slider-scene':
        return <SliderActivity key={nonce} config={activity} onDone={onDone} />
      case 'pick-spot':
        return <PickSpotActivity key={nonce} config={activity} onDone={onDone} />
      case 'order-cards':
        return <OrderCardsActivity key={nonce} config={activity} onDone={onDone} />
      case 'place-targets':
        return <PlaceTargetsActivity key={nonce} config={activity} onDone={onDone} />
      case 'match-pairs':
        return <MatchPairsActivity key={nonce} config={activity} onDone={onDone} />
      case 'drag-path':
        return <DragPathActivity key={nonce} config={activity} onDone={onDone} />
      case 'dig-layers':
        return <DigLayersActivity key={nonce} config={activity} onDone={onDone} />
    }
  })()

  return (
    <div className="flex flex-col gap-3">
      {body}
      <button
        onClick={() => setNonce((n) => n + 1)}
        className="mx-auto flex min-h-10 items-center gap-1 rounded-full px-4 text-xs font-black text-[#8a8478]"
      >
        <RotateCcw className="size-3.5" aria-hidden="true" />
        もういちど
      </button>
    </div>
  )
}
