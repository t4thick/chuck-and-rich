import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const CUSTOMER_AUTH_PATHS = ['/account', '/checkout', '/order-confirmation', '/track-order']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const nextTarget = `${pathname}${request.nextUrl.search}`
  const adminPassword = process.env.ADMIN_PASSWORD
  const legacyAdmin =
    adminPassword &&
    request.cookies.get('admin_session')?.value === adminPassword

  // ── Customer pages require Supabase session
  if (CUSTOMER_AUTH_PATHS.some((prefix) => pathname.startsWith(prefix))) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.search = ''
      url.searchParams.set('next', nextTarget)
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // ── /admin (except login): Supabase admin role OR legacy cookie
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (legacyAdmin) {
      return supabaseResponse
    }
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login?error=forbidden', request.url))
    }
    return supabaseResponse
  }

  // ── Logged-in users don't need /login or /signup
  if (user && (pathname === '/login' || pathname === '/signup')) {
    const requestedNext = request.nextUrl.searchParams.get('next')
    const safeNext = requestedNext?.startsWith('/') ? requestedNext : '/account'
    return NextResponse.redirect(new URL(safeNext, request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
