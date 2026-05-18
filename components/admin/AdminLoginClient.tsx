'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient, isSupabaseBrowserConfigured } from '@/lib/supabase/client'

export function AdminLoginClient({
  allowSupabaseAdmin,
  forbidden,
}: {
  allowSupabaseAdmin: boolean
  forbidden: boolean
}) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [staffPassword, setStaffPassword] = useState('')
  const [mode, setMode] = useState<'staff' | 'supabase'>(allowSupabaseAdmin ? 'staff' : 'staff')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSupabase(e: React.FormEvent) {
    e.preventDefault()
    if (!isSupabaseBrowserConfigured()) {
      setError('Admin sign-in is temporarily unavailable.')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: signError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setLoading(false)
    if (signError) {
      setError(signError.message)
      return
    }
    router.push('/admin')
    router.refresh()
  }

  async function handleStaffPassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ password: staffPassword }),
    })
    setLoading(false)
    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      const msg =
        res.status === 503
          ? typeof data.error === 'string'
            ? `${data.error} If this is a Preview deployment, add ADMIN_PASSWORD for the Preview environment in Vercel (Production-only vars are invisible there).`
            : 'Admin login is not configured on this deployment. Preview URLs need ADMIN_PASSWORD under Vercel → Settings → Environment Variables → Preview.'
          : typeof data.error === 'string'
            ? data.error
            : 'Invalid password.'
      setError(msg)
    }
  }

  return (
    <div className="stack">
      <h2>Staff admin</h2>
      <p className="muted">
        This URL is not linked from the public storefront. Bookmark <strong>/admin/login</strong>.
        Sign in with your deployment’s <code>ADMIN_PASSWORD</code>.
      </p>

      {forbidden && (
        <p className="error">
          {allowSupabaseAdmin
            ? 'Access denied. Enter the correct staff password or use an authorized Supabase admin account.'
            : 'Access denied. Staff password only — sign in below.'}
        </p>
      )}

      {!allowSupabaseAdmin && (
        <p className="muted">
          Supabase “role=admin” bypass is <strong>disabled</strong>. To enable it for emergencies, set{' '}
          <code>ADMIN_ALLOW_SUPABASE_ROLE=1</code> on the server (then redeploy).
        </p>
      )}

      {allowSupabaseAdmin && (
        <p>
          Method:{' '}
          <label>
            <input type="radio" checked={mode === 'staff'} onChange={() => setMode('staff')} /> Staff password
          </label>{' '}
          <label>
            <input type="radio" checked={mode === 'supabase'} onChange={() => setMode('supabase')} /> Supabase admin
          </label>
        </p>
      )}

      {allowSupabaseAdmin && mode === 'supabase' ? (
        <form onSubmit={handleSupabase} className="stack">
          <p>
            <label>
              Email:
              <br />
              <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
          </p>
          <p>
            <label>
              Password:
              <br />
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </p>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleStaffPassword} className="stack">
          <p>
            <label>
              Staff password:
              <br />
              <input
                type="password"
                autoComplete="current-password"
                required
                autoFocus
                value={staffPassword}
                onChange={(e) => setStaffPassword(e.target.value)}
              />
            </label>
          </p>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      )}

      <p>
        <Link href="/">← Back to store</Link>
      </p>
    </div>
  )
}
