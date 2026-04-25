'use client'

import { FormEvent, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import ImageUploader from '@/components/ui/ImageUploader'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import { fetchJson } from '@/lib/api-client'
import { useToast } from '@/components/providers/ToastProvider'
import type { Product } from '@/lib/types'

type ProductFormState = {
  title: string
  price: string
  description: string
  category: string
  image: string
  inStock: boolean
}

const initialFormState: ProductFormState = {
  title: '',
  price: '',
  description: '',
  category: PRODUCT_CATEGORIES[0]?.label ?? 'Meals',
  image: '',
  inStock: true,
}

export default function ProductEditorModal({
  open,
  product,
  onClose,
  onSaved,
}: {
  open: boolean
  product: Product | null
  onClose: () => void
  onSaved: () => Promise<void>
}) {
  const { pushToast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<ProductFormState>(initialFormState)

  useEffect(() => {
    if (!product) {
      setForm(initialFormState)
      return
    }

    setForm({
      title: product.title,
      price: String(product.price),
      description: product.description,
      category: product.category,
      image: product.image,
      inStock: product.inStock,
    })
  }, [product])

  if (!open) {
    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)

    try {
      await fetchJson(product ? `/api/vendor/products/${product.id}` : '/api/vendor/products', {
        method: product ? 'PUT' : 'POST',
        body: JSON.stringify({
          title: form.title,
          price: Number(form.price),
          description: form.description,
          category: form.category,
          image: form.image,
          inStock: form.inStock,
        }),
      })

      pushToast({
        tone: 'success',
        title: product ? 'Product updated' : 'Product added',
        description: 'Your storefront has been refreshed.',
      })
      await onSaved()
      onClose()
    } catch (error) {
      pushToast({
        tone: 'error',
        title: 'Could not save product',
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-stone-950/45 px-4 py-6 backdrop-blur-sm">
      <div className="surface-card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-600">Product</p>
            <h3 className="mt-2 text-2xl font-black text-stone-950">
              {product ? 'Edit product' : 'Add a new product'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-stone-200 p-2 text-stone-600 transition hover:bg-stone-50"
            aria-label="Close product editor"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <ImageUploader
            label="Product image"
            value={form.image}
            onChange={(image) => setForm((current) => ({ ...current, image }))}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-stone-700">Product title</label>
              <input
                className="auth-input"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Price</label>
              <input
                className="auth-input"
                type="number"
                min="1"
                value={form.price}
                onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Category</label>
              <select
                className="auth-input"
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                required
              >
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.label}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-stone-700">Description</label>
              <textarea
                className="auth-input min-h-[120px] resize-none"
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                required
              />
            </div>
            <label className="inline-flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(event) => setForm((current) => ({ ...current, inStock: event.target.checked }))}
                className="h-4 w-4 rounded border-stone-300 text-orange-600 focus:ring-orange-500"
              />
              Product is in stock
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-orange-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            {submitting ? 'Saving...' : product ? 'Save product' : 'Add product'}
          </button>
        </form>
      </div>
    </div>
  )
}
