/** @type {import('next').NextConfig} */
const remotePatterns = [
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
  },
]

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL

if (supabaseUrl) {
  try {
    remotePatterns.push({
      protocol: 'https',
      hostname: new URL(supabaseUrl).hostname,
    })
  } catch {}
}

const nextConfig = {
  images: {
    remotePatterns,
  },
}

module.exports = nextConfig
