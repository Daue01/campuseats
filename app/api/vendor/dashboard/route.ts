import { getSession } from '@/lib/server/auth'
import { getVendorDashboardData, getVendorProfileByUserId, updateVendorProfile } from '@/lib/server/db'
import { jsonError, jsonOk } from '@/lib/server/http'
import type { VendorProfilePayload } from '@/lib/types'

export async function GET() {
  const session = await getSession()

  if (!session.authenticated || session.user?.role !== 'vendor') {
    return jsonError(401, 'Vendor authentication required.')
  }

  const dashboard = await getVendorDashboardData(session.user.id)

  if (!dashboard) {
    return jsonError(404, 'Vendor dashboard not found.')
  }

  return jsonOk(dashboard)
}

export async function PUT(request: Request) {
  const session = await getSession()

  if (!session.authenticated || session.user?.role !== 'vendor') {
    return jsonError(401, 'Vendor authentication required.')
  }

  const vendor = await getVendorProfileByUserId(session.user.id)

  if (!vendor) {
    return jsonError(404, 'Vendor profile not found.')
  }

  const payload = (await request.json()) as Partial<VendorProfilePayload>

  const updated = await updateVendorProfile(vendor.id, payload)

  if (!updated) {
    return jsonError(404, 'Vendor profile not found.')
  }

  return jsonOk(updated)
}
