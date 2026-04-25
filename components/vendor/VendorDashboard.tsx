'use client'

import { useEffect, useMemo, useState } from 'react'
import { BarChart3, MessageSquare, Package, PencilLine, Plus, Trash2, Users } from 'lucide-react'
import ProductEditorModal from '@/components/vendor/ProductEditorModal'
import EmptyState from '@/components/ui/EmptyState'
import ImageUploader from '@/components/ui/ImageUploader'
import { StatCardSkeleton } from '@/components/ui/SkeletonLoader'
import { fetchJson } from '@/lib/api-client'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import { useToast } from '@/components/providers/ToastProvider'
import type { Product, SessionUser, VendorDashboardData } from '@/lib/types'

type ProfileFormState = {
  businessName: string
  logo: string
  description: string
  location: string
  category: string
  phone: string
}

export default function VendorDashboard({ sessionUser }: { sessionUser: SessionUser }) {
  const { pushToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [dashboard, setDashboard] = useState<VendorDashboardData | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [profile, setProfile] = useState<ProfileFormState>({
    businessName: '',
    logo: '',
    description: '',
    location: '',
    category: PRODUCT_CATEGORIES[0]?.label ?? 'Meals',
    phone: '',
  })

  async function loadDashboard() {
    const nextDashboard = await fetchJson<VendorDashboardData>('/api/vendor/dashboard')
    setDashboard(nextDashboard)
    setProfile({
      businessName: nextDashboard.vendor.businessName,
      logo: nextDashboard.vendor.logo,
      description: nextDashboard.vendor.description,
      location: nextDashboard.vendor.location,
      category: nextDashboard.vendor.category,
      phone: nextDashboard.vendor.phone,
    })
  }

  useEffect(() => {
    let active = true

    loadDashboard()
      .catch((error) => {
        if (!active) return
        pushToast({
          tone: 'error',
          title: 'Could not load vendor dashboard',
          description: error instanceof Error ? error.message : 'Please refresh and try again.',
        })
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [pushToast])

  const statCards = useMemo(() => {
    if (!dashboard) {
      return []
    }

    return [
      { label: 'Total products', value: String(dashboard.stats.totalProducts), icon: Package },
      { label: 'Store views', value: String(dashboard.stats.views), icon: Users },
      { label: 'Orders', value: String(dashboard.stats.orders), icon: BarChart3 },
      { label: 'Messages', value: String(dashboard.stats.messages), icon: MessageSquare },
    ]
  }, [dashboard])

  async function handleDeleteProduct(productId: string) {
    if (!window.confirm('Delete this product?')) {
      return
    }

    try {
      await fetchJson(`/api/vendor/products/${productId}`, { method: 'DELETE' })
      await loadDashboard()
      pushToast({
        tone: 'success',
        title: 'Product deleted',
        description: 'The item has been removed from your storefront.',
      })
    } catch (error) {
      pushToast({
        tone: 'error',
        title: 'Could not delete product',
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    }
  }

  async function handleSaveProfile() {
    setSavingProfile(true)

    try {
      await fetchJson('/api/vendor/dashboard', {
        method: 'PUT',
        body: JSON.stringify(profile),
      })
      await loadDashboard()
      pushToast({
        tone: 'success',
        title: 'Profile updated',
        description: 'Your vendor details are now live.',
      })
    } catch (error) {
      pushToast({
        tone: 'error',
        title: 'Could not save profile',
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    } finally {
      setSavingProfile(false)
    }
  }

  return (
    <div className="section-shell space-y-10 py-12">
      <section className="surface-card overflow-hidden p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-600">Vendor Dashboard</p>
            <h1 className="text-4xl font-black text-stone-950">
              {dashboard?.vendor.businessName ?? sessionUser.businessName ?? 'Your storefront'}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-stone-600">
              Manage products, refine your profile, and keep your campus storefront fresh from one focused dashboard.
            </p>
          </div>
          <div className="flex flex-col items-start justify-between gap-4 rounded-[28px] border border-stone-200 bg-[#17120d] px-6 py-6 text-white">
            <div>
              <p className="text-sm text-stone-300">Signed in as</p>
              <p className="mt-2 text-xl font-bold">{sessionUser.name}</p>
              <p className="mt-1 text-sm text-stone-300">{sessionUser.email}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedProduct(null)
                setModalOpen(true)
              }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-orange-50"
            >
              <Plus className="h-4 w-4" />
              Add product
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => <StatCardSkeleton key={index} />)
          : statCards.map((card) => {
              const Icon = card.icon
              return (
                <div key={card.label} className="surface-card p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-6 text-3xl font-black text-stone-950">{card.value}</p>
                  <p className="mt-2 text-sm text-stone-600">{card.label}</p>
                </div>
              )
            })}
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="surface-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-600">Products</p>
              <h2 className="mt-2 text-2xl font-black text-stone-950">Manage your listings</h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedProduct(null)
                setModalOpen(true)
              }}
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => <StatCardSkeleton key={index} />)
            ) : dashboard && dashboard.products.length > 0 ? (
              dashboard.products.map((product) => (
                <div key={product.id} className="rounded-[24px] border border-stone-200 bg-white p-4">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <img src={product.image} alt={product.title} className="h-28 w-full rounded-[20px] object-cover sm:w-32" />
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-lg font-bold text-stone-950">{product.title}</p>
                          <p className="mt-1 text-sm text-stone-500">{product.category}</p>
                        </div>
                        <span className="text-base font-bold text-orange-600">
                          {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(product.price)}
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-stone-600">{product.description}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          {product.inStock ? 'In stock' : 'Out of stock'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProduct(product)
                            setModalOpen(true)
                          }}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 transition hover:text-orange-600"
                        >
                          <PencilLine className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteProduct(product.id)}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 transition hover:text-rose-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="No products yet"
                description="Add your first product to make your storefront visible to students."
              />
            )}
          </div>
        </div>

        <div className="surface-card p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-600">Vendor Profile</p>
            <h2 className="mt-2 text-2xl font-black text-stone-950">Store details</h2>
          </div>

          <div className="mt-6 space-y-5">
            <ImageUploader
              label="Store logo"
              value={profile.logo}
              onChange={(logo) => setProfile((current) => ({ ...current, logo }))}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Business name</label>
              <input
                className="auth-input"
                value={profile.businessName}
                onChange={(event) => setProfile((current) => ({ ...current, businessName: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Description</label>
              <textarea
                className="auth-input min-h-[120px] resize-none"
                value={profile.description}
                onChange={(event) => setProfile((current) => ({ ...current, description: event.target.value }))}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Location</label>
                <input
                  className="auth-input"
                  value={profile.location}
                  onChange={(event) => setProfile((current) => ({ ...current, location: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Phone</label>
                <input
                  className="auth-input"
                  value={profile.phone}
                  onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-stone-700">Category</label>
                <select
                  className="auth-input"
                  value={profile.category}
                  onChange={(event) => setProfile((current) => ({ ...current, category: event.target.value }))}
                >
                  {PRODUCT_CATEGORIES.map((category) => (
                    <option key={category.id} value={category.label}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleSaveProfile()}
              disabled={savingProfile}
              className="w-full rounded-full bg-orange-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              {savingProfile ? 'Saving profile...' : 'Save store details'}
            </button>
          </div>
        </div>
      </section>

      <ProductEditorModal
        open={modalOpen}
        product={selectedProduct}
        onClose={() => setModalOpen(false)}
        onSaved={loadDashboard}
      />
    </div>
  )
}
