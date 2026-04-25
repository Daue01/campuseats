'use client'

import { useEffect } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import type { ToastMessage } from '@/lib/types'

const toneMap = {
  success: {
    icon: CheckCircle2,
    className: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  },
  error: {
    icon: AlertCircle,
    className: 'border-rose-200 bg-rose-50 text-rose-900',
  },
  info: {
    icon: Info,
    className: 'border-slate-200 bg-white text-slate-900',
  },
}

export default function ToastNotification({
  toast,
  onDismiss,
}: {
  toast: ToastMessage
  onDismiss: () => void
}) {
  const tone = toneMap[toast.tone ?? 'info']
  const Icon = tone.icon

  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 3600)
    return () => window.clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border px-4 py-3 shadow-[0_18px_50px_rgba(15,23,42,0.12)] ${tone.className}`}
    >
      <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{toast.title}</p>
        {toast.description ? <p className="mt-1 text-sm opacity-80">{toast.description}</p> : null}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="rounded-full p-1 text-current/60 transition hover:bg-black/5 hover:text-current"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
