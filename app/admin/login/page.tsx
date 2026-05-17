'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient, isSupabaseBrowserConfigured } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const forbidden = searchParams.get('error') === 'forbidden'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [legacyPassword, setLegacyPassword] = useState('')
  const [mode, setMode] = useState<'supabase' | 'legacy'>('supabase')
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

  async function handleLegacy(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: legacyPassword }),
    })
    setLoading(false)
    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Invalid password.')
    }
  }

  return (
    <div className="stack">
      <h2>Admin sign-in</h2>

      {forbidden && (
        <p className="error">
          You need an admin account. Ask the owner to set your profile role to admin in Supabase, or use the legacy password if enabled.
        </p>
      )}

      <p>
        Mode:{' '}
        <label><input type="radio" checked={mode === 'supabase'} onChange={() => setMode('supabase')} /> Email & password</label>{' '}
        <label><input type="radio" checked={mode === 'legacy'} onChange={() => setMode('legacy')} /> Legacy password</label>
      </p>

      {mode === 'supabase' ? (
        <form onSubmit={handleSupabase} className="stack">
          <p><label>Email:<br /><input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></label></p>
          <p><label>Password:<br /><input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label></p>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in as admin'}</button>
        </form>
      ) : (
        <form onSubmit={handleLegacy} className="stack">
          <p>
            <label>
              Admin password (ADMIN_PASSWORD env):<br />
              <input type="password" value={legacyPassword} onChange={(e) => setLegacyPassword(e.target.value)} required autoFocus />
            </label>
          </p>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? 'Logging in…' : 'Login with legacy password'}</button>
        </form>
      )}

      <p><Link href="/">← Back to store</Link></p>
    </div>
  )
}
