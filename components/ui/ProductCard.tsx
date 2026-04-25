import Link from 'next/link'
import { ArrowRight, Store } from 'lucide-react'
import type { PublicProduct } from '@/lib/types'

function formatCurrency(price: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function ProductCard({ product }: { product: PublicProduct }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_18px_42px_rgba(21,15,8,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(21,15,8,0.14)]">
      <div className="aspect-[4/3] overflow-hidden bg-stone-100">
        <img src={product.image} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-stone-950">{product.title}</p>
            <p className="mt-1 text-sm text-stone-500">{product.category}</p>
          </div>
          <span className="text-base font-bold text-orange-600">{formatCurrency(product.price)}</span>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-stone-600">{product.description}</p>
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500">
            <Store className="h-3.5 w-3.5" />
            {product.vendorName}
          </span>
          <Link
            href={`/vendor/${product.vendorId}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-900 transition hover:text-orange-600"
          >
            Contact vendor
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}
