'use client'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Check, Hand, RotateCcw } from 'lucide-react'
import type { ActivityConfig } from '@/lib/scienceStages'
import { ObjIcon } from '@/components/ScienceIcons'

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

function Board({
  sky,
  ground,
  children,
  boardRef,
  onPointerMove,
  onPointerUp,
}: {
  sky: string
  ground?: string
  children: ReactNode
  boardRef?: React.Ref<HTMLDivElement>
  onPointerMove?: (e: React.PointerEvent) => void
  onPointerUp?: (e: React.PointerEvent) => void
}) {
  return (
    <div
      ref={boardRef}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border-4 border-white shadow-[0_6px_0_rgba(14,75,105,0.25)]"
      style={{ background: sky, touchAction: 'none' }}
    >
      {ground && <div className="absolute inset-x-0 bottom-0 h-[30%]" style={{ background: ground }} />}
      {children}
    </div>
  )
}

function Hint({ children }: { children: ReactNode }) {
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

function NextButton({ onDone }: { onDone: () => void }) {
  return (
    <button onClick={onDone} className="min-h-12 rounded-2xl bg-[#174d70] text-base font-black text-white shadow-[0_4px_0_#0e3450] active:translate-y-0.5">
      つぎへ すすむ
    </button>
  )
}

/* ---------------------------------------------------------- drag machinery */
// A viewport-wide pointer drag: a floating ghost follows the finger, and on
// release we hit-test whatever `[data-drop]` element sits under the pointer.
// This lets objects be dragged out of a tray and onto targets anywhere.
function useDragDrop() {
  const [ghost, setGhost] = useState<{ id: string; render: ReactNode; x: number; y: number } | null>(null)
  const ghostRef = useRef(ghost)
  ghostRef.current = ghost
  const onDropRef = useRef<(dragId: string, dropId: string | null) => void>(() => {})

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (ghostRef.current) setGhost((g) => (g ? { ...g, x: e.clientX, y: e.clientY } : g))
    }
    const up = (e: PointerEvent) => {
      const g = ghostRef.current
      if (!g) return
      const el = document.elementFromPoint(e.clientX, e.clientY)
      const drop = el ? el.closest('[data-drop]') : null
      onDropRef.current(g.id, drop ? drop.getAttribute('data-drop') : null)
      setGhost(null)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [])

  const start = (id: string, render: ReactNode, onDrop: (dragId: string, dropId: string | null) => void, e: React.PointerEvent) => {
    e.preventDefault()
    onDropRef.current = onDrop
    setGhost({ id, render, x: e.clientX, y: e.clientY })
  }

  const ghostNode = ghost ? (
    <div style={{ position: 'fixed', left: ghost.x, top: ghost.y, transform: 'translate(-50%,-50%) scale(1.12)', pointerEvents: 'none', zIndex: 60 }}>
      {ghost.render}
    </div>
  ) : null

  return { start, ghostNode, draggingId: ghost ? ghost.id : null }
}

