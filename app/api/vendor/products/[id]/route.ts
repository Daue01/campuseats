import { NextRequest } from 'next/server'
import { getSession } from '@/lib/server/auth'
import { deleteProduct, getProductById, getVendorProfileByUserId, updateProduct } from '@/lib/server/db'
import { jsonError, jsonOk } from '@/lib/server/http'
import type { ProductPayload } from '@/lib/types'

async function getOwnedProduct(productId: string, userId: string) {
  const vendor = await getVendorProfileByUserId(userId)

  if (!vendor) {
    return { vendor: null, product: null }
  }

  const product = await getProductById(productId)

  if (!product || product.vendorId !== vendor.id) {
    return { vendor, product: null }
  }

  return { vendor, product }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session.authenticated || session.user?.role !== 'vendor') {
    return jsonError(401, 'Vendor authentication required.')
  }

  const owned = await getOwnedProduct(params.id, session.user.id)

  if (!owned.product) {
    return jsonError(404, 'Product not found.')
  }

  const payload = (await request.json()) as Partial<ProductPayload>
  const product = await updateProduct(params.id, payload)

  if (!product) {
    return jsonError(404, 'Product not found.')
  }

  return jsonOk(product)
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session.authenticated || session.user?.role !== 'vendor') {
    return jsonError(401, 'Vendor authentication required.')
  }

  const owned = await getOwnedProduct(params.id, session.user.id)

  if (!owned.product) {
    return jsonError(404, 'Product not found.')
  }

  await deleteProduct(params.id)
  return jsonOk({ id: params.id })
}
