'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { createClient, isSupabaseBrowserConfigured } from '@/lib/supabase/client'

type OrderRow = {
  id: string
  customer_name: string | null
  total_amount: number | null
  created_at: string
}

type Toast = {
  id: string
  customerName: string
  total: number
  shownAt: number
}

const STORAGE_LAST_SEEN = 'lq_admin_last_order_seen'
const STORAGE_SOUND_ON = 'lq_admin_notify_sound'
const TOAST_TTL_MS = 8000

function formatMoney(n: number | null): string {
  if (n == null || Number.isNaN(n)) return '—'
  return `$${Number(n).toFixed(2)}`
}

function playChime() {
  try {
    type AudioContextCtor = typeof AudioContext
    const w = window as unknown as { AudioContext?: AudioContextCtor; webkitAudioContext?: AudioContextCtor }
    const Ctor = w.AudioContext ?? w.webkitAudioContext
    if (!Ctor) return
    const ctx = new Ctor()
    const now = ctx.currentTime
    const tones = [
      { freq: 880, start: now, dur: 0.18 },
      { freq: 1320, start: now + 0.16, dur: 0.22 },
    ]
    for (const t of tones) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = t.freq
      gain.gain.setValueAtTime(0.0001, t.start)
      gain.gain.exponentialRampToValueAtTime(0.18, t.start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t.start + t.dur)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t.start)
      osc.stop(t.start + t.dur + 0.02)
    }
    setTimeout(() => void ctx.close(), 1000)
  } catch { /* ignore */ }
}

function maybeShowSystemNotification(order: OrderRow) {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  if (Notification.permission !== 'granted') return
  try {
    const n = new Notification('New order received', {
      body: `${order.customer_name ?? 'A customer'} placed an order for ${formatMoney(order.total_amount)}.`,
      tag: `order-${order.id}`,
    })
    n.onclick = () => {
      window.focus()
      window.location.href = `/admin/orders/${order.id}`
    }
  } catch { /* ignore */ }
}

export function AdminOrderNotifier() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('unsupported')
  const [soundOn, setSoundOn] = useState(true)
  const lastSeenRef = useRef<number>(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if ('Notification' in window) setPermission(Notification.permission)
    try {
      const stored = localStorage.getItem(STORAGE_LAST_SEEN)
      lastSeenRef.current = stored ? Number(stored) : Date.now()
      const sound = localStorage.getItem(STORAGE_SOUND_ON)
      if (sound !== null) setSoundOn(sound === '1')
    } catch {
      lastSeenRef.current = Date.now()
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseBrowserConfigured()) return
    const supabase = createClient()

    const channel = supabase
      .channel('admin-orders')
      .on<OrderRow>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const row = payload.new
          if (!row?.id) return
          const ts = new Date(row.created_at ?? Date.now()).getTime()
          if (Number.isFinite(ts) && ts <= lastSeenRef.current) return

          lastSeenRef.current = Math.max(lastSeenRef.current, ts)
          try {
            localStorage.setItem(STORAGE_LAST_SEEN, String(lastSeenRef.current))
          } catch { /* ignore */ }

          setToasts((prev) => [{
            id: row.id,
            customerName: row.customer_name ?? 'Customer',
            total: Number(row.total_amount ?? 0),
            shownAt: Date.now(),
          }, ...prev].slice(0, 3))

          let allow = true
          try { allow = localStorage.getItem(STORAGE_SOUND_ON) !== '0' } catch { /* ignore */ }
          if (allow) playChime()
          maybeShowSystemNotification(row)
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (toasts.length === 0) return
    const t = setInterval(() => {
      const now = Date.now()
      setToasts((prev) => prev.filter((x) => now - x.shownAt < TOAST_TTL_MS))
    }, 1000)
    return () => clearInterval(t)
  }, [toasts.length])

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((x) => x.id !== id))
  }

  async function requestPerm() {
    if (typeof window === 'undefined' || !('Notification' in window)) return
    try {
      const result = await Notification.requestPermission()
      setPermission(result)
    } catch { /* ignore */ }
  }

  function toggleSound() {
    setSoundOn((prev) => {
      const next = !prev
      try { localStorage.setItem(STORAGE_SOUND_ON, next ? '1' : '0') } catch { /* ignore */ }
      return next
    })
  }

  return (
    <div>
      <div role="status" aria-live="polite">
        {toasts.map((t) => (
          <p key={t.id}>
            <strong>NEW ORDER:</strong> {t.customerName} · {formatMoney(t.total)} ·{' '}
            <Link href={`/admin/orders/${t.id}`} onClick={() => dismiss(t.id)}>Open</Link>{' '}
            <button type="button" onClick={() => dismiss(t.id)}>Dismiss</button>
          </p>
        ))}
      </div>
      <p className="muted">
        Alerts:{' '}
        {permission === 'default' && <button type="button" onClick={() => void requestPerm()}>Enable browser notifications</button>}
        {permission === 'granted' && <em>browser notifications enabled · </em>}
        <button type="button" onClick={toggleSound}>{soundOn ? 'Mute chime' : 'Unmute chime'}</button>
      </p>
    </div>
  )
}
