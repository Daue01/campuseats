import Link from 'next/link'

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-orange-200 bg-[#fffaf5] px-6 py-12 text-center">
      <p className="text-lg font-bold text-stone-900">{title}</p>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-stone-600">{description}</p>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}
