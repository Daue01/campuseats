import type {
  Product,
  ProductPayload,
  PublicProduct,
  PublicVendor,
  SessionUser,
  UserRecord,
  UserRole,
  VendorDashboardData,
  VendorProfile,
  VendorProfilePayload,
} from '@/lib/types'
import { getSupabaseAdmin } from '@/lib/server/supabase'

type UserRow = {
  id: string
  role: UserRole
  name: string
  email: string
  password_hash: string
  campus: string | null
  phone: string | null
  saved_vendor_ids: string[] | null
  created_at: string
}

type VendorProfileRow = {
  id: string
  user_id: string
  business_name: string
  logo: string
  description: string
  location: string
  category: string
  phone: string
  views: number
  orders: number
  messages: number
  created_at: string
  updated_at: string
}

type ProductRow = {
  id: string
  vendor_id: string
  title: string
  price: number
  image: string
  description: string
  category: string
  in_stock: boolean
  created_at: string
  updated_at: string
}

function fail(message: string, error: unknown): never {
  const detail = error instanceof Error ? error.message : 'Unknown Supabase error.'
  throw new Error(`${message} ${detail}`)
}

function matchesQuery(query: string | undefined, values: Array<string | undefined>) {
  if (!query) {
    return true
  }

  const needle = query.trim().toLowerCase()

  if (!needle) {
    return true
  }

  return values.some((value) => value?.toLowerCase().includes(needle))
}

function mapUser(row: UserRow): UserRecord {
  return {
    id: row.id,
    role: row.role,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    campus: row.campus ?? undefined,
    phone: row.phone ?? undefined,
    savedVendorIds: row.saved_vendor_ids ?? [],
    createdAt: row.created_at,
  }
}

function mapVendorProfile(row: VendorProfileRow): VendorProfile {
  return {
    id: row.id,
    userId: row.user_id,
    businessName: row.business_name,
    logo: row.logo,
    description: row.description,
    location: row.location,
    category: row.category,
    phone: row.phone,
    views: row.views,
    orders: row.orders,
    messages: row.messages,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    vendorId: row.vendor_id,
    title: row.title,
    price: row.price,
    image: row.image,
    description: row.description,
    category: row.category,
    inStock: row.in_stock,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function serializeUser(user: UserRecord) {
  return {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email.trim().toLowerCase(),
    password_hash: user.passwordHash,
    campus: user.campus ?? null,
    phone: user.phone ?? null,
    saved_vendor_ids: user.savedVendorIds,
    created_at: user.createdAt,
  }
}

function serializeVendorProfile(profile: VendorProfile) {
  return {
    id: profile.id,
    user_id: profile.userId,
    business_name: profile.businessName,
    logo: profile.logo,
    description: profile.description,
    location: profile.location,
    category: profile.category,
    phone: profile.phone,
    views: profile.views,
    orders: profile.orders,
    messages: profile.messages,
    created_at: profile.createdAt,
    updated_at: profile.updatedAt,
  }
}

function serializeVendorProfileUpdate(updates: Partial<VendorProfilePayload> & { logo?: string }) {
  const next: Record<string, string> = {}

  if (updates.businessName !== undefined) next.business_name = updates.businessName
  if (updates.logo !== undefined) next.logo = updates.logo
  if (updates.description !== undefined) next.description = updates.description
  if (updates.location !== undefined) next.location = updates.location
  if (updates.category !== undefined) next.category = updates.category
  if (updates.phone !== undefined) next.phone = updates.phone

  return next
}

function serializeProduct(product: Product) {
  return {
    id: product.id,
    vendor_id: product.vendorId,
    title: product.title,
    price: product.price,
    image: product.image,
    description: product.description,
    category: product.category,
    in_stock: product.inStock,
    created_at: product.createdAt,
    updated_at: product.updatedAt,
  }
}

function serializeProductUpdate(updates: Partial<ProductPayload>) {
  const next: Record<string, string | number | boolean> = {}

  if (updates.title !== undefined) next.title = updates.title
  if (updates.price !== undefined) next.price = updates.price
  if (updates.image !== undefined) next.image = updates.image
  if (updates.description !== undefined) next.description = updates.description
  if (updates.category !== undefined) next.category = updates.category
  if (updates.inStock !== undefined) next.in_stock = updates.inStock

  return next
}

async function listUserRows() {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('users').select('*')

  if (error) {
    fail('Could not load users from Supabase.', error)
  }

  return (data ?? []) as UserRow[]
}

async function listVendorProfileRows() {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('vendor_profiles').select('*')

  if (error) {
    fail('Could not load vendor profiles from Supabase.', error)
  }

  return (data ?? []) as VendorProfileRow[]
}

async function listProductRows(filters?: { vendorId?: string; category?: string; onlyInStock?: boolean }) {
  const supabase = getSupabaseAdmin()
  let query = supabase.from('products').select('*')

  if (filters?.vendorId) {
    query = query.eq('vendor_id', filters.vendorId)
  }

  if (filters?.category && filters.category !== 'all') {
    query = query.ilike('category', filters.category)
  }

  if (filters?.onlyInStock) {
    query = query.eq('in_stock', true)
  }

  const { data, error } = await query

  if (error) {
    fail('Could not load products from Supabase.', error)
  }

  return (data ?? []) as ProductRow[]
}

function buildPublicVendor(vendor: VendorProfile, users: UserRecord[], products: Product[]): PublicVendor {
  const owner = users.find((user) => user.id === vendor.userId)

  return {
    id: vendor.id,
    userId: vendor.userId,
    businessName: vendor.businessName,
    ownerName: owner?.name ?? 'Campus Vendor',
    email: owner?.email ?? '',
    phone: vendor.phone,
    logo: vendor.logo,
    description: vendor.description,
    location: vendor.location,
    category: vendor.category,
    productCount: products.filter((product) => product.vendorId === vendor.id).length,
    views: vendor.views,
  }
}

export async function findUserByEmail(email: string) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('users').select('*').eq('email', email.trim().toLowerCase()).maybeSingle()

  if (error) {
    fail('Could not load that user from Supabase.', error)
  }

  return data ? mapUser(data as UserRow) : null
}

export async function findUserById(userId: string) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).maybeSingle()

  if (error) {
    fail('Could not load that user from Supabase.', error)
  }

  return data ? mapUser(data as UserRow) : null
}

