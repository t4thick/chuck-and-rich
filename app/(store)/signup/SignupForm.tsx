'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { createClient, isSupabaseBrowserConfigured } from '@/lib/supabase/client'
import { useClientSearchParams } from '@/lib/hooks/use-client-search-params'
import { mapSignUpError } from '@/lib/auth/map-auth-error'
import { isPasswordAcceptableForSignup } from '@/lib/auth/password-strength'
import { PasswordField } from '@/components/auth/PasswordField'
import { getAuthSiteOrigin } from '@/lib/site-url-client'

function isValidOptionalPhone(phone: string): boolean {
  if (!phone) return true
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15
}

export function SignupForm() {
  const router = useRouter()
  const { next } = useClientSearchParams()
  const firstRef = useRef<HTMLInputElement>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [marketingOptIn, setMarketingOptIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    firstRef.current?.focus()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isSupabaseBrowserConfigured()) {
      setError('Sign-up is temporarily unavailable.')
      return
    }
    setLoading(true)
    setError('')
    setMessage('')

    if (!termsAccepted) {
      setLoading(false)
      setError('Please accept the Terms and Privacy Policy.')
      return
    }
    if (!isValidOptionalPhone(phone.trim())) {
      setLoading(false)
      setError('Enter a valid phone number, or leave it blank.')
      return
    }
    if (!isPasswordAcceptableForSignup(password)) {
      setLoading(false)
      setError('Use a stronger password (8+ chars, upper, lower, number, special).')
      return
    }

    const supabase = createClient()
    const origin = getAuthSiteOrigin()
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
          phone: phone.trim() || null,
          marketing_opt_in: marketingOptIn,
          terms_accepted_at: new Date().toISOString(),
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

    setMessage('Check your email to confirm your account, then sign in.')
  }

  return (
    <div className="stack">
      <h2>Create account</h2>

      <form onSubmit={handleSubmit} className="stack" noValidate>
        <p>
          <label>
            First name:<br />
            <input
              ref={firstRef}
              type="text"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
        </p>
        <p>
          <label>
            Last name:<br />
            <input
              type="text"
              autoComplete="family-name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
        </p>
        <p>
          <label>
            Email:<br />
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </p>
        <p>
          <label>
            Phone (optional):<br />
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
        </p>

        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          disabled={loading}
          showStrengthMeter
        />

        <p>
          <label>
            <input
              type="checkbox"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
            />{' '}
            Email me deals and restock alerts (optional)
          </label>
        </p>

        <p>
          <label>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
            />{' '}
            I agree to the <Link href="/terms" target="_blank">Terms</Link> and{' '}
            <Link href="/privacy" target="_blank">Privacy Policy</Link>
          </label>
        </p>

        {error && <p className="error" role="alert">{error}</p>}
        {message && <p className="success" role="status">{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p>
        Already have an account?{' '}
        <Link href={`/login?next=${encodeURIComponent(next)}`}>Sign in</Link>
      </p>
    </div>
  )
}
