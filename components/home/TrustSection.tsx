const ITEMS = [
  { icon: '🚚', title: 'Fast Delivery', copy: 'Reliable shipping options at checkout.' },
  { icon: '🌍', title: 'Authentic African Products', copy: 'Curated pantry and cultural essentials.' },
  { icon: '🔒', title: 'Secure Payments', copy: 'Checkout with confidence.' },
  { icon: '⭐', title: 'Customer Satisfaction', copy: 'We’re here if you need help with your order.' },
] as const

export function TrustSection() {
  return (
    <section id="trust" className="border-t border-neutral-200 bg-white py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f3d2e]">Why shop here</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Shop with confidence</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-neutral-200 bg-[#f9f9f9] p-6 shadow-sm transition hover:shadow-md"
            >
              <span className="text-2xl" aria-hidden>
                {item.icon}
              </span>
              <h3 className="mt-3 font-semibold text-neutral-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
