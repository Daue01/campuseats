import { NextRequest, NextResponse } from 'next/server'
import { attachSessionCookie } from '@/lib/server/auth'
import { buildSessionUser, findUserByEmail } from '@/lib/server/db'
import { jsonError } from '@/lib/server/http'
import { verifyPassword } from '@/lib/server/security'
import type { LoginPayload } from '@/lib/types'

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as LoginPayload

  if (!payload.email?.trim() || !payload.password) {
    return jsonError(400, 'Email and password are required.')
  }

  const user = await findUserByEmail(payload.email)

  if (!user || !verifyPassword(payload.password, user.passwordHash)) {
    return jsonError(401, 'Invalid email or password.')
  }

  const sessionUser = await buildSessionUser(user)
  const response = NextResponse.json({
    ok: true,
    data: {
      session: {
        authenticated: true,
        user: sessionUser,
      },
      redirectTo: user.role === 'vendor' ? '/vendor' : '/student',
    },
  })

  attachSessionCookie(response, user.id)
  return response
}