// Shared object chip: an icon on a chunky card, optionally with a caption.
function Chip({ emoji, label, size = 40, caption }: { emoji: string; label: string; size?: number; caption?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className="flex items-center justify-center rounded-2xl border-2 border-[#0e4b69] bg-[#fdf9ef] shadow-[0_3px_0_#174d70]"
        style={{ width: size + 14, height: size + 14 }}
      >
        <ObjIcon emoji={emoji} label={label} size={size} />
      </div>
      {caption && <span className="px-1 text-[10px] font-black leading-tight text-[#3d3a38]">{label}</span>}
    </div>
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
      </Board>
    )
  }

  if (scene === 'moon-phase') {
    const angle = (value / steps) * Math.PI * 2
    const mx = 50 + 33 * Math.sin(angle)
    const my = 50 - 33 * Math.cos(angle)
    const lit = Math.round(((1 - Math.cos(angle)) / 2) * 100)
    return (
      <Board sky="linear-gradient(#1c2b52,#33406e)">
        <span className="absolute left-[6%] top-1/2 size-9 -translate-y-1/2">
          <ObjIcon emoji="☀️" label="太陽" size={36} />
        </span>
        <div className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4E8FC5]" style={{ boxShadow: 'inset -4px -4px 0 rgba(0,0,0,0.15)' }} />
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
        <span className="absolute size-10 -translate-x-1/2 -translate-y-1/2" style={{ left: `${mx}%`, top: `${my}%` }}>
          <ObjIcon emoji="🌙" label="月" size={40} />
        </span>
        {[18, 34, 58, 76, 88].map((x, i) => (
          <span key={x} className="absolute text-xs text-white/80" style={{ left: `${x}%`, top: `${14 + (i % 3) * 9}%` }}>
            ✦
          </span>
        ))}
        <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[#174d70]">
          {['よる 7じ', 'よる 8じ', 'よる 9じ', 'よる 10じ', 'よる 11じ'][value] ?? ''}
        </span>
      </Board>
    )
  }

  // Daytime scenes share one sun arc.
  const sx = 10 + t * 78
  const sy = 62 - Math.sin(t * Math.PI) * 46
  const sunHeight = Math.sin(t * Math.PI)
  const Sun = (
    <span className="absolute size-12 -translate-x-1/2 -translate-y-1/2 transition-all duration-200" style={{ left: `${sx}%`, top: `${sy}%` }}>
      <ObjIcon emoji="☀️" label="太陽" size={48} />
    </span>
  )

  if (scene === 'sunny-spot') {
    const patch = 78 - t * 56
    const inSun = Math.abs(patch - 50) < 11
    return (
      <Board sky="linear-gradient(#bfe6f5,#eaf6fb)" ground="linear-gradient(#9ecb84,#7fb268)">
        {Sun}
        <div className="absolute bottom-[6%] h-[16%] w-[22%] -translate-x-1/2 rounded-[50%] bg-[#fff3b0] opacity-80 transition-all duration-200" style={{ left: `${patch}%` }} />
        <span className="absolute bottom-[10%] left-1/2 size-9 -translate-x-1/2">
          <ObjIcon emoji="🦵" label="こども" size={36} />
        </span>
        <span className={`absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-black text-white ${inSun ? 'bg-[#3d8a3d]' : 'bg-[#7a8b99]'}`}>
          {inSun ? 'ひなた！ あたたかい' : 'いまは 日かげ'}
        </span>
        <span className="absolute bottom-[8%] right-[8%] size-10">
          <ObjIcon emoji="🌳" label="木" size={40} />
        </span>
      </Board>
    )
  }

  if (scene === 'sun-sky') {
    const labels = ['あさ（東）', 'ごぜん', 'おひる（真上）', 'ごご（西より）', 'ゆうがた（西）']
    return (
      <Board sky="linear-gradient(#bfe6f5,#fdeccd)" ground="linear-gradient(#9ecb84,#7fb268)">
        {Sun}
        <span className="absolute bottom-[8%] left-[6%] rounded-full bg-white/90 px-2 py-0.5 text-xs font-black text-[#174d70]">東</span>
        <span className="absolute bottom-[8%] right-[6%] rounded-full bg-white/90 px-2 py-0.5 text-xs font-black text-[#174d70]">西</span>
        <span className="absolute bottom-[6%] left-1/2 size-10 -translate-x-1/2">
          <ObjIcon emoji="🏘️" label="学校" size={40} />
        </span>
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
      {Sun}
      <div
        className="absolute bottom-[13%] h-3 rounded-full bg-[#5d6f5d]/70 transition-all duration-200"
        style={{ width: `${shadowLen}%`, left: toLeft ? undefined : '50%', right: toLeft ? '50%' : undefined }}
      />
      <span className="absolute bottom-[13%] left-1/2 size-10 -translate-x-1/2">
        <ObjIcon emoji="🦵" label="人" size={40} />
      </span>
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[#174d70]">
        かげの ながさ: {shadowLen < 20 ? 'みじかい' : shadowLen < 42 ? 'ふつう' : 'とても ながい'}
      </span>
    </Board>
  )
}

function SliderActivity({ config, onDone }: { config: Extract<ActivityConfig, { kind: 'slider-scene' }>; onDone: () => void }) {
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
      {reached && <NextButton onDone={onDone} />}
    </div>
  )
}

/* -------------------------------------------------------------- pick a spot */
// A find/choose activity (tap the right things) — the spec's "さがそう / えらぼう".

