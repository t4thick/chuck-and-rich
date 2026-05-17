'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient, isSupabaseBrowserConfigured } from '@/lib/supabase/client'

export type AddressRow = {
  id: string
  user_id: string
  label: string | null
  full_name: string
  phone: string | null
  line1: string
  line2: string | null
  city: string
  state: string
  country: string
  postal_code: string
  is_default: boolean
  created_at: string
  updated_at: string
}

type Draft = {
  id?: string
  label: string
  full_name: string
  phone: string
  line1: string
  line2: string
  city: string
  state: string
  country: string
  postal_code: string
  is_default: boolean
}

const empty: Draft = {
  label: '',
  full_name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  country: 'United States',
  postal_code: '',
  is_default: false,
}

const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Mexico']

export function AddressesManager({ userId, initial }: { userId: string; initial: AddressRow[] }) {
  const router = useRouter()
  const [addresses, setAddresses] = useState(initial)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function startNew() {
    setDraft({ ...empty })
    setError('')
  }

  function startEdit(a: AddressRow) {
    setDraft({
      id: a.id,
      label: a.label ?? '',
      full_name: a.full_name,
      phone: a.phone ?? '',
      line1: a.line1,
      line2: a.line2 ?? '',
      city: a.city,
      state: a.state,
      country: a.country,
      postal_code: a.postal_code,
      is_default: a.is_default,
    })
    setError('')
  }

  function cancel() {
    setDraft(null)
    setError('')
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!draft) return
    if (!isSupabaseBrowserConfigured()) {
      setError('Saving is temporarily unavailable.')
      return
    }
    setSaving(true)
    setError('')
    const supabase = createClient()

    const row = {
      user_id: userId,
      label: draft.label.trim() || null,
      full_name: draft.full_name.trim(),
      phone: draft.phone.trim() || null,
      line1: draft.line1.trim(),
      line2: draft.line2.trim() || null,
      city: draft.city.trim(),
      state: draft.state.trim(),
      country: draft.country.trim(),
      postal_code: draft.postal_code.trim(),
      is_default: draft.is_default,
    }

    if (draft.is_default) {
      await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId)
    }

    if (draft.id) {
      const { data, error: upErr } = await supabase
        .from('addresses')
        .update(row)
        .eq('id', draft.id)
        .eq('user_id', userId)
        .select()
        .single()
      if (upErr) { setError(upErr.message); setSaving(false); return }
      setAddresses((prev) => prev.map((a) => (a.id === draft.id ? (data as AddressRow) : a)))
    } else {
      const { data, error: insErr } = await supabase
        .from('addresses')
        .insert(row)
        .select()
        .single()
      if (insErr) { setError(insErr.message); setSaving(false); return }
      setAddresses((prev) => [data as AddressRow, ...prev])
    }
    setDraft(null)
    setSaving(false)
    router.refresh()
  }

  async function remove(id: string) {
    if (!confirm('Delete this address?')) return
    if (!isSupabaseBrowserConfigured()) return
    const supabase = createClient()
    const { error: delErr } = await supabase.from('addresses').delete().eq('id', id).eq('user_id', userId)
    if (delErr) { setError(delErr.message); return }
    setAddresses((prev) => prev.filter((a) => a.id !== id))
    router.refresh()
  }

  async function makeDefault(id: string) {
    if (!isSupabaseBrowserConfigured()) return
    const supabase = createClient()
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId)
    const { error: upErr } = await supabase.from('addresses').update({ is_default: true }).eq('id', id).eq('user_id', userId)
    if (upErr) { setError(upErr.message); return }
    setAddresses((prev) => prev.map((a) => ({ ...a, is_default: a.id === id })))
    router.refresh()
  }

  return (
    <div className="stack">
      {error && <p className="error">{error}</p>}

      {addresses.length === 0 ? (
        <p>No saved addresses yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Default</th>
              <th>Label</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((a) => (
              <tr key={a.id}>
                <td>{a.is_default ? '★' : ''}</td>
                <td>{a.label || '—'}</td>
                <td>
                  <strong>{a.full_name}</strong><br />
                  {a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />
                  {a.city}, {a.state} {a.postal_code}<br />
                  {a.country}
                  {a.phone && <><br /><span className="muted">{a.phone}</span></>}
                </td>
                <td>
                  <button type="button" onClick={() => startEdit(a)}>Edit</button>{' '}
                  {!a.is_default && <button type="button" onClick={() => void makeDefault(a.id)}>Make default</button>}{' '}
                  <button type="button" onClick={() => void remove(a.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!draft && <button type="button" onClick={startNew}>+ Add address</button>}

      {draft && (
        <form onSubmit={save} className="stack">
          <h3>{draft.id ? 'Edit address' : 'New address'}</h3>
          <p><label>Label (optional): <input type="text" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} /></label></p>
          <p><label>Full name: <input type="text" value={draft.full_name} onChange={(e) => setDraft({ ...draft, full_name: e.target.value })} required autoComplete="name" /></label></p>
          <p><label>Phone (optional): <input type="tel" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} autoComplete="tel" /></label></p>
          <p><label>Street: <input type="text" value={draft.line1} onChange={(e) => setDraft({ ...draft, line1: e.target.value })} required autoComplete="address-line1" /></label></p>
          <p><label>Apt/Suite: <input type="text" value={draft.line2} onChange={(e) => setDraft({ ...draft, line2: e.target.value })} autoComplete="address-line2" /></label></p>
          <p><label>City: <input type="text" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} required autoComplete="address-level2" /></label></p>
          <p><label>State: <input type="text" value={draft.state} onChange={(e) => setDraft({ ...draft, state: e.target.value })} required autoComplete="address-level1" /></label></p>
          <p>
            <label>
              Country:{' '}
              <select value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })}>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </p>
          <p><label>ZIP: <input type="text" value={draft.postal_code} onChange={(e) => setDraft({ ...draft, postal_code: e.target.value })} required autoComplete="postal-code" /></label></p>
          <p>
            <label>
              <input type="checkbox" checked={draft.is_default} onChange={(e) => setDraft({ ...draft, is_default: e.target.checked })} />{' '}
              Set as default
            </label>
          </p>
          <div className="row">
            <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save address'}</button>
            <button type="button" onClick={cancel}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  )
}
