import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_TTL_SECONDS,
  constantTimeEquals,
  createAdminSessionToken,
} from '@/lib/auth/admin-session'
import { assertSameOrigin } from '@/lib/security/same-origin'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const originCheck = assertSameOrigin(req)
  if (!originCheck.ok) return originCheck.response

  const expected = process.env.ADMIN_PASSWORD?.trim()
  if (!expected) {
    console.error('[admin-login] ADMIN_PASSWORD is not configured.')
    return NextResponse.json({ error: 'Admin login is not configured.' }, { status: 503 })
  }

  let supplied: unknown
  try {
    const body = await req.json()
    supplied = body?.password
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (typeof supplied !== 'string' || supplied.length === 0 || !constantTimeEquals(supplied, expected)) {
    return NextResponse.json({ error: 'Invalid password.' }, { status: 401 })
  }

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
