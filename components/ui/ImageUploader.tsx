'use client'

import { useId, useState } from 'react'
import { ImagePlus, Loader2 } from 'lucide-react'
import { fetchJson } from '@/lib/api-client'
import { useToast } from '@/components/providers/ToastProvider'

export default function ImageUploader({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const inputId = useId()
  const { pushToast } = useToast()
  const [preview, setPreview] = useState(value)
  const [uploading, setUploading] = useState(false)

  async function handleFileChange(file: File | null) {
    if (!file) {
      return
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      pushToast({
        tone: 'error',
        title: 'Unsupported format',
        description: 'Use JPG, PNG, or WEBP images only.',
      })
      return
    }

    if (file.size > 4 * 1024 * 1024) {
      pushToast({
        tone: 'error',
        title: 'Image too large',
        description: 'Please upload a file smaller than 4MB.',
      })
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const result = await fetchJson<{ url: string }>('/api/upload', {
        method: 'POST',
        body: formData,
      })

      onChange(result.url)
      setPreview(result.url)
      pushToast({
        tone: 'success',
        title: 'Image uploaded',
        description: 'Your image is ready to use.',
      })
    } catch (error) {
      setPreview(value)
      pushToast({
        tone: 'error',
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <label htmlFor={inputId} className="text-sm font-medium text-stone-700">
        {label}
      </label>
      <label
        htmlFor={inputId}
        className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[28px] border border-dashed border-orange-200 bg-[#fffaf5] px-4 py-8 text-center transition hover:border-orange-400 hover:bg-[#fff4ea]"
      >
        {preview ? (
          <img src={preview} alt={label} className="h-28 w-28 rounded-2xl object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-stone-500 shadow-sm">
            <ImagePlus className="h-6 w-6" />
          </div>
        )}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-stone-900">
            {uploading ? 'Uploading image...' : 'Choose image'}
          </p>
          <p className="text-xs text-stone-500">JPG, PNG, or WEBP. Max 4MB.</p>
        </div>
        {uploading ? <Loader2 className="h-4 w-4 animate-spin text-orange-500" /> : null}
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null
          void handleFileChange(file)
        }}
      />
    </div>
  )
}
