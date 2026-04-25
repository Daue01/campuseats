'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { FormEvent, useMemo, useState } from 'react'
import BrandMark from '@/components/layout/BrandMark'
import ImageUploader from '@/components/ui/ImageUploader'
import { useToast } from '@/components/providers/ToastProvider'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import { fetchJson } from '@/lib/api-client'
import type { UserRole } from '@/lib/types'

const campuses = ['University of Lagos', 'University of Ibadan', 'OAU', 'UNN', 'Babcock University']

export default function SignupPage() {
  const router = useRouter()
  const { pushToast } = useToast()
  const [role, setRole] = useState<UserRole>('student')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    campus: '',
    businessName: '',
    phoneNumber: '',
    logo: '',
    businessDescription: '',
    location: '',
    category: PRODUCT_CATEGORIES[0]?.label ?? 'Meals',
  })

  const roleTitle = useMemo(
    () => (role === 'student' ? 'Create your student account' : 'Launch your vendor storefront'),
    [role],
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)

    try {
      const result = await fetchJson<{ redirectTo: string }>('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          role,
          ...form,
        }),
      })

      pushToast({
        tone: 'success',
        title: 'Account created',
        description: 'Your dashboard is ready.',
      })
      router.push(result.redirectTo)
      router.refresh()
    } catch (error) {
      pushToast({
        tone: 'error',
        title: 'Could not create account',
        description: error instanceof Error ? error.message : 'Please review your details and try again.',
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
              Sign up
            </p>
            <h1 className="text-4xl font-black tracking-tight">Create a real account and test the full flow.</h1>
            <p className="text-base leading-8 text-stone-300">
              Demo content is gone, so this is now the clean entry point for student and vendor onboarding.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`w-full rounded-[24px] border px-5 py-4 text-left transition ${
                  role === 'student' ? 'border-orange-300 bg-orange-500/15 text-white' : 'border-white/10 bg-white/5 text-stone-300'
                }`}
              >
                <p className="text-base font-bold">Student</p>
                <p className="mt-1 text-sm leading-7 opacity-90">Browse vendors, discover products, and move through the student dashboard.</p>
              </button>
              <button
                type="button"
                onClick={() => setRole('vendor')}
                className={`w-full rounded-[24px] border px-5 py-4 text-left transition ${
                  role === 'vendor' ? 'border-orange-300 bg-orange-500/15 text-white' : 'border-white/10 bg-white/5 text-stone-300'
                }`}
              >
                <p className="text-base font-bold">Vendor</p>
                <p className="mt-1 text-sm leading-7 opacity-90">Create a storefront, upload products, and test the live vendor management flow.</p>
              </button>
            </div>
          </div>
        </div>

        <div className="surface-card p-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Create account</p>
            <h2 className="text-3xl font-black text-stone-950">{roleTitle}</h2>
            <p className="text-sm leading-7 text-stone-600">Choose the path that matches your workflow. We will route you to the correct dashboard after signup.</p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-stone-700">Full name</label>
                <input
                  className="auth-input"
                  value={form.fullName}
                  onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              {role === 'vendor' ? (
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-stone-700">Business name</label>
                  <input
                    className="auth-input"
                    value={form.businessName}
                    onChange={(event) => setForm((current) => ({ ...current, businessName: event.target.value }))}
                    placeholder="Store or business name"
                    required
                  />
                </div>
              ) : null}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Email</label>
                <input
                  className="auth-input"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="name@school.edu"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">{role === 'vendor' ? 'Phone number' : 'School / campus'}</label>
                {role === 'vendor' ? (
                  <input
                    className="auth-input"
                    value={form.phoneNumber}
                    onChange={(event) => setForm((current) => ({ ...current, phoneNumber: event.target.value }))}
                    placeholder="+234..."
                    required
                  />
                ) : (
                  <select
                    className="auth-input"
                    value={form.campus}
                    onChange={(event) => setForm((current) => ({ ...current, campus: event.target.value }))}
                  >
                    <option value="">Select campus</option>
                    {campuses.map((campus) => (
                      <option key={campus} value={campus}>
                        {campus}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Password</label>
                <input
                  className="auth-input"
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Minimum 8 characters"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Confirm password</label>
                <input
                  className="auth-input"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                  placeholder="Re-enter password"
                  required
                />
              </div>

              {role === 'vendor' ? (
                <>
                  <div className="sm:col-span-2">
                    <ImageUploader
                      label="Store logo"
                      value={form.logo}
                      onChange={(logo) => setForm((current) => ({ ...current, logo }))}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-stone-700">Business description</label>
                    <textarea
                      className="auth-input min-h-[120px] resize-none"
                      value={form.businessDescription}
                      onChange={(event) => setForm((current) => ({ ...current, businessDescription: event.target.value }))}
                      placeholder="Tell students what you sell and why they should shop with you."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Campus location</label>
                    <input
                      className="auth-input"
                      value={form.location}
                      onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                      placeholder="Faculty mall, hostel axis..."
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
                </>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              {submitting ? 'Creating account...' : role === 'vendor' ? 'Create vendor account' : 'Create student account'}
              {!submitting ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </form>

          <p className="mt-6 text-sm text-stone-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-orange-600 transition hover:text-orange-700">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
