'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="section-shell flex min-h-screen items-center justify-center py-16">
      <div className="w-full max-w-2xl rounded-[32px] border border-stone-200 bg-white p-8 shadow-[0_30px_80px_rgba(38,28,20,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Server Error</p>
        <h1 className="mt-3 text-3xl font-black text-stone-950">Something went wrong while loading this page.</h1>
        <p className="mt-4 text-sm leading-7 text-stone-600">
          This usually means a server-side data request failed during rendering. Check your Vercel Function logs for the full error message.
        </p>
        {error.digest ? (
          <p className="mt-4 rounded-2xl bg-stone-100 px-4 py-3 font-mono text-xs text-stone-700">Digest: {error.digest}</p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-900 hover:text-stone-950"
          >
            Go home
          </a>
        </div>
      </div>
    </main>
  )
}
