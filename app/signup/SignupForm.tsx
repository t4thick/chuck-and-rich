'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { mapSignInError, mapSignUpError } from '@/lib/auth/map-auth-error'
import { isPasswordAcceptableForSignup } from '@/lib/auth/password-strength'
import { PasswordField } from '@/components/auth/PasswordField'
import { AuthTrustFooter } from '@/components/auth/AuthTrustFooter'

const HONEYPOT_NAME = 'website'

function normalizePhone(raw: string): string {
  return raw.trim()
}

function isValidOptionalPhone(phone: string): boolean {
  if (!phone) return true
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15
}

export function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextRaw = searchParams.get('next') ?? '/'
  const next = nextRaw.startsWith('/') ? nextRaw : '/'
  const firstRef = useRef<HTMLInputElement>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [marketingOptIn, setMarketingOptIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const enableGoogle = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === '1'

  useEffect(() => {
    firstRef.current?.focus()
  }, [])

  async function handleGoogle() {
    setError('')
    const supabase = createClient()
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const { error: oAuthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (oAuthError) setError(mapSignInError(oAuthError.message))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (honeypot.trim() !== '') {
      setLoading(false)
      setMessage('Check your email to confirm your account, then sign in.')
      return
    }

    if (!termsAccepted) {
      setLoading(false)
      setError('Please accept the Terms and Privacy Policy to continue.')
      return
    }

    const phoneTrim = normalizePhone(phone)
    if (!isValidOptionalPhone(phoneTrim)) {
      setLoading(false)
      setError('Enter a valid phone number, or leave it blank.')
      return
    }

    if (!isPasswordAcceptableForSignup(password)) {
      setLoading(false)
      setError('Use a stronger password: at least 8 characters with upper, lower, number, and special character.')
      return
    }

    const supabase = createClient()
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const termsAt = new Date().toISOString()
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()

    const { error: signError, data } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: fullName,
          phone: phoneTrim || null,
          marketing_opt_in: marketingOptIn,
          terms_accepted_at: termsAt,
        },
      },
    })

    setLoading(false)

    if (signError) {
      setError(mapSignUpError(signError.message))
      return
    }

    if (data.session) {
      router.push(next)
      router.refresh()
      return
    }

    setMessage('Check your email to confirm your account, then sign in. You can close this tab.')
  }

  return (
    <main className="page-shell flex items-center justify-center">
      <div className="panel w-full max-w-md p-8">
        <p className="text-xs uppercase tracking-[0.14em] text-[#c8811a] font-semibold mb-2">New customer</p>
        <h1 className="section-title mb-1">Create your account</h1>
        <p className="section-subtitle mb-2">
          Track orders, save addresses, and check out faster.
        </p>
        <ul className="text-xs text-gray-600 mb-6 space-y-1 list-disc list-inside">
          <li>Order history &amp; tracking</li>
          <li>Faster checkout next time</li>
          <li>Restock alerts (optional)</li>
        </ul>

        {enableGoogle && (
          <>
            <button
              type="button"
              onClick={() => void handleGoogle()}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 font-semibold py-3 rounded-xl text-sm text-gray-800 transition-colors mb-4"
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
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wide">
                <span className="bg-white px-2 text-gray-400">Or register with email</span>
              </div>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="relative space-y-4" noValidate>
          {/* Honeypot — hidden from users; bots often fill this */}
          <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor={HONEYPOT_NAME}>Company website</label>
            <input
              id={HONEYPOT_NAME}
              name={HONEYPOT_NAME}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First name
              </label>
              <input
                ref={firstRef}
                id="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4731]/30"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4731]/30"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
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

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="For delivery updates"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4731]/30"
            />
          </div>

          <PasswordField
            label="Password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            disabled={loading}
            showStrengthMeter
          />

          <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
              className="mt-1 rounded border-gray-300 text-[#1a4731] focus:ring-[#1a4731]"
            />
            <span>Email me deals and restock alerts (optional).</span>
          </label>

          <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 rounded border-gray-300 text-[#1a4731] focus:ring-[#1a4731]"
              required
            />
            <span>
              I agree to the{' '}
              <Link href="/terms" className="text-[#236641] font-semibold hover:underline" target="_blank" rel="noopener noreferrer">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[#236641] font-semibold hover:underline" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="text-sm text-[#236641]" role="status">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a4731] hover:bg-[#236641] text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-[#236641] font-semibold hover:underline">
            Sign in
          </Link>
        </p>

        <AuthTrustFooter className="mt-8 pt-6 border-t border-gray-100" />
      </div>
    </main>
  )
}
