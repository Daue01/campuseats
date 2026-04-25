import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseAdmin: SupabaseClient | null = null

function requireEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export function getSupabaseUrl() {
  return process.env.SUPABASE_URL ?? requireEnv('NEXT_PUBLIC_SUPABASE_URL')
}

export function getSupabaseStorageBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET ?? 'campuseats-media'
}

export function getSupabaseAdmin() {
  if (supabaseAdmin) {
    return supabaseAdmin
  }

  supabaseAdmin = createClient(getSupabaseUrl(), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return supabaseAdmin
}
