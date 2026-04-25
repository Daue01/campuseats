import type { Database } from '@/lib/types'

export function createSeedDatabase(): Database {
  return {
    users: [],
    vendorProfiles: [],
    products: [],
  }
}
