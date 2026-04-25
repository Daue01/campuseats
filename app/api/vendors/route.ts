import { NextRequest } from 'next/server'
import { listPublicVendors } from '@/lib/server/db'
import { jsonOk } from '@/lib/server/http'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') ?? undefined
  const category = searchParams.get('category') ?? undefined
  const withProductsOnly = searchParams.get('withProductsOnly') !== 'false'

  const vendors = await listPublicVendors({
    query,
    category,
    withProductsOnly,
  })

  return jsonOk(vendors)
}
