'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

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
    <main className="min-h-screen bg-[#111a15] flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.14em] text-[#c8811a] font-semibold mb-2">Restricted Area</p>
          <h1 className="text-2xl font-bold text-gray-900">Admin Sign-in</h1>
          <p className="text-gray-500 text-sm mt-1">Lovely Queen African Market</p>
        </div>

        {forbidden && (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-4">
            You need an admin account. Ask the owner to set your profile role to admin in Supabase, or use the legacy password if enabled.
          </p>
        )}

        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode('supabase')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
              mode === 'supabase' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
            }`}
          >
            Email &amp; password
          </button>
          <button
            type="button"
            onClick={() => setMode('legacy')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
              mode === 'legacy' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
            }`}
          >
            Legacy password
          </button>
        </div>

        {mode === 'supabase' ? (
          <form onSubmit={handleSupabase} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a4731]/30 text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a4731]/30 text-gray-800"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a4731] hover:bg-[#236641] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in as admin'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLegacy} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin password</label>
              <input
                type="password"
                value={legacyPassword}
                onChange={(e) => setLegacyPassword(e.target.value)}
                required
                autoFocus
                placeholder="From ADMIN_PASSWORD in .env"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a4731]/30 text-gray-800"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
            >
              {loading ? 'Logging in…' : 'Login with legacy password'}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          <Link href="/" className="hover:text-gray-600">
            Back to store
          </Link>
        </p>
      </div>
    </main>
  )
}
