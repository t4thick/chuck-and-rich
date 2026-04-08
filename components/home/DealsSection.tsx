import Link from 'next/link'

export function DealsSection() {
  return (
    <section id="deals" className="border-t border-neutral-200 bg-[#f9f9f9] py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f3d2e]">Save more</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Deals &amp; promotions</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-[#0f3d2e] hover:underline">
            View all products
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Link
            href="/shop"
            className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm transition hover:shadow-lg"
          >
            <span className="inline-flex rounded-full bg-[#f4b400] px-3 py-1 text-xs font-bold text-neutral-900">
              Weekly Deals
            </span>
            <h3 className="mt-4 text-xl font-bold text-neutral-900">Stock up for the week</h3>
            <p className="mt-2 max-w-sm text-sm text-neutral-600">
              Rotating savings on pantry staples and customer favorites.
            </p>
            <span className="mt-6 inline-flex text-sm font-semibold text-[#0f3d2e] group-hover:underline">
              Shop deals →
            </span>
          </Link>
          <Link
            href="/shop"
            className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm transition hover:shadow-lg"
          >
            <span className="inline-flex rounded-full bg-[#0f3d2e] px-3 py-1 text-xs font-bold text-white">
              -20%
            </span>
            <h3 className="mt-4 text-xl font-bold text-neutral-900">Discounted items</h3>
            <p className="mt-2 max-w-sm text-sm text-neutral-600">
              Limited-time markdowns while supplies last — check back often.
            </p>
            <span className="mt-6 inline-flex text-sm font-semibold text-[#0f3d2e] group-hover:underline">
              See discounts →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
