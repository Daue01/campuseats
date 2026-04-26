import ExploreMarketplace from '@/components/marketing/ExploreMarketplace'
import { listPublicProducts, listPublicVendors } from '@/lib/server/db'

export const dynamic = 'force-dynamic'

export default async function ExplorePage() {
  const [vendors, products] = await Promise.all([listPublicVendors(), listPublicProducts({})])

  return (
    <div className="section-shell py-12">
      <ExploreMarketplace vendors={vendors} products={products} />
    </div>
  )
}
