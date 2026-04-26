import type { AuthSession, PublicProduct, PublicVendor } from '@/lib/types'
import { getSession } from '@/lib/server/auth'
import { listPublicProducts, listPublicVendors } from '@/lib/server/db'

type MarketplaceDataResult = {
  vendors: PublicVendor[]
  products: PublicProduct[]
  error: string | null
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown server error.'
}

export async function getSafeSession(): Promise<AuthSession> {
  try {
    return await getSession()
  } catch (error) {
    console.error('Failed to resolve session during server render:', error)
    return { authenticated: false, user: null }
  }
}

export async function getSafeMarketplaceData(): Promise<MarketplaceDataResult> {
  try {
    const [vendors, products] = await Promise.all([listPublicVendors(), listPublicProducts({})])
    return { vendors, products, error: null }
  } catch (error) {
    console.error('Failed to load marketplace data during server render:', error)
    return {
      vendors: [],
      products: [],
      error: getErrorMessage(error),
    }
  }
}

export async function getSafeVendors() {
  try {
    return {
      vendors: await listPublicVendors(),
      error: null,
    }
  } catch (error) {
    console.error('Failed to load vendors during server render:', error)
    return {
      vendors: [] as PublicVendor[],
      error: getErrorMessage(error),
    }
  }
}
