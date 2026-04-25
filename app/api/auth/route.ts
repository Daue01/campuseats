import { getSession } from '@/lib/server/auth'
import { jsonOk } from '@/lib/server/http'

export async function GET() {
  return jsonOk(await getSession())
}
