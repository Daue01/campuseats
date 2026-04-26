import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseAdmin: SupabaseClient | null = null

function requireEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function requireServiceRoleKey() {
  const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY')

  if (key.startsWith('sb_publishable_') || key.startsWith('sb_secret_')) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY must be a server-side service role key from Supabase, not a publishable or secret API key.',
    )
  }

  return key
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

  supabaseAdmin = createClient(getSupabaseUrl(), requireServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return supabaseAdmin
}
