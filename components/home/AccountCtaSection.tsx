import Link from 'next/link'

export function AccountCtaSection() {
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
              className="mt-5 inline-flex rounded-xl bg-[#0f3d2e] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#164d3b]"
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
              className="mt-5 inline-flex rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#0f3d2e] shadow-sm transition hover:border-[#0f3d2e]/40 hover:bg-neutral-50"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