const PICK_SCENES: Record<string, { sky: string; ground: string; extras: { emoji: string; label: string; x: number }[] }> = {
  'shadow-sun': { sky: 'linear-gradient(#bfe6f5,#fdeccd)', ground: 'linear-gradient(#9ecb84,#7fb268)', extras: [] },
  'park-bugs': { sky: 'linear-gradient(#d9f0c4,#eaf7dd)', ground: 'linear-gradient(#8fbf6b,#6fa054)', extras: [{ emoji: '🌳', label: '木', x: 8 }] },
  'season-park': { sky: 'linear-gradient(#cfeafb,#fdf3d6)', ground: 'linear-gradient(#9ecb84,#7fb268)', extras: [{ emoji: '🌳', label: '木', x: 8 }] },
}

function PickSpotActivity({ config, onDone }: { config: Extract<ActivityConfig, { kind: 'pick-spot' }>; onDone: () => void }) {
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
            <span className="absolute bottom-[16%] left-[44%] size-10">
              <ObjIcon emoji="🦵" label="人" size={40} />
            </span>
            <div className="absolute bottom-[15%] left-[52%] h-3 w-[26%] rounded-full bg-[#5d6f5d]/70" />
            <span className="absolute bottom-[9%] right-[10%] rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-black text-[#174d70]">
              かげは こっち（東）
            </span>
          </>
        )}
        {scene.extras.map((e) => (
          <span key={e.emoji} className="absolute bottom-[6%] size-9" style={{ left: `${e.x}%` }}>
            <ObjIcon emoji={e.emoji} label={e.label} size={36} />
          </span>
        ))}
        {config.spots.map((spot) => {
          const isFound = found.includes(spot.id)
          return (
            <button
              key={spot.id}
              onClick={() => tap(spot.id, spot.correct)}
              className={`absolute flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 transition ${
                isFound ? 'border-[#3d8a3d] bg-white shadow-lg' : 'border-white/70 bg-white/55'
              } ${missed === spot.id ? 'animate-node-flash border-[#e2596b]' : ''}`}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              aria-label={spot.label}
            >
              <ObjIcon emoji={spot.emoji} label={spot.label} size={34} />
              {isFound && (
                <span className="absolute -bottom-6 whitespace-nowrap rounded-full bg-[#3d8a3d] px-2 py-0.5 text-[10px] font-black text-white">{spot.label}</span>
              )}
            </button>
          )
        })}
      </Board>
      {done ? <DoneBanner text="ぜんぶ 見つけた！" /> : <Hint>{config.goalHint}（あと {config.needed - found.length}）</Hint>}
      {done && <NextButton onDone={onDone} />}
    </div>
  )
}

/* ------------------------------------------------------------- order cards */
// Drag the cards up into the numbered slots, in order.

const CARD_BORDER = ['#FF9040', '#4EC5C1', '#F7C94B', '#9B72CF', '#5FB85F']

