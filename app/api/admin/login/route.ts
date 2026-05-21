import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_TTL_SECONDS,
  constantTimeEquals,
  createAdminSessionToken,
} from '@/lib/auth/admin-session'
import { assertSameOrigin } from '@/lib/security/same-origin'

export const runtime = 'nodejs'

// ---------------------------------------------------------------------------
// In-process rate limiter
// Best-effort on serverless (one instance = one bucket). For multi-instance
// production deploy, replace with Upstash Redis or similar distributed store.
// ---------------------------------------------------------------------------
const WINDOW_MS = 15 * 60 * 1000 // 15-minute window
const MAX_ATTEMPTS = 5            // max failed attempts before lock-out

interface RateEntry { count: number; resetAt: number }
const _attempts = new Map<string, RateEntry>()

function getClientIp(req: NextRequest): string {
  // Vercel sets x-forwarded-for; fall back to a constant so the limiter
  // still works even if the header is missing (e.g. local dev).
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSecs: number } {
  const now = Date.now()
  const entry = _attempts.get(ip)

  if (!entry || now > entry.resetAt) {
    _attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, retryAfterSecs: 0 }
  }

  entry.count += 1
  if (entry.count > MAX_ATTEMPTS) {
    const retryAfterSecs = Math.ceil((entry.resetAt - now) / 1000)
    return { allowed: false, retryAfterSecs }
  }

  return { allowed: true, retryAfterSecs: 0 }
}

// Reset counter on successful login so a typo doesn't lock out the real admin.
function resetRateLimit(ip: string) {
  _attempts.delete(ip)
}

export async function POST(req: NextRequest) {
  const originCheck = assertSameOrigin(req)
  if (!originCheck.ok) return originCheck.response

  const ip = getClientIp(req)
  // Skip rate limiting in dev so you can iterate locally without getting locked out.
  if (process.env.NODE_ENV === 'production') {
    const { allowed, retryAfterSecs } = checkRateLimit(ip)
    if (!allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Try again in ${Math.ceil(retryAfterSecs / 60)} minute(s).` },
        { status: 429, headers: { 'Retry-After': String(retryAfterSecs) } }
      )
    }
  }

  const expected = process.env.ADMIN_PASSWORD?.trim()
  if (!expected) {
    console.error('[admin-login] ADMIN_PASSWORD is not configured.')
    return NextResponse.json({ error: 'Admin login is not configured.' }, { status: 503 })
  }

  let suppliedRaw: unknown
  try {
    const body = await req.json()
    suppliedRaw = body?.password
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const supplied =
    typeof suppliedRaw === 'string' ? suppliedRaw.trim().normalize('NFKC') : ''
  const expectedNorm = expected.normalize('NFKC')

  if (supplied.length === 0 || !constantTimeEquals(supplied, expectedNorm)) {
    if (process.env.NODE_ENV !== 'production') {
      // Local-only diagnostic — never logs the actual password, just shape clues
      // that let you figure out if you're typing it wrong or the env var is stale.
      const maskedSupplied =
        supplied.length === 0
          ? '(empty)'
          : `${supplied[0]}…${supplied[supplied.length - 1]} len=${supplied.length}`
      const maskedExpected = `${expectedNorm[0]}…${expectedNorm[expectedNorm.length - 1]} len=${expectedNorm.length}`
      console.warn(
        `[admin-login] FAIL ip=${ip} supplied=${maskedSupplied} expected=${maskedExpected}`
      )
    }
    return NextResponse.json({ error: 'Invalid password.' }, { status: 401 })
  }

  // Successful auth — clear the attempt counter.
  resetRateLimit(ip)

  const { token } = await createAdminSessionToken()

  const res = NextResponse.json({ success: true })
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ADMIN_SESSION_TTL_SECONDS,
    path: '/',
  })
  return res
}
