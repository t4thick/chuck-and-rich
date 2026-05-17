'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { createClient, isSupabaseBrowserConfigured } from '@/lib/supabase/client'
import { useClientSearchParams } from '@/lib/hooks/use-client-search-params'
import { mapSignInError } from '@/lib/auth/map-auth-error'
import { PasswordField } from '@/components/auth/PasswordField'

const REMEMBER_EMAIL_KEY = 'lq_remember_email'

export function LoginForm() {
  const router = useRouter()
  const { next, error: err } = useClientSearchParams()
  const emailRef = useRef<HTMLInputElement>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberDevice, setRememberDevice] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_EMAIL_KEY)
      if (saved) setEmail(saved)
    } catch { /* ignore */ }
    emailRef.current?.focus()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isSupabaseBrowserConfigured()) {
      setError('Sign-in is temporarily unavailable.')
      return
    }
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
      if (rememberDevice) localStorage.setItem(REMEMBER_EMAIL_KEY, trimmed)
      else localStorage.removeItem(REMEMBER_EMAIL_KEY)
    } catch { /* ignore */ }
    router.push(next)
    router.refresh()
  }

  return (
    <div className="stack">
      <h2>Sign in</h2>

      {err === 'auth' && <p className="error">That link expired or was already used. Sign in below or reset your password.</p>}
      {err === 'configuration' && <p className="error">Sign-in is temporarily unavailable.</p>}

      <form onSubmit={handleSubmit} className="stack">
        <p>
          <label>
            Email:<br />
            <input
              ref={emailRef}
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </p>

        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          disabled={loading}
        />

        <p>
          <label>
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
            />{' '}
            Remember my email on this device
          </label>
        </p>

        {error && <p className="error" role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p>
        <Link href={`/forgot-password?next=${encodeURIComponent(next)}`}>Forgot password?</Link>
      </p>
      <p>
        New here? <Link href={`/signup?next=${encodeURIComponent(next)}`}>Create an account</Link>
      </p>
    </div>
  )
}
