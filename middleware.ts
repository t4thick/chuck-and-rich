import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/auth/admin-session'

const CUSTOMER_AUTH_PATHS = ['/account', '/checkout', '/order-confirmation', '/track-order']

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const { pathname } = request.nextUrl
  const nextTarget = `${pathname}${request.nextUrl.search}`

  // createServerClient throws if URL/key are empty — avoid MIDDLEWARE_INVOCATION_FAILED on Vercel
  // when env vars are missing or not available to the Edge bundle.
  if (!supabaseUrl?.trim() || !supabaseAnonKey?.trim()) {
    console.error(
      '[middleware] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY — add them in Vercel → Environment Variables and redeploy.'
    )
    if (CUSTOMER_AUTH_PATHS.some((prefix) => pathname.startsWith(prefix))) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.search = ''
      url.searchParams.set('next', nextTarget)
      url.searchParams.set('error', 'configuration')
      return NextResponse.redirect(url)
    }
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login?error=configuration', request.url))
    }
    return NextResponse.next({ request })
  }

  try {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          Object.entries(headers).forEach(([key, value]) => supabaseResponse.headers.set(key, value))
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const adminToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value
    const adminSessionValid = await verifyAdminSessionToken(adminToken)

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

    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      if (adminSessionValid) {
        return supabaseResponse
      }
      if (!user) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError) {
        console.error('[middleware] profiles lookup:', profileError.message)
        return NextResponse.redirect(new URL('/admin/login?error=forbidden', request.url))
      }

      if (profile?.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login?error=forbidden', request.url))
      }
      return supabaseResponse
    }

    if (user && (pathname === '/login' || pathname === '/signup')) {
      const requestedNext = request.nextUrl.searchParams.get('next')
      const safeNext = requestedNext?.startsWith('/') ? requestedNext : '/'
      return NextResponse.redirect(new URL(safeNext, request.url))
    }

    return supabaseResponse
  } catch (e) {
    console.error('[middleware]', e)
    return NextResponse.next({ request })
  }
}

export const config = {
  // Only run the middleware on routes that actually need auth gating.
  // This avoids running supabase.auth.getUser() on every product / static page request.
  matcher: [
    '/account/:path*',
    '/checkout/:path*',
    '/order-confirmation/:path*',
    '/track-order/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
  ],
}