export async function createUser(user: UserRecord) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('users').insert(serializeUser(user)).select('*').single()

  if (error) {
    fail('Could not create the user in Supabase.', error)
  }

  return mapUser(data as UserRow)
}

export async function getVendorProfileByUserId(userId: string) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('vendor_profiles').select('*').eq('user_id', userId).maybeSingle()

  if (error) {
    fail('Could not load that vendor profile from Supabase.', error)
  }

  return data ? mapVendorProfile(data as VendorProfileRow) : null
}

export async function getVendorProfileById(vendorId: string) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('vendor_profiles').select('*').eq('id', vendorId).maybeSingle()

  if (error) {
    fail('Could not load that vendor profile from Supabase.', error)
  }

  return data ? mapVendorProfile(data as VendorProfileRow) : null
}

export async function createVendorProfile(profile: VendorProfile) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('vendor_profiles').insert(serializeVendorProfile(profile)).select('*').single()

  if (error) {
    fail('Could not create the vendor profile in Supabase.', error)
  }

  return mapVendorProfile(data as VendorProfileRow)
}

export async function updateVendorProfile(vendorId: string, updates: Partial<VendorProfilePayload> & { logo?: string }) {
  const payload = serializeVendorProfileUpdate(updates)
  payload.updated_at = new Date().toISOString()

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('vendor_profiles').update(payload).eq('id', vendorId).select('*').maybeSingle()

  if (error) {
    fail('Could not update the vendor profile in Supabase.', error)
  }

  return data ? mapVendorProfile(data as VendorProfileRow) : null
}

export async function listProducts(filters?: { vendorId?: string; query?: string; category?: string; onlyInStock?: boolean }) {
  const rows = await listProductRows(filters)

  return rows
    .map(mapProduct)
    .filter((product) => matchesQuery(filters?.query, [product.title, product.description, product.category]))
}

export async function getProductById(productId: string) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('products').select('*').eq('id', productId).maybeSingle()

  if (error) {
    fail('Could not load that product from Supabase.', error)
  }

  return data ? mapProduct(data as ProductRow) : null
}

export async function createProduct(product: Product) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('products').insert(serializeProduct(product)).select('*').single()

  if (error) {
    fail('Could not create the product in Supabase.', error)
  }

  return mapProduct(data as ProductRow)
}

