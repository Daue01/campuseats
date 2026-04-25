'use client'

import Link from 'next/link'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Bookmark, Search } from 'lucide-react'
import VendorCard from '@/components/ui/VendorCard'
import ProductCard from '@/components/ui/ProductCard'
import EmptyState from '@/components/ui/EmptyState'
import { GridCardSkeleton } from '@/components/ui/SkeletonLoader'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import { fetchJson } from '@/lib/api-client'
import { useToast } from '@/components/providers/ToastProvider'
import type { PublicProduct, PublicVendor, SessionUser } from '@/lib/types'

export default function StudentDashboard({ sessionUser }: { sessionUser: SessionUser }) {
  const { pushToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [vendors, setVendors] = useState<PublicVendor[]>([])
  const [products, setProducts] = useState<PublicProduct[]>([])
  const [savedVendorIds, setSavedVendorIds] = useState<string[]>([])
  const deferredQuery = useDeferredValue(query)

  useEffect(() => {
    let active = true

    Promise.all([
      fetchJson<PublicVendor[]>('/api/vendors?withProductsOnly=true'),
      fetchJson<PublicProduct[]>('/api/products'),
    ])
      .then(([vendorData, productData]) => {
        if (!active) return
        setVendors(vendorData)
        setProducts(productData)
      })
      .catch((error) => {
        if (!active) return
        pushToast({
          tone: 'error',
          title: 'Could not load marketplace',
          description: error instanceof Error ? error.message : 'Please refresh and try again.',
        })
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [pushToast])

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesCategory = category === 'all' || vendor.category.toLowerCase() === category.toLowerCase()
      const haystack = `${vendor.businessName} ${vendor.description} ${vendor.location} ${vendor.category}`.toLowerCase()
      const matchesQuery = haystack.includes(deferredQuery.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [category, deferredQuery, vendors])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === 'all' || product.category.toLowerCase() === category.toLowerCase()
      const haystack = `${product.title} ${product.description} ${product.vendorName} ${product.category}`.toLowerCase()
      const matchesQuery = haystack.includes(deferredQuery.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [category, deferredQuery, products])

  const savedVendors = filteredVendors.filter((vendor) => savedVendorIds.includes(vendor.id))

  function toggleSavedVendor(vendorId: string) {
    setSavedVendorIds((current) =>
      current.includes(vendorId) ? current.filter((id) => id !== vendorId) : [...current, vendorId],
    )

    pushToast({
      tone: 'success',
      title: savedVendorIds.includes(vendorId) ? 'Vendor removed' : 'Vendor saved',
      description: 'Your quick access list has been updated.',
    })
  }

  return (
    <div className="section-shell space-y-10 py-12">
      <section className="surface-card overflow-hidden p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-600">Student Dashboard</p>
            <h1 className="text-4xl font-black text-stone-950">
              Welcome back, {sessionUser.name.split(' ')[0]}.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-stone-600">
              Discover live campus vendors, search across products, and keep your favorite storefronts close.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['Active vendors', String(vendors.length)],
              ['Products live', String(products.length)],
              ['Saved vendors', String(savedVendorIds.length)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[24px] border border-stone-200 bg-white px-5 py-5">
                <p className="text-3xl font-black text-stone-950">{value}</p>
                <p className="mt-2 text-sm text-stone-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="surface-card flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="auth-input pl-11"
              placeholder="Search vendors, products, categories..."
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory('all')}
              className={`rounded-full px-4 py-2 text-sm font-medium ${category === 'all' ? 'bg-orange-500 text-white' : 'bg-white text-stone-600'}`}
            >
              All
            </button>
            {PRODUCT_CATEGORIES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.label)}
                className={`rounded-full px-4 py-2 text-sm font-medium ${category === item.label ? 'bg-orange-500 text-white' : 'bg-white text-stone-600'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {savedVendors.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-orange-600" />
            <h2 className="text-xl font-bold text-stone-950">Saved vendors</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {savedVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                saved
                onSaveToggle={() => toggleSavedVendor(vendor.id)}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-600">Vendors</p>
            <h2 className="mt-2 text-3xl font-black text-stone-950">Campus storefronts with live products</h2>
          </div>
          <Link href="/vendors" className="text-sm font-semibold text-stone-700 transition hover:text-orange-600">
            View all vendors
          </Link>
        </div>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <GridCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredVendors.length === 0 ? (
          <EmptyState
            title="No matching vendors found"
            description="Try a different search term or switch categories to explore more campus sellers."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                saved={savedVendorIds.includes(vendor.id)}
                onSaveToggle={() => toggleSavedVendor(vendor.id)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-600">Products</p>
          <h2 className="mt-2 text-3xl font-black text-stone-950">Product feed</h2>
        </div>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <GridCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            title="No products match your search"
            description="Adjust your filters to discover more products from live campus vendors."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
