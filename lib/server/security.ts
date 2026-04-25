import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const PASSWORD_SALT_BYTES = 16

export function createId(prefix: string) {
  return `${prefix}_${randomBytes(6).toString('hex')}`
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function hashPassword(password: string) {
  const salt = randomBytes(PASSWORD_SALT_BYTES).toString('hex')
  const derived = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${derived}`
}

export function verifyPassword(password: string, hash: string) {
  const [salt, storedHash] = hash.split(':')

  if (!salt || !storedHash) {
    return false
  }

  const derived = scryptSync(password, salt, 64)
  const stored = Buffer.from(storedHash, 'hex')

  if (derived.length !== stored.length) {
    return false
  }

  return timingSafeEqual(derived, stored)
}

export function getSessionSecret() {
  return process.env.SESSION_SECRET ?? 'campusit-dev-session-secret'
}

export function signValue(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url')
}

export function encodeSignedPayload(payload: object, secret: string) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = signValue(encoded, secret)
  return `${encoded}.${signature}`
}

export function decodeSignedPayload<T>(token: string, secret: string) {
  const [encoded, signature] = token.split('.')

  if (!encoded || !signature) {
    return null
  }

  const expectedSignature = signValue(encoded, secret)

  if (signature !== expectedSignature) {
    return null
  }

  try {
    return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as T
  } catch {
    return null
  }
}
