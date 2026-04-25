import Link from 'next/link'
import { ArrowRight, Bookmark, MapPin, Package } from 'lucide-react'
import type { PublicVendor } from '@/lib/types'

export default function VendorCard({
  vendor,
  saved = false,
  onSaveToggle,
}: {
  vendor: PublicVendor
  saved?: boolean
  onSaveToggle?: () => void
}) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_22px_55px_rgba(21,15,8,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(21,15,8,0.14)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img src={vendor.logo} alt={vendor.businessName} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        {onSaveToggle ? (
          <button
            type="button"
            onClick={onSaveToggle}
            className="absolute right-4 top-4 rounded-full border border-white/70 bg-white/85 p-2 text-stone-700 backdrop-blur transition hover:bg-white"
            aria-label={saved ? 'Remove vendor from saved list' : 'Save vendor'}
          >
            <Bookmark className={`h-4 w-4 ${saved ? 'fill-current text-orange-600' : ''}`} />
          </button>
        ) : null}
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-stone-950">{vendor.businessName}</p>
            <p className="mt-1 text-sm text-stone-500">{vendor.category}</p>
          </div>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
            {vendor.views} views
          </span>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-stone-600">{vendor.description}</p>
        <div className="flex flex-wrap gap-3 text-xs text-stone-500">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {vendor.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5" />
            {vendor.productCount} products
          </span>
        </div>
        <Link
          href={`/vendor/${vendor.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-900 transition hover:text-orange-600"
        >
          View storefront
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}
