import { Globe2 } from 'lucide-react'
import type { RealWorld } from '@/lib/realWorld'

// "せかいで やくだってる！" section shown after わかったこと. Text-first so it needs
// no risky third-party media; `image` is an optional slot for a licensed image or
// GIF you add to /public yourself.
export function RealWorldCard({ data }: { data: RealWorld }) {
  return (
    <section className="flex flex-col gap-3 rounded-3xl border-4 border-[#4E8FC5] bg-gradient-to-b from-[#eef6fc] to-[#dcecfa] p-5 shadow-[0_5px_0_#2f6fa3]">
      <div className="flex items-center gap-2 text-[#2f6fa3]">
        <Globe2 className="size-5" aria-hidden="true" />
        <p className="font-black">{data.title ?? 'せかいで やくだってる！'}</p>
      </div>
      {data.image && (
        <img src={data.image} alt="" className="w-full rounded-2xl border-2 border-white object-cover" loading="lazy" />
      )}
      <p className="text-sm font-bold leading-7 text-[#3d3a38]">{data.body}</p>
    </section>
  )
}
