export async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const isFormData = typeof FormData !== 'undefined' && init?.body instanceof FormData
  const response = await fetch(input, {
    ...init,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(init?.headers ?? {}),
    },
    cache: init?.cache ?? 'no-store',
  })

  if (!response.ok) {
    let message = `Request failed: ${response.status}`

    try {
      const payload = await response.json()
      message = payload?.error?.message ?? payload?.message ?? message
    } catch {
      // ignore non-json error bodies
    }

    throw new Error(message)
  }

  const payload = (await response.json()) as { data?: T }
  return (payload?.data ?? payload) as T
}
