import { NextRequest, NextResponse } from 'next/server'

/**
 * Lightweight CSRF defense: ensure the request originates from this site.
 *
 * Browsers always send `Origin` (or at least `Referer`) on state-changing requests
 * from real pages. A cross-site CSRF will either omit `Origin` for a different host
 * or set it explicitly. We compare the request's host (from `Host` header) to the
 * Origin/Referer URL hostname — that works on Vercel without needing extra config.
 */
export function assertSameOrigin(
  req: NextRequest
): { ok: true } | { ok: false; response: NextResponse } {
  const host = req.headers.get('host')
  if (!host) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Missing host header.' }, { status: 400 }),
    }
  }

  const origin = req.headers.get('origin')
  const referer = req.headers.get('referer')
  const candidate = origin ?? referer
  if (!candidate) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Cross-site request blocked.' }, { status: 403 }),
    }
  }

  let candidateHost: string
  try {
    candidateHost = new URL(candidate).host
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Invalid origin header.' }, { status: 400 }),
    }
  }

  if (candidateHost.toLowerCase() !== host.toLowerCase()) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Cross-site request blocked.' }, { status: 403 }),
    }
  }

  return { ok: true }
}
