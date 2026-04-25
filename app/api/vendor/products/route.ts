import { NextRequest } from 'next/server'
import { getSession } from '@/lib/server/auth'
import { createProduct, getVendorProfileByUserId } from '@/lib/server/db'
import { jsonError, jsonOk } from '@/lib/server/http'
import { createId } from '@/lib/server/security'
import type { Product, ProductPayload } from '@/lib/types'

function validateProduct(payload: ProductPayload) {
  if (!payload.title?.trim()) return 'Product title is required.'
  if (!payload.description?.trim()) return 'Product description is required.'
  if (!payload.category?.trim()) return 'Category is required.'
  if (!payload.image?.trim()) return 'Product image is required.'
  if (!Number.isFinite(payload.price) || payload.price <= 0) return 'Price must be greater than zero.'
  return null
}

export async function POST(request: NextRequest) {
  const session = await getSession()

  if (!session.authenticated || session.user?.role !== 'vendor') {
    return jsonError(401, 'Vendor authentication required.')
  }

  const vendor = await getVendorProfileByUserId(session.user.id)

  if (!vendor) {
    return jsonError(404, 'Vendor profile not found.')
  }

  const payload = (await request.json()) as ProductPayload
  const error = validateProduct(payload)

  if (error) {
    return jsonError(400, error)
  }

  const product: Product = {
    id: createId('product'),
    vendorId: vendor.id,
    title: payload.title.trim(),
    price: payload.price,
    image: payload.image,
    description: payload.description.trim(),
    category: payload.category.trim(),
    inStock: payload.inStock,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await createProduct(product)
  return jsonOk(product, 201)
}