export async function updateProduct(productId: string, updates: Partial<ProductPayload>) {
  const payload = serializeProductUpdate(updates)
  payload.updated_at = new Date().toISOString()

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('products').update(payload).eq('id', productId).select('*').maybeSingle()

  if (error) {
    fail('Could not update the product in Supabase.', error)
  }

  return data ? mapProduct(data as ProductRow) : null
}

export async function deleteProduct(productId: string) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('products').delete().eq('id', productId).select('*').maybeSingle()

  if (error) {
    fail('Could not delete the product from Supabase.', error)
  }

  return data ? mapProduct(data as ProductRow) : null
}

export async function listPublicVendors(filters?: { query?: string; category?: string; withProductsOnly?: boolean }) {
  const [userRows, vendorRows, productRows] = await Promise.all([listUserRows(), listVendorProfileRows(), listProductRows()])
  const users = userRows.map(mapUser)
  const vendors = vendorRows.map(mapVendorProfile)
  const products = productRows.map(mapProduct)

  return vendors
    .map((vendor) => buildPublicVendor(vendor, users, products))
    .filter((vendor) => {
      if (filters?.withProductsOnly && vendor.productCount === 0) return false
      if (filters?.category && filters.category !== 'all' && vendor.category.toLowerCase() !== filters.category.toLowerCase()) return false
      return matchesQuery(filters?.query, [vendor.businessName, vendor.description, vendor.location, vendor.category])
    })
}

export async function getPublicVendor(vendorId: string) {
  const [vendor, userRows, productRows] = await Promise.all([
    getVendorProfileById(vendorId),
    listUserRows(),
    listProductRows({ vendorId }),
  ])

  if (!vendor) {
    return null
  }

  return buildPublicVendor(vendor, userRows.map(mapUser), productRows.map(mapProduct))
}

export async function listPublicProducts(filters?: { vendorId?: string; query?: string; category?: string; onlyInStock?: boolean }) {
  const [productRows, vendorRows] = await Promise.all([listProductRows(filters), listVendorProfileRows()])
  const vendors = new Map(vendorRows.map((vendor) => [vendor.id, vendor.business_name]))

  return productRows
    .map(mapProduct)
    .filter((product) => matchesQuery(filters?.query, [product.title, product.description, product.category]))
    .map(
      (product) =>
        ({
          id: product.id,
          vendorId: product.vendorId,
          vendorName: vendors.get(product.vendorId) ?? 'Campus Vendor',
          title: product.title,
          price: product.price,
          image: product.image,
          description: product.description,
          category: product.category,
          inStock: product.inStock,
          createdAt: product.createdAt,
        }) satisfies PublicProduct,
    )
}

export async function incrementVendorViews(vendorId: string) {
  const vendor = await getVendorProfileById(vendorId)

  if (!vendor) {
    return null
  }

  const supabase = getSupabaseAdmin()
  const nextViews = vendor.views + 1
  const { data, error } = await supabase
    .from('vendor_profiles')
    .update({
      views: nextViews,
      updated_at: new Date().toISOString(),
    })
    .eq('id', vendorId)
    .select('views')
    .maybeSingle()

  if (error) {
    fail('Could not update vendor views in Supabase.', error)
  }

  return (data as { views: number } | null)?.views ?? nextViews
}

export async function getVendorDashboardData(userId: string): Promise<VendorDashboardData | null> {
  const [vendor, user, products] = await Promise.all([
    getVendorProfileByUserId(userId),
    findUserById(userId),
    listProducts(),
  ])

  if (!vendor || !user) {
    return null
  }

  const vendorProducts = products.filter((product) => product.vendorId === vendor.id)
  const publicVendor = buildPublicVendor(vendor, [user], vendorProducts)

  return {
    vendor: publicVendor,
    products: vendorProducts,
    stats: {
      totalProducts: vendorProducts.length,
      views: vendor.views,
      orders: vendor.orders,
      messages: vendor.messages,
    },
  }
}

export async function buildSessionUser(user: UserRecord): Promise<SessionUser> {
  if (user.role !== 'vendor') {
    return {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      campus: user.campus,
    }
  }

  const vendor = await getVendorProfileByUserId(user.id)

  return {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    campus: user.campus,
    vendorId: vendor?.id,
    businessName: vendor?.businessName,
  }
}