function OrderCardsActivity({ config, onDone }: { config: Extract<ActivityConfig, { kind: 'order-cards' }>; onDone: () => void }) {
  const shuffled = useMemo(() => scramble(config.cards), [config.cards])
  const [placed, setPlaced] = useState<string[]>([])
  const [wrong, setWrong] = useState<string | null>(null)
  const { start, ghostNode, draggingId } = useDragDrop()
  const done = placed.length === config.cards.length

  const onDrop = (cardId: string, dropId: string | null) => {
    if (done || placed.includes(cardId)) return
    const nextExpected = config.cards[placed.length]
    if (dropId === 'slots' && nextExpected.id === cardId) {
      setPlaced((p) => [...p, cardId])
    } else {
      setWrong(cardId)
      setTimeout(() => setWrong(null), 500)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div data-drop="slots" className="flex min-h-28 flex-wrap items-center justify-center gap-2 rounded-3xl border-4 border-dashed border-[#b8d8e6] bg-[#f2fafd] p-3">
        {config.cards.map((card, i) => {
          const filled = placed[i]
          const data = config.cards.find((c) => c.id === filled)
          return (
            <div
              key={card.id}
              className="flex size-[70px] flex-col items-center justify-center rounded-2xl border-2 text-center"
              style={{ borderColor: data ? CARD_BORDER[i % CARD_BORDER.length] : '#cfe0e8', background: data ? '#fff' : 'transparent' }}
            >
              {data ? (
                <>
                  <ObjIcon emoji={data.emoji} label={data.label} size={34} />
                  <span className="px-0.5 text-[9px] font-black leading-tight text-[#3d3a38]">{data.label}</span>
                </>
              ) : (
                <span className="text-sm font-black text-[#a9bcc6]">{i + 1}</span>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {shuffled.map((card) => {
          const used = placed.includes(card.id)
          if (used) return <div key={card.id} className="size-[70px] rounded-2xl bg-[#eef4f7]" />
          return (
            <button
              key={card.id}
              onPointerDown={(e) => start(card.id, <Chip emoji={card.emoji} label={card.label} size={34} caption />, onDrop, e)}
              className={`touch-none rounded-2xl ${wrong === card.id ? 'animate-node-flash' : ''} ${draggingId === card.id ? 'opacity-30' : ''}`}
              aria-label={card.label}
            >
              <Chip emoji={card.emoji} label={card.label} size={34} caption />
            </button>
          )
        })}
      </div>

      {done ? <DoneBanner text="じゅんばん せいかい！" /> : <Hint>{config.goalHint}</Hint>}
      {done && <NextButton onDone={onDone} />}
      {ghostNode}
    </div>
  )
}

/* ----------------------------------------------------------- place targets */

const BOARD_LOOK: Record<string, { sky: string; ground?: string; extras?: { emoji: string; label: string; x: number; y: number }[] }> = {
  sky: { sky: 'linear-gradient(#1c2b52,#3d4f86)' },
  volcano: { sky: 'linear-gradient(#8fb6d6,#d8c39b)', ground: 'linear-gradient(#8b6b45,#6d5335)' },
  pond: { sky: 'linear-gradient(#aee0ef,#6bb8d4)', ground: 'linear-gradient(#d8cba0,#bfae82)' },
  forest: { sky: 'linear-gradient(#d9f0c4,#eaf7dd)', ground: 'linear-gradient(#8fbf6b,#6fa054)', extras: [{ emoji: '🌳', label: '木', x: 10, y: 28 }] },
  plant: { sky: 'linear-gradient(#cfeafb,#eaf7dd)', ground: 'linear-gradient(#b08050,#8b6b45)', extras: [{ emoji: '🌱', label: '芽', x: 50, y: 54 }] },
  body: { sky: 'linear-gradient(#fdeef0,#fbe0e4)', extras: [{ emoji: '🦵', label: '体', x: 82, y: 60 }] },
}

function PlaceTargetsActivity({ config, onDone }: { config: Extract<ActivityConfig, { kind: 'place-targets' }>; onDone: () => void }) {
  const look = BOARD_LOOK[config.board] ?? { sky: 'linear-gradient(#e8f3f8,#fff)' }
  const tray = useMemo(() => scramble(config.tokens), [config.tokens])
  const [placed, setPlaced] = useState<Record<string, string>>({})
  const [wrong, setWrong] = useState<string | null>(null)
  const { start, ghostNode, draggingId } = useDragDrop()
  const done = Object.keys(placed).length === config.tokens.length

  const onDrop = (tokenId: string, dropId: string | null) => {
    const token = config.tokens.find((t) => t.id === tokenId)
    if (!token || Object.values(placed).includes(tokenId)) return
    if (dropId === token.slotId && !placed[dropId]) {
      setPlaced((p) => ({ ...p, [token.slotId]: token.id }))
    } else if (dropId) {
      setWrong(dropId)
      setTimeout(() => setWrong(null), 500)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Board sky={look.sky} ground={look.ground}>
        {look.extras?.map((e) => (
          <span key={e.emoji + e.x} className="absolute size-10 -translate-x-1/2 -translate-y-1/2" style={{ left: `${e.x}%`, top: `${e.y}%` }}>
            <ObjIcon emoji={e.emoji} label={e.label} size={40} />
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
                style={{ left: `${slot.x}%`, top: `${slot.y}%`, width: `${Math.hypot(dx, dy)}%`, transform: `rotate(${(Math.atan2(dy, dx) * 180) / Math.PI}deg)` }}
              />
            )
          })}
        {config.slots.map((slot) => {
          const tokenId = placed[slot.id]
          const token = config.tokens.find((t) => t.id === tokenId)
          return (
            <div
              key={slot.id}
              data-drop={slot.id}
              className={`absolute flex size-[62px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl border-2 transition ${
                token ? 'border-[#3d8a3d] bg-white shadow-md' : 'border-dashed border-white bg-white/45'
              } ${wrong === slot.id ? 'animate-node-flash border-[#e2596b]' : ''}`}
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            >
              {token ? <ObjIcon emoji={token.emoji} label={token.label} size={38} /> : <span className="px-1 text-center text-[9px] font-black leading-tight text-[#174d70]">{slot.label}</span>}
            </div>
          )
        })}
      </Board>

      <div className="flex flex-wrap justify-center gap-2">
        {tray.map((token) => {
          const used = Object.values(placed).includes(token.id)
          if (used) return <div key={token.id} className="size-[54px] rounded-2xl bg-[#eef4f7]" />
          return (
            <button
              key={token.id}
              onPointerDown={(e) => start(token.id, <Chip emoji={token.emoji} label={token.label} size={38} caption />, onDrop, e)}
              className={`touch-none rounded-2xl ${draggingId === token.id ? 'opacity-30' : ''}`}
              aria-label={token.label}
            >
              <Chip emoji={token.emoji} label={token.label} size={38} caption />
            </button>
          )
        })}
      </div>

      {done ? <DoneBanner text="ぜんぶ おけた！" /> : <Hint>{config.goalHint}</Hint>}
      {done && <NextButton onDone={onDone} />}
      {ghostNode}
    </div>
  )
}

/* -------------------------------------------------------------- match pairs */
// Drag each left object onto the right one it goes with.

function MatchPairsActivity({ config, onDone }: { config: Extract<ActivityConfig, { kind: 'match-pairs' }>; onDone: () => void }) {
  const rights = useMemo(() => scramble(config.pairs), [config.pairs])
  const [matched, setMatched] = useState<string[]>([])
  const [wrong, setWrong] = useState<string | null>(null)
  const { start, ghostNode, draggingId } = useDragDrop()
  const done = matched.length === config.pairs.length

  const onDrop = (leftId: string, dropId: string | null) => {
    if (matched.includes(leftId)) return
    if (dropId === leftId) {
      setMatched((m) => [...m, leftId])
    } else if (dropId) {
      setWrong(dropId)
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
                disabled={ok}
                onPointerDown={(e) => !ok && start(pair.id, <Chip emoji={pair.left.emoji} label={pair.left.label} size={30} />, onDrop, e)}
                className={`flex min-h-16 touch-none items-center gap-2 rounded-2xl border-2 px-2 text-left transition ${
                  ok ? 'border-[#3d8a3d] bg-[#eaf7ea] opacity-70' : 'border-[#0e4b69] bg-white shadow-[0_3px_0_#174d70]'
                } ${draggingId === pair.id ? 'opacity-30' : ''}`}
                style={{ borderColor: ok ? undefined : CARD_BORDER[i % CARD_BORDER.length] }}
              >
                <ObjIcon emoji={pair.left.emoji} label={pair.left.label} size={30} />
                <span className="flex-1 text-xs font-black leading-tight text-[#3d3a38]">{pair.left.label}</span>
              </button>
            )
          })}
        </div>
        <div className="flex flex-col gap-2">
          {rights.map((pair) => {
            const ok = matched.includes(pair.id)
            return (
              <div
                key={pair.id}
                data-drop={ok ? undefined : pair.id}
                className={`flex min-h-16 items-center gap-2 rounded-2xl border-2 bg-white px-2 text-left transition ${
                  ok ? 'border-[#3d8a3d] bg-[#eaf7ea] opacity-70' : 'border-dashed border-[#0e4b69] shadow-[0_3px_0_#174d70]'
                } ${wrong === pair.id ? 'animate-node-flash border-[#e2596b]' : ''}`}
              >
                <ObjIcon emoji={pair.right.emoji} label={pair.right.label} size={30} />
                <span className="flex-1 text-xs font-black leading-tight text-[#3d3a38]">{pair.right.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {done ? <DoneBanner text="ぜんぶ そろった！" /> : <Hint>{config.goalHint}</Hint>}
      {done && <NextButton onDone={onDone} />}
      {ghostNode}
    </div>
  )
}

/* ----------------------------------------------------------------- drag path */
// Physically drag the object from stop to stop, in order.

const PATH_LOOK: Record<string, { sky: string; ground?: string }> = {
  map: { sky: 'linear-gradient(#cfeafb,#eaf6fb)', ground: 'linear-gradient(#a7c98d,#8fbf6b)' },
  garden: { sky: 'linear-gradient(#d9f0c4,#eaf7dd)', ground: 'linear-gradient(#b08050,#8b6b45)' },
  flower: { sky: 'linear-gradient(#e7f7ff,#fdf3d6)', ground: 'linear-gradient(#8fbf6b,#6fa054)' },
  'body-digest': { sky: 'linear-gradient(#fdeef0,#fbe0e4)' },
  'body-air': { sky: 'linear-gradient(#eaf6fb,#dcefff)' },
  'body-blood': { sky: 'linear-gradient(#fdeef0,#ffe4e8)' },
}

function DragPathActivity({ config, onDone }: { config: Extract<ActivityConfig, { kind: 'drag-path' }>; onDone: () => void }) {
  const look = PATH_LOOK[config.board] ?? { sky: 'linear-gradient(#e8f3f8,#fff)' }
  const [at, setAt] = useState(-1)
  const [wrong, setWrong] = useState<string | null>(null)
  const { start, ghostNode, draggingId } = useDragDrop()
  const done = at === config.stops.length - 1
  const pos = at < 0 ? { x: 50, y: 90 } : config.stops[at]

  const onDrop = (_id: string, dropId: string | null) => {
    if (done) return
    const nextStop = config.stops[at + 1]
    if (dropId === nextStop.id) {
      setAt(at + 1)
    } else if (dropId) {
      setWrong(dropId)
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
              style={{ left: `${stop.x}%`, top: `${stop.y}%`, width: `${Math.hypot(dx, dy)}%`, transform: `rotate(${(Math.atan2(dy, dx) * 180) / Math.PI}deg)` }}
            />
          )
        })}
        {config.stops.map((stop, i) => {
          const visited = at >= i
          const isNext = i === at + 1
          return (
            <div
              key={stop.id}
              data-drop={isNext ? stop.id : undefined}
              className={`absolute flex size-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 transition ${
                visited ? 'border-[#3d8a3d] bg-white shadow-md' : 'border-white bg-white/60'
              } ${wrong === stop.id ? 'animate-node-flash border-[#e2596b]' : ''} ${isNext ? 'ring-4 ring-[#f7c94b]' : ''}`}
              style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
            >
              <ObjIcon emoji={stop.emoji} label={stop.label} size={34} />
              <span className="absolute -bottom-5 whitespace-nowrap rounded-full bg-[#174d70] px-2 py-0.5 text-[9px] font-black text-white">{stop.label}</span>
            </div>
          )
        })}
        {!done && (
          <button
            onPointerDown={(e) => start('mover', <Chip emoji={config.mover.emoji} label={config.mover.label} size={38} />, onDrop, e)}
            className={`absolute size-14 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full ${draggingId === 'mover' ? 'opacity-20' : 'animate-pulse'}`}
            style={{ left: `${pos.x}%`, top: `${(pos.y ?? 90) - 10}%` }}
            aria-label={config.mover.label}
          >
            <Chip emoji={config.mover.emoji} label={config.mover.label} size={38} />
          </button>
        )}
      </Board>

      {done ? <DoneBanner text="さいごまで はこべた！" /> : <Hint>{config.goalHint}</Hint>}
      {done && <NextButton onDone={onDone} />}
      {ghostNode}
    </div>
  )
}

/* ---------------------------------------------------------------- dig layers */

function DigLayersActivity({ config, onDone }: { config: Extract<ActivityConfig, { kind: 'dig-layers' }>; onDone: () => void }) {
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
    if (id === config.answerId) setAnswer(id)
    else {
      setWrong(id)
      setTimeout(() => setWrong(null), 500)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-3xl border-4 border-white shadow-[0_6px_0_rgba(14,75,105,0.25)]">
        <div className="flex h-9 items-center justify-center gap-2 bg-gradient-to-b from-[#cfe9f7] to-[#eaf6fb]">
          <ObjIcon emoji="🌿" label="草" size={22} />
          <ObjIcon emoji="🌳" label="木" size={22} />
        </div>
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
                  {layer.find && <ObjIcon emoji={layer.find} label="かせき" size={20} />}
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
      {solved && <NextButton onDone={onDone} />}
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
      <button onClick={() => setNonce((n) => n + 1)} className="mx-auto flex min-h-10 items-center gap-1 rounded-full px-4 text-xs font-black text-[#8a8478]">
        <RotateCcw className="size-3.5" aria-hidden="true" />
        もういちど
      </button>
    </div>
  )
}
