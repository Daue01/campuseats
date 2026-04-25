import Link from 'next/link'
import BrandMark from '@/components/layout/BrandMark'
import { BRAND } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="border-t border-white/70 bg-[#fff3e7]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.25fr,0.7fr,0.7fr,0.8fr] lg:px-8">
        <div className="space-y-4">
          <BrandMark />
          <p className="max-w-md text-sm leading-7 text-stone-600">
            CampusEats is a student-friendly marketplace for campus vendors, food spots, and everyday storefront discovery.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Platform</p>
          <div className="space-y-2 text-sm text-stone-600">
            <Link href="/" className="block transition hover:text-stone-950">Home</Link>
            <Link href="/explore" className="block transition hover:text-stone-950">Explore</Link>
            <Link href="/vendors" className="block transition hover:text-stone-950">Vendors</Link>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Company</p>
          <div className="space-y-2 text-sm text-stone-600">
            <Link href="/about" className="block transition hover:text-stone-950">About us</Link>
            <Link href="/login" className="block transition hover:text-stone-950">Login</Link>
            <Link href="/signup" className="block transition hover:text-stone-950">Sign up</Link>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Contact</p>
          <div className="space-y-2 text-sm text-stone-600">
            <a href={`mailto:${BRAND.email}`} className="block transition hover:text-stone-950">{BRAND.email}</a>
            <p>Lagos, Nigeria</p>
            <p>Built for campus vendors and students.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
