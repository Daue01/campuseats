import { extname } from 'node:path'
import { createId } from '@/lib/server/security'
import { getSupabaseAdmin, getSupabaseStorageBucket } from '@/lib/server/supabase'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024
let bucketReady: Promise<void> | null = null

async function ensureBucket() {
  if (bucketReady) {
    return bucketReady
  }

  bucketReady = (async () => {
    const supabase = getSupabaseAdmin()
    const bucket = getSupabaseStorageBucket()
    const { data, error } = await supabase.storage.getBucket(bucket)

    if (!error && data) {
      return
    }

    const { error: createError } = await supabase.storage.createBucket(bucket, {
      public: true,
      allowedMimeTypes: Array.from(ALLOWED_TYPES),
    })

    if (createError && !createError.message.toLowerCase().includes('already exists')) {
      throw new Error(`Could not create the Supabase storage bucket. ${createError.message}`)
    }
  })().catch((error) => {
    bucketReady = null
    throw error
  })

  await bucketReady
}

export async function saveUpload(file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('Only JPG, PNG, and WEBP files are allowed.')
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Image must be 4MB or smaller.')
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  const extension = extname(file.name) || (file.type === 'image/png' ? '.png' : file.type === 'image/webp' ? '.webp' : '.jpg')
  const filename = `uploads/${createId('upload')}${extension}`
  const supabase = getSupabaseAdmin()
  const bucket = getSupabaseStorageBucket()

  await ensureBucket()

  const { error } = await supabase.storage.from(bucket).upload(filename, bytes, {
    contentType: file.type,
    upsert: false,
  })

  if (error) {
    throw new Error(`Upload failed. ${error.message}`)
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filename)

  return data.publicUrl
}
