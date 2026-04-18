'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { mapSignInError } from '@/lib/auth/map-auth-error'
import { PasswordField } from '@/components/auth/PasswordField'
import { AuthTrustFooter } from '@/components/auth/AuthTrustFooter'
import { getAuthSiteOrigin } from '@/lib/site-url-client'

const REMEMBER_EMAIL_KEY = 'lq_remember_email'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextRaw = searchParams.get('next') ?? '/'
  const next = nextRaw.startsWith('/') ? nextRaw : '/'
  const err = searchParams.get('error')
  const emailRef = useRef<HTMLInputElement>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberDevice, setRememberDevice] = useState(true)
  const [magicOpen, setMagicOpen] = useState(false)
  const [magicLoading, setMagicLoading] = useState(false)
  const [magicMessage, setMagicMessage] = useState('')

  const enableGoogle = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === '1'

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_EMAIL_KEY)
      if (saved) setEmail(saved)
    } catch {
      /* ignore */
    }
    emailRef.current?.focus()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const trimmed = email.trim()
    const { error: signError } = await supabase.auth.signInWithPassword({
      email: trimmed,
      password,
    })
    setLoading(false)
    if (signError) {
      setError(mapSignInError(signError.message))
      return
    }
    try {
      if (rememberDevice) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, trimmed)
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY)
      }
    } catch {
      /* ignore */
    }
    router.push(next)
    router.refresh()
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) {
      setError('Enter your email to receive a sign-in link.')
      return
    }
    setMagicLoading(true)
    setMagicMessage('')
    setError('')
    const supabase = createClient()
    const origin = getAuthSiteOrigin()
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    setMagicLoading(false)
    if (otpError) {
      setError(mapSignInError(otpError.message))
      return
    }
    setMagicMessage('If an account exists for that email, we sent a sign-in link. Check your inbox.')
  }

  async function handleGoogle() {
    setError('')
    const supabase = createClient()
    const origin = getAuthSiteOrigin()
    const { error: oAuthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (oAuthError) setError(mapSignInError(oAuthError.message))
  }

  return (
    <main className="page-shell flex items-center justify-center">
      <div className="panel w-full max-w-md p-8">
        <p className="text-xs uppercase tracking-[0.14em] text-[#c8811a] font-semibold mb-2">Welcome back</p>
        <h1 className="section-title mb-1">Sign in</h1>
        <p className="section-subtitle mb-6">Manage orders, addresses, and checkout faster.</p>

        {err === 'auth' && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4" role="alert">
            Email link expired or invalid. Try again or sign in with your password.
          </p>
        )}
        {err === 'configuration' && (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-4" role="alert">
            Sign-in is temporarily unavailable. Please try again later or contact support.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4731]/30"
            />
          </div>

          <PasswordField
            label="Password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            disabled={loading}
          />

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="rounded border-gray-300 text-[#1a4731] focus:ring-[#1a4731]"
            />
            Remember me on this device
          </label>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a4731] hover:bg-[#236641] text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {enableGoogle && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wide">
                <span className="bg-white px-2 text-gray-400">Or</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleGoogle()}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 font-semibold py-3 rounded-xl text-sm text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </>
        )}

        <p className="text-center mt-4">
          <button
            type="button"
            className="text-sm text-[#236641] font-semibold hover:underline"
            onClick={() => setMagicOpen((o) => !o)}
            aria-expanded={magicOpen}
          >
            {magicOpen ? 'Hide email sign-in link' : 'Email me a sign-in link instead'}
          </button>
        </p>

        {magicOpen && (
          <form onSubmit={handleMagicLink} className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
            <p className="text-xs text-gray-600">We’ll send a one-time link to your email. Same address as above.</p>
            {magicMessage ? (
              <p className="text-sm text-[#236641]">{magicMessage}</p>
            ) : (
              <button
                type="submit"
                disabled={magicLoading}
                className="w-full bg-white border border-gray-200 hover:bg-gray-50 font-semibold py-2.5 rounded-xl text-sm disabled:opacity-60"
              >
                {magicLoading ? 'Sending…' : 'Send sign-in link'}
              </button>
            )}
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href={`/forgot-password?next=${encodeURIComponent(next)}`} className="text-[#236641] font-medium hover:underline">
            Forgot password?
          </Link>
        </p>
        <p className="text-center text-sm text-gray-500 mt-3">
          New here?{' '}
          <Link href={`/signup?next=${encodeURIComponent(next)}`} className="text-[#236641] font-semibold hover:underline">
            Create an account
          </Link>
        </p>

        <AuthTrustFooter className="mt-8 pt-6 border-t border-gray-100" />
      </div>
    </main>
  )
}
