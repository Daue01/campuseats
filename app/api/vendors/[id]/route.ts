import { NextRequest } from 'next/server'
import { getPublicVendor, incrementVendorViews, listPublicProducts } from '@/lib/server/db'
import { jsonError, jsonOk } from '@/lib/server/http'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const vendor = await getPublicVendor(params.id)

  if (!vendor) {
    return jsonError(404, 'Vendor not found.')
  }

  await incrementVendorViews(params.id)

  const { searchParams } = new URL(request.url)
  const products = await listPublicProducts({
    vendorId: params.id,
    category: searchParams.get('category') ?? undefined,
    query: searchParams.get('q') ?? undefined,
  })

  return jsonOk({
    vendor,
    products,
  })
}
