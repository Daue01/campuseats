import type { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { AuthSession, SessionUser, UserRecord } from '@/lib/types'
import { buildSessionUser, findUserById } from '@/lib/server/db'
import { decodeSignedPayload, encodeSignedPayload, getSessionSecret } from '@/lib/server/security'

const SESSION_COOKIE = 'campusit_session'
const SESSION_AGE_SECONDS = 60 * 60 * 24 * 30

type SessionPayload = {
  userId: string
  expiresAt: number
}

async function resolveSessionUser(user: UserRecord | null): Promise<SessionUser | null> {
  if (!user) {
    return null
  }

  return buildSessionUser(user)
}

export async function getSession(): Promise<AuthSession> {
  const store = cookies()
  const token = store.get(SESSION_COOKIE)?.value

  if (!token) {
    return { authenticated: false, user: null }
  }

  const payload = decodeSignedPayload<SessionPayload>(token, getSessionSecret())

  if (!payload || payload.expiresAt < Date.now()) {
    return { authenticated: false, user: null }
  }

  const user = await findUserById(payload.userId)
  const sessionUser = await resolveSessionUser(user)

  if (!sessionUser) {
    return { authenticated: false, user: null }
  }

  return {
    authenticated: true,
    user: sessionUser,
  }
}

export function attachSessionCookie(response: NextResponse, userId: string) {
  const token = encodeSignedPayload(
    {
      userId,
      expiresAt: Date.now() + SESSION_AGE_SECONDS * 1000,
    } satisfies SessionPayload,
    getSessionSecret(),
  )

  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_AGE_SECONDS,
  })
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
}
