import Link from 'next/link'
import { createClientOptional } from '@/lib/supabase/server'

export async function AccountCtaSection() {
  const supabase = await createClientOptional()
  const user = supabase
    ? (await supabase.auth.getUser()).data.user
    : null

  if (user) {
    const firstName =
      String(user.user_metadata?.first_name ?? user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'there')
        .trim()
        .split(/\s+/)[0]

    return (
      <section className="border-t border-neutral-200 bg-white py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-gradient-to-br from-[#f4ede1] to-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f3d2e]">Welcome back</p>
              <h2 className="mt-1 text-lg font-bold text-neutral-900 sm:text-xl">
                Hi {firstName} — pick up where you left off
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                Your saved details and order history are ready in your account.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/account"
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#0f3d2e] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#164d3b]"
              >
                My account
              </Link>
              <Link
                href="/track-order"
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#0f3d2e] shadow-sm transition hover:border-[#0f3d2e]/40 hover:bg-neutral-50"
              >
                Track an order
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="border-t border-neutral-200 bg-white py-12 md:py-14">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-[#f9f9f9] p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f3d2e]">New here?</p>
            <h2 className="mt-2 text-xl font-bold text-neutral-900">Create an account</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-neutral-600 list-disc list-inside">
              <li>Faster checkout</li>
              <li>Track orders &amp; delivery</li>
              <li>Optional deals &amp; restock alerts</li>
            </ul>
            <Link
              href="/signup"
              className="mt-5 inline-flex min-h-[44px] items-center rounded-xl bg-[#0f3d2e] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#164d3b]"
            >
              Create account
            </Link>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f3d2e]">Returning customer?</p>
            <h2 className="mt-2 text-xl font-bold text-neutral-900">Sign in</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-neutral-600 list-disc list-inside">
              <li>View order history</li>
              <li>Manage your details</li>
              <li>Pick up where you left off</li>
            </ul>
            <Link
              href="/login"
              className="mt-5 inline-flex min-h-[44px] items-center rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#0f3d2e] shadow-sm transition hover:border-[#0f3d2e]/40 hover:bg-neutral-50"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
