'use client'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { ArrowLeft, Lock, Sparkles, Check } from 'lucide-react'
import { useSave, refreshSave } from '@/lib/progress'
import { AVATAR_CATALOG, PART_TYPES, PART_TYPE_LABELS, DEFAULT_EQUIPPED, type PartType } from '@/lib/avatarParts'
import { AvatarPreview, type EquippedParts } from '@/components/AvatarPreview'
import { purchasePart, equipPart } from '@/app/actions/avatar'

export function AvatarEditor() {
  const { save } = useSave()
  const [tab, setTab] = useState<PartType>('faceShape')
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)

  const equipped: EquippedParts = { ...DEFAULT_EQUIPPED, ...(save.avatarEquipped ?? {}) }
  const ownedSet = new Set(save.avatarOwned)

  const isOwned = (partType: PartType, variantId: string, price: number) => price === 0 || ownedSet.has(`${partType}:${variantId}`)

  const showMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(null), 1800)
  }

  const onSelect = (partType: PartType, variantId: string, price: number) => {
    setPendingId(variantId)
    startTransition(async () => {
      try {
        if (!isOwned(partType, variantId, price)) {
          const res = await purchasePart(partType, variantId)
          if (!res.ok) {
            showMessage('コインが たりないよ')
            setPendingId(null)
            return
          }
        }
        await equipPart(partType, variantId)
        refreshSave()
      } finally {
        setPendingId(null)
      }
    })
  }

  return (
    <main className="min-h-screen bg-background px-5 py-6">
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1 text-sm font-bold" aria-label="もどる">
            <ArrowLeft className="size-4" /> もどる
          </Link>
          <span className="flex items-center gap-1 rounded-full border-2 border-[#0e4b69] bg-[#f7c94b] px-3 py-1 text-sm font-black text-[#3d3a38] shadow-[0_3px_0_#174d70]">
            <Sparkles className="size-4" /> {save.points}
          </span>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-3xl border-2 border-[#0e4b69] bg-[#fdf9ef] py-6 shadow-[0_4px_0_#174d70]">
          <AvatarPreview parts={equipped} size={140} />
          <h1 className="text-lg font-black text-[#3d3a38]">アバターを つくろう</h1>
        </div>

        {message && (
          <p className="rounded-full bg-[#174d70] px-4 py-2 text-center text-sm font-black text-white">{message}</p>
        )}

        <div className="flex flex-wrap gap-2 rounded-2xl bg-muted p-1">
          {PART_TYPES.map((pt) => (
            <button
              key={pt}
              onClick={() => setTab(pt)}
              className={`min-h-10 flex-1 rounded-xl px-2 text-xs font-bold sm:text-sm ${
                tab === pt ? 'bg-card text-foreground' : 'text-muted-foreground'
              }`}
            >
              {PART_TYPE_LABELS[pt]}
            </button>
          ))}
        </div>

        <section className="grid grid-cols-4 gap-3">
          {AVATAR_CATALOG[tab].map((variant) => {
            const owned = isOwned(tab, variant.id, variant.price)
            const isEquipped = equipped[tab] === variant.id
            const previewParts: EquippedParts = { ...equipped, [tab]: variant.id }
            const busy = isPending && pendingId === variant.id
            return (
              <button
                key={variant.id}
                onClick={() => onSelect(tab, variant.id, variant.price)}
                disabled={isPending}
                className={`relative flex flex-col items-center gap-1 rounded-2xl border-2 p-2 ${
                  isEquipped ? 'border-[#0e4b69] bg-[#fdf9ef]' : 'border-border bg-card'
                } disabled:opacity-60`}
              >
                <AvatarPreview parts={previewParts} size={56} className="pointer-events-none" />
                {isEquipped && (
                  <span className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-[#0e4b69] text-white">
                    <Check className="size-3" />
                  </span>
                )}
                {!owned && (
                  <span className="flex items-center gap-1 rounded-full bg-[#3d3a38]/80 px-2 py-0.5 text-[10px] font-bold text-white">
                    <Lock className="size-2.5" /> {variant.price}
                  </span>
                )}
                {busy && <span className="text-[10px] font-bold text-muted-foreground">…</span>}
              </button>
            )
          })}
        </section>
      </div>
    </main>
  )
}
