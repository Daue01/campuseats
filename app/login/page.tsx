'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react'
import { FormEvent, useState } from 'react'
import BrandMark from '@/components/layout/BrandMark'
import { fetchJson } from '@/lib/api-client'
import { useToast } from '@/components/providers/ToastProvider'

export default function LoginPage() {
  const router = useRouter()
  const { pushToast } = useToast()
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)

    try {
      const result = await fetchJson<{ redirectTo: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      })

      pushToast({
        tone: 'success',
        title: 'Welcome back',
        description: 'Your account session is active.',
      })
      router.push(result.redirectTo)
      router.refresh()
    } catch (error) {
      pushToast({
        tone: 'error',
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="section-shell py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr,1.1fr]">
        <div className="overflow-hidden rounded-[32px] bg-[#17120d] p-8 text-white shadow-[0_30px_90px_rgba(23,18,13,0.2)]">
          <BrandMark href="/" />
          <div className="mt-10 space-y-5">
            <p className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-200">
              Sign in
            </p>
            <h1 className="text-4xl font-black tracking-tight">Welcome back to CampusEats.</h1>
            <p className="text-base leading-8 text-stone-300">
              The app now starts without seeded demo accounts, so login is ready for real users you create through signup.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-white/8 p-5">
                <p className="text-sm font-semibold text-orange-200">Student flow</p>
                <p className="mt-2 text-sm leading-7 text-stone-300">Browse discovery pages, then jump into the student dashboard once your account is live.</p>
              </div>
              <div className="rounded-[24px] bg-white/8 p-5">
                <p className="text-sm font-semibold text-orange-200">Vendor flow</p>
                <p className="mt-2 text-sm leading-7 text-stone-300">Manage your storefront, upload products, and test the full onboarding path end to end.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="surface-card p-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Login</p>
            <h2 className="text-3xl font-black text-stone-950">Access your account</h2>
            <p className="text-sm leading-7 text-stone-600">Sign in once and we will route you to the correct dashboard automatically.</p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  className="auth-input pl-11"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="you@school.edu"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Password</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  className="auth-input pl-11"
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              {submitting ? 'Signing in...' : 'Sign in'}
              {!submitting ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </form>

          <p className="mt-6 text-sm text-stone-600">
            New here?{' '}
            <Link href="/signup" className="font-semibold text-orange-600 transition hover:text-orange-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
