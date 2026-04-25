import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Mail, MapPin, Package, Phone } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import ProductCard from '@/components/ui/ProductCard'
import { getPublicVendor, incrementVendorViews, listPublicProducts } from '@/lib/server/db'

export const dynamic = 'force-dynamic'

export default async function PublicVendorPage({ params }: { params: { id: string } }) {
  await incrementVendorViews(params.id)
  const vendor = await getPublicVendor(params.id)

  if (!vendor) {
    notFound()
  }

  const products = await listPublicProducts({ vendorId: params.id })

  return (
    <div className="section-shell space-y-8 py-12">
      <Link href="/vendors" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-orange-600">
        <ArrowLeft className="h-4 w-4" />
        Back to vendors
      </Link>

      <section className="overflow-hidden rounded-[32px] bg-[#17120d] text-white shadow-[0_30px_90px_rgba(23,18,13,0.22)]">
        <div className="grid gap-8 p-6 lg:grid-cols-[360px,1fr] lg:p-8">
          <img src={vendor.logo} alt={vendor.businessName} className="h-72 w-full rounded-[28px] object-cover" />
          <div className="flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-200">
                {vendor.category}
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{vendor.businessName}</h1>
                <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">{vendor.description}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[24px] bg-white/8 p-4">
                <p className="text-sm text-stone-300">Products</p>
                <p className="mt-2 text-2xl font-black">{vendor.productCount}</p>
              </div>
              <div className="rounded-[24px] bg-white/8 p-4">
                <p className="text-sm text-stone-300">Views</p>
                <p className="mt-2 text-2xl font-black">{vendor.views}</p>
              </div>
              <div className="rounded-[24px] bg-white/8 p-4">
                <p className="text-sm text-stone-300">Location</p>
                <p className="mt-2 text-sm font-semibold">{vendor.location}</p>
              </div>
              <div className="rounded-[24px] bg-white/8 p-4">
                <p className="text-sm text-stone-300">Owner</p>
                <p className="mt-2 text-sm font-semibold">{vendor.ownerName}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr,320px]">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Products</p>
            <h2 className="mt-2 text-3xl font-black text-stone-950">What this vendor is selling right now</h2>
          </div>
          {products.length === 0 ? (
            <EmptyState
              title="No products uploaded yet"
              description="This storefront is live, but products have not been published yet."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        <aside className="surface-card h-fit p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Store details</p>
          <div className="mt-5 space-y-4 text-sm text-stone-600">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-orange-500" />
              <span>{vendor.location}</span>
            </div>
            <div className="flex items-start gap-3">
              <Package className="mt-0.5 h-4 w-4 text-orange-500" />
              <span>{vendor.productCount} listed products</span>
            </div>
            <a href={`mailto:${vendor.email}`} className="flex items-start gap-3 transition hover:text-orange-600">
              <Mail className="mt-0.5 h-4 w-4 text-orange-500" />
              <span>{vendor.email}</span>
            </a>
            <a href={`tel:${vendor.phone}`} className="flex items-start gap-3 transition hover:text-orange-600">
              <Phone className="mt-0.5 h-4 w-4 text-orange-500" />
              <span>{vendor.phone}</span>
            </a>
          </div>
        </aside>
      </section>
    </div>
  )
}
