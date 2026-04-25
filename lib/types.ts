export type UserRole = 'student' | 'vendor'

export interface UserRecord {
  id: string
  role: UserRole
  name: string
  email: string
  passwordHash: string
  campus?: string
  phone?: string
  savedVendorIds: string[]
  createdAt: string
}

export interface VendorProfile {
  id: string
  userId: string
  businessName: string
  logo: string
  description: string
  location: string
  category: string
  phone: string
  views: number
  orders: number
  messages: number
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  vendorId: string
  title: string
  price: number
  image: string
  description: string
  category: string
  inStock: boolean
  createdAt: string
  updatedAt: string
}

export interface Database {
  users: UserRecord[]
  vendorProfiles: VendorProfile[]
  products: Product[]
}

export interface SessionUser {
  id: string
  role: UserRole
  name: string
  email: string
  campus?: string
  vendorId?: string
  businessName?: string
}

export interface AuthSession {
  authenticated: boolean
  user: SessionUser | null
}

export interface PublicVendor {
  id: string
  userId: string
  businessName: string
  ownerName: string
  email: string
  phone: string
  logo: string
  description: string
  location: string
  category: string
  productCount: number
  views: number
}

export interface PublicProduct {
  id: string
  vendorId: string
  vendorName: string
  title: string
  price: number
  image: string
  description: string
  category: string
  inStock: boolean
  createdAt: string
}

export interface VendorDashboardData {
  vendor: PublicVendor
  products: Product[]
  stats: {
    totalProducts: number
    views: number
    orders: number
    messages: number
  }
}

export interface SignupPayload {
  role: UserRole
  fullName: string
  email: string
  password: string
  confirmPassword: string
  campus?: string
  businessName?: string
  phoneNumber?: string
  logo?: string
  businessDescription?: string
  location?: string
  category?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface ProductPayload {
  title: string
  price: number
  description: string
  category: string
  image: string
  inStock: boolean
}

export interface VendorProfilePayload {
  businessName: string
  logo: string
  description: string
  location: string
  category: string
  phone: string
}

export interface ToastMessage {
  id: string
  title: string
  description?: string
  tone?: 'success' | 'error' | 'info'
}

export interface CategoryOption {
  id: string
  label: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
}
