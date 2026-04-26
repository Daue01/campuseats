import { NextRequest, NextResponse } from 'next/server'
import { attachSessionCookie } from '@/lib/server/auth'
import { createUser, createVendorProfile, findUserByEmail } from '@/lib/server/db'
import { jsonError, jsonOk } from '@/lib/server/http'
import { createId, hashPassword, slugify } from '@/lib/server/security'
import type { SignupPayload, UserRecord, VendorProfile } from '@/lib/types'

function validateSignup(payload: SignupPayload) {
  if (!payload.fullName?.trim()) return 'Full name is required.'
  if (!payload.email?.trim()) return 'Email is required.'
  if (!payload.password) return 'Password is required.'
  if (payload.password.length < 8) return 'Password must be at least 8 characters.'
  if (payload.password !== payload.confirmPassword) return 'Passwords do not match.'
  if (payload.role !== 'student' && payload.role !== 'vendor') return 'Invalid account type.'

  if (payload.role === 'vendor') {
    if (!payload.businessName?.trim()) return 'Business name is required.'
    if (!payload.phoneNumber?.trim()) return 'Phone number is required.'
    if (!payload.logo?.trim()) return 'Store logo is required.'
    if (!payload.businessDescription?.trim()) return 'Business description is required.'
    if (!payload.location?.trim()) return 'Campus location is required.'
    if (!payload.category?.trim()) return 'Category is required.'
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as SignupPayload
    const error = validateSignup(payload)

    if (error) {
      return jsonError(400, error)
    }

    const existing = await findUserByEmail(payload.email)

    if (existing) {
      return jsonError(409, 'An account with that email already exists.')
    }

    const user: UserRecord = {
      id: createId('user'),
      role: payload.role,
      name: payload.fullName.trim(),
      email: payload.email.trim().toLowerCase(),
      passwordHash: hashPassword(payload.password),
      campus: payload.campus?.trim(),
      phone: payload.phoneNumber?.trim(),
      savedVendorIds: [],
      createdAt: new Date().toISOString(),
    }

    await createUser(user)

    if (payload.role === 'vendor') {
      const vendorProfile: VendorProfile = {
        id: `${slugify(payload.businessName!)}-${user.id.slice(-4)}`,
        userId: user.id,
        businessName: payload.businessName!.trim(),
        logo: payload.logo!,
        description: payload.businessDescription!.trim(),
        location: payload.location!.trim(),
        category: payload.category!.trim(),
        phone: payload.phoneNumber!.trim(),
        views: 0,
        orders: 0,
        messages: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await createVendorProfile(vendorProfile)
    }

    const response = NextResponse.json(
      {
        ok: true,
        data: {
          redirectTo: payload.role === 'vendor' ? '/vendor' : '/student',
        },
      },
      { status: 201 },
    )

    attachSessionCookie(response, user.id)
    return response
  } catch (error) {
    return jsonError(500, error instanceof Error ? error.message : 'Could not create account.')
  }
}
