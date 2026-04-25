'use client'

import { useMemo, useState } from 'react'
import { Grid2X2, LayoutList, Search, SlidersHorizontal } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import ProductCard from '@/components/ui/ProductCard'
import VendorCard from '@/components/ui/VendorCard'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import type { PublicProduct, PublicVendor } from '@/lib/types'

type Props = {
  vendors: PublicVendor[]
  products: PublicProduct[]
}

type TabKey = 'all' | 'products' | 'vendors'
type ViewMode = 'grid' | 'list'

export default function ExploreMarketplace({ vendors, products }: Props) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [tab, setTab] = useState<TabKey>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const loweredQuery = query.trim().toLowerCase()

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesCategory = category === 'all' || vendor.category.toLowerCase() === category.toLowerCase()
      const haystack = `${vendor.businessName} ${vendor.description} ${vendor.location} ${vendor.category}`.toLowerCase()
      return matchesCategory && haystack.includes(loweredQuery)
    })
  }, [category, loweredQuery, vendors])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === 'all' || product.category.toLowerCase() === category.toLowerCase()
      const haystack = `${product.title} ${product.description} ${product.vendorName} ${product.category}`.toLowerCase()
      return matchesCategory && haystack.includes(loweredQuery)
    })
  }, [category, loweredQuery, products])

  const tabMeta = [
    { id: 'all' as const, label: `All (${filteredProducts.length + filteredVendors.length})` },
    { id: 'products' as const, label: `Dishes (${filteredProducts.length})` },
    { id: 'vendors' as const, label: `Vendors (${filteredVendors.length})` },
  ]

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[32px] bg-[#17120d] px-6 py-8 text-white shadow-[0_30px_90px_rgba(23,18,13,0.28)] sm:px-8 lg:px-10 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr] lg:items-end">
          <div className="space-y-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-200">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Explore
            </span>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
                Explore <span className="text-orange-400">campus food</span> and storefronts in one place.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-stone-300 sm:text-base">
                Search through live vendors and current listings with the same structure as the reference experience, but backed by your real app data.
              </p>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search meals, snacks, vendors, locations..."
                className="h-14 rounded-full border border-white/10 bg-white px-11 text-sm text-stone-900 placeholder:text-stone-400 focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-200/60"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => setCategory('all')} className={`chip ${category === 'all' ? 'chip-active' : ''}`}>
                All categories
              </button>
              {PRODUCT_CATEGORIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.label)}
                  className={`chip ${category === item.label ? 'chip-active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col gap-4 border-b border-stone-100 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex flex-wrap gap-1">
            {tabMeta.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  tab === item.id ? 'bg-orange-500 text-white shadow-[0_10px_24px_rgba(255,107,0,0.22)]' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-stone-500">
              {tab === 'vendors' ? filteredVendors.length : tab === 'products' ? filteredProducts.length : filteredProducts.length + filteredVendors.length}{' '}
              results
            </span>
            <div className="inline-flex rounded-full border border-stone-200 bg-stone-50 p-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex h-9 w-9 items-center justify-center rounded-full ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-stone-500'}`}
                aria-label="Grid view"
              >
                <Grid2X2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex h-9 w-9 items-center justify-center rounded-full ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-stone-500'}`}
                aria-label="List view"
              >
                <LayoutList className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 py-6 lg:px-8 lg:py-8">
          {(tab === 'all' || tab === 'products') && (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Dishes</p>
                <h2 className="mt-2 text-2xl font-black text-stone-950">What students can find right now</h2>
              </div>

              {filteredProducts.length === 0 ? (
                <EmptyState
                  title="No dishes yet"
                  description="Once vendors start publishing products, they will appear here instantly."
                  actionLabel="Create vendor account"
                  actionHref="/signup"
                />
              ) : viewMode === 'grid' ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <article key={product.id} className="flex flex-col gap-4 rounded-[24px] border border-stone-200 bg-stone-50/60 p-4 sm:flex-row sm:items-center">
                      <img src={product.image} alt={product.title} className="h-28 w-full rounded-[20px] object-cover sm:w-36" />
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-lg font-bold text-stone-950">{product.title}</p>
                            <p className="text-sm text-stone-500">{product.vendorName}</p>
                          </div>
                          <span className="text-base font-bold text-orange-600">
                            {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(product.price)}
                          </span>
                        </div>
                        <p className="text-sm leading-6 text-stone-600">{product.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {(tab === 'all' || tab === 'vendors') && (
            <div className={`${tab === 'all' ? 'mt-10 border-t border-stone-100 pt-10' : ''} space-y-5`}>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Vendors</p>
                <h2 className="mt-2 text-2xl font-black text-stone-950">Storefronts students can trust</h2>
              </div>

              {filteredVendors.length === 0 ? (
                <EmptyState
                  title="No vendors available yet"
                  description="The marketplace is starting clean, so this page will fill up as soon as real vendors sign up."
                  actionLabel="Create vendor account"
                  actionHref="/signup"
                />
              ) : viewMode === 'grid' ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredVendors.map((vendor) => (
                    <VendorCard key={vendor.id} vendor={vendor} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredVendors.map((vendor) => (
                    <article key={vendor.id} className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <img src={vendor.logo} alt={vendor.businessName} className="h-20 w-20 rounded-[20px] object-cover" />
                        <div className="flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-lg font-bold text-stone-950">{vendor.businessName}</p>
                              <p className="text-sm text-stone-500">{vendor.category}</p>
                            </div>
                            <span className="inline-flex w-fit rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                              {vendor.productCount} products
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-stone-600">{vendor.description}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
