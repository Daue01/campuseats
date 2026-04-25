import { NextRequest } from 'next/server'
import { DELETE as deleteProduct, PUT } from '@/app/api/vendor/products/[id]/route'

export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  return PUT(request, context)
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  return deleteProduct(request, context)
}
