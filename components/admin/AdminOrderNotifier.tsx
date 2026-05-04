'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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
const SHORT_ID_LEN = 8
const TOAST_TTL_MS = 8000

function formatMoney(n: number | null): string {
  if (n == null || Number.isNaN(n)) return '—'
  return `$${Number(n).toFixed(2)}`
}

/**
 * Plays a brief two-note chime via WebAudio (no MP3 to ship).
 * Failures are silent — autoplay is sometimes blocked until first interaction.
 */
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
  } catch {
    /* ignore */
  }
}

function maybeShowSystemNotification(order: OrderRow) {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  if (Notification.permission !== 'granted') return
  try {
    const title = 'New order received'
    const body = `${order.customer_name ?? 'A customer'} placed an order for ${formatMoney(order.total_amount)}.`
    const n = new Notification(title, { body, tag: `order-${order.id}` })
    n.onclick = () => {
      window.focus()
      window.location.href = `/admin/orders/${order.id}`
    }
  } catch {
    /* ignore */
  }
}

export function AdminOrderNotifier() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('unsupported')
  const [soundOn, setSoundOn] = useState(true)
  const lastSeenRef = useRef<number>(0)
  const channelKeyRef = useRef(0)

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
    const supabase = createClient()
    const myKey = ++channelKeyRef.current

    const channel = supabase
      .channel(`admin-orders-${myKey}`)
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
          } catch {
            /* ignore */
          }

          const toast: Toast = {
            id: row.id,
            customerName: row.customer_name ?? 'Customer',
            total: Number(row.total_amount ?? 0),
            shownAt: Date.now(),
          }
          setToasts((prev) => [toast, ...prev].slice(0, 3))

          let allowSound = true
          try {
            allowSound = localStorage.getItem(STORAGE_SOUND_ON) !== '0'
          } catch {
            /* ignore */
          }
          if (allowSound) playChime()
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
    const timer = setInterval(() => {
      const now = Date.now()
      setToasts((prev) => prev.filter((t) => now - t.shownAt < TOAST_TTL_MS))
    }, 1000)
    return () => clearInterval(timer)
  }, [toasts.length])

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  async function requestNotificationPermission() {
    if (typeof window === 'undefined' || !('Notification' in window)) return
    try {
      const result = await Notification.requestPermission()
      setPermission(result)
    } catch {
      /* ignore */
    }
  }

  function toggleSound() {
    setSoundOn((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_SOUND_ON, next ? '1' : '0')
      } catch {
        /* ignore */
      }
      return next
    })
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto w-full max-w-md rounded-2xl border border-emerald-200 bg-white shadow-xl shadow-emerald-900/10 ring-1 ring-emerald-200 animate-[lq-slide-in_180ms_ease-out]"
          >
            <div className="flex items-start gap-3 p-4">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1a4731] text-white font-bold">
                $
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900">New order</p>
                <p className="text-sm text-gray-600 truncate">
                  {t.customerName} · {formatMoney(t.total)}
                </p>
                <div className="mt-2 flex gap-2">
                  <Link
                    href={`/admin/orders/${t.id}`}
                    className="inline-flex items-center justify-center rounded-lg bg-[#1a4731] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#236641]"
                    onClick={() => dismiss(t.id)}
                  >
                    Open order #{t.id.slice(0, SHORT_ID_LEN)}
                  </Link>
                  <button
                    type="button"
                    onClick={() => dismiss(t.id)}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-4 right-4 z-[55] hidden md:flex flex-col gap-2 items-end">
        {permission === 'default' && (
          <button
            type="button"
            onClick={() => void requestNotificationPermission()}
            className="rounded-full bg-[#1a4731] text-white text-xs font-semibold px-4 py-2 shadow-lg shadow-emerald-900/20 hover:bg-[#236641]"
          >
            Enable order alerts
          </button>
        )}
        <button
          type="button"
          onClick={toggleSound}
          className={`rounded-full text-xs font-semibold px-4 py-2 shadow-lg border ${
            soundOn
              ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              : 'bg-gray-800 text-white border-gray-800 hover:bg-gray-900'
          }`}
          aria-pressed={!soundOn}
          title={soundOn ? 'Mute new-order chime' : 'Unmute new-order chime'}
        >
          {soundOn ? '🔔 Sound on' : '🔕 Muted'}
        </button>
      </div>

      <style jsx global>{`
        @keyframes lq-slide-in {
          from { transform: translateY(-12px); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>
    </>
  )
}
