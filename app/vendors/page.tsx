import Link from 'next/link'
import { ArrowRight, Store } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import VendorCard from '@/components/ui/VendorCard'
import { listPublicVendors } from '@/lib/server/db'

export const dynamic = 'force-dynamic'

export default async function VendorsPage() {
  const vendors = await listPublicVendors()

  return (
    <div className="section-shell space-y-8 py-12">
      <section className="overflow-hidden rounded-[32px] bg-[#17120d] px-6 py-10 text-white shadow-[0_30px_90px_rgba(23,18,13,0.22)] sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-200">
              <Store className="h-3.5 w-3.5" />
              Vendors
            </div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Browse active campus vendors.</h1>
            <p className="max-w-2xl text-base leading-8 text-stone-300">
              This directory now starts empty on purpose, then fills with real merchants as they sign up. That makes testing the full vendor onboarding flow much cleaner.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/10 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-300">Directory snapshot</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[22px] bg-white/8 p-4">
                <p className="text-3xl font-black">{vendors.length}</p>
                <p className="mt-1 text-sm text-stone-300">Registered vendors</p>
              </div>
              <div className="rounded-[22px] bg-white/8 p-4">
                <p className="text-3xl font-black">{vendors.filter((vendor) => vendor.productCount > 0).length}</p>
                <p className="mt-1 text-sm text-stone-300">Storefronts with products</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {vendors.length === 0 ? (
        <EmptyState
          title="No vendors live yet"
          description="Create a vendor account and publish your first storefront to see it appear here."
          actionLabel="Create vendor account"
          actionHref="/signup"
        />
      ) : (
        <>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Directory</p>
              <h2 className="mt-2 text-3xl font-black text-stone-950">Storefronts open for discovery</h2>
            </div>
            <Link href="/explore" className="hidden items-center gap-2 text-sm font-semibold text-stone-700 transition hover:text-orange-600 md:inline-flex">
              Explore marketplace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {vendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
