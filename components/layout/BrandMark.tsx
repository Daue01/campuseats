import Link from 'next/link'

export default function BrandMark({ href = '/', compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href} className="inline-flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ff6b00,#ff8c33)] shadow-[0_12px_30px_rgba(255,107,0,0.28)]">
        <span className="text-lg font-black text-white">C</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className="bg-[linear-gradient(135deg,#151515,#ff6b00)] bg-clip-text text-xl font-black text-transparent">
          CampusEats
        </span>
        {compact ? null : <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">Campus marketplace</span>}
      </span>
    </Link>
  )
}
