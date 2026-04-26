import ExploreMarketplace from '@/components/marketing/ExploreMarketplace'
import { getSafeMarketplaceData } from '@/lib/server/runtime'

export const dynamic = 'force-dynamic'

export default async function ExplorePage() {
  const { vendors, products, error } = await getSafeMarketplaceData()

  return (
    <div className="section-shell py-12">
      {error ? (
        <div className="mb-6 rounded-[28px] border border-amber-200 bg-amber-50 px-6 py-5 text-sm leading-7 text-amber-900">
          Explore data is temporarily unavailable. Check your Supabase environment variables and Vercel server logs.
        </div>
      ) : null}
      <ExploreMarketplace vendors={vendors} products={products} />
    </div>
  )
}
