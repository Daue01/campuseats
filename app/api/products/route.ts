import { NextRequest } from 'next/server'
import { listPublicProducts } from '@/lib/server/db'
import { jsonOk } from '@/lib/server/http'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const products = await listPublicProducts({
    vendorId: searchParams.get('vendorId') ?? undefined,
    query: searchParams.get('q') ?? undefined,
    category: searchParams.get('category') ?? undefined,
    onlyInStock: searchParams.get('onlyInStock') === 'true',
  })

  return jsonOk(products)
}
