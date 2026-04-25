'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Compass, Menu, Store, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { fetchJson } from '@/lib/api-client'
import BrandMark from '@/components/layout/BrandMark'
import type { SessionUser } from '@/lib/types'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Explore', href: '/explore' },
  { label: 'Vendors', href: '/vendors' },
  { label: 'About', href: '/about' },
]

export default function Header({ sessionUser }: { sessionUser: SessionUser | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await fetchJson('/api/auth/logout', { method: 'POST' })
      router.push('/')
      router.refresh()
    } finally {
      setLoggingOut(false)
      setMenuOpen(false)
    }
  }

  const dashboardHref = sessionUser?.role === 'vendor' ? '/vendor' : '/student'

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-[rgba(255,248,240,0.86)] backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(255,248,240,0.74)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <BrandMark compact />

        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 ${
                  active ? 'bg-orange-500/10 text-orange-600' : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {sessionUser ? (
            <>
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-white hover:text-stone-950"
              >
                {sessionUser.role === 'vendor' ? <Store className="h-4 w-4" /> : <UserRound className="h-4 w-4" />}
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-900 hover:text-stone-950"
              >
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-white hover:text-stone-950"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                <Compass className="h-4 w-4" />
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-full border border-stone-200 bg-white/90 p-2 text-stone-700 md:hidden"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-stone-200 bg-[#fff8f0] md:hidden">
          <nav className="space-y-1 px-4 py-4" aria-label="Mobile Primary">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-white hover:text-stone-950"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-stone-100 pt-3">
              {sessionUser ? (
                <>
                  <Link
                    href={dashboardHref}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleLogout()}
                    className="rounded-full border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700"
                  >
                    {loggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full border border-stone-300 px-4 py-3 text-center text-sm font-semibold text-stone-700"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
