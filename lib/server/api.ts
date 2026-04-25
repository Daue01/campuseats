import { headers } from 'next/headers'

export async function fetchServerJson<T>(path: string): Promise<T> {
  const headerList = headers()
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host')
  const protocol = headerList.get('x-forwarded-proto') ?? 'http'

  if (!host) {
    throw new Error('Unable to resolve request host for server fetch.')
  }

  const response = await fetch(`${protocol}://${host}${path}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Server request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}
