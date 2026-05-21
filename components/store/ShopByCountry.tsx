import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SHOP_BY_COUNTRY } from '@/lib/constants/collections'
import { RevealOnScroll } from '@/components/store/RevealOnScroll'

export function ShopByCountry() {
  return (
    <section className="border-y border-earth-200 bg-white py-12 sm:py-14">
      <div className="store-container">
        <RevealOnScroll>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-eyebrow">Shop by culture</p>
              <h2 className="section-title mt-3">Popular across the diaspora</h2>
              <p className="section-subtitle">
                Curated entry points — find the ingredients familiar to your kitchen.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        <div className="mt-10 -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {SHOP_BY_COUNTRY.map((item, i) => (
            <RevealOnScroll key={item.country} delay={i * 70}>
              <Link
                href={item.href}
                className="group flex h-full shrink-0 items-center gap-4 rounded-xl border border-earth-200/80 bg-gradient-to-br from-white to-sand px-5 py-4 no-underline shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-1 hover:border-brand-400 hover:shadow-[var(--shadow-card-hover)] sm:shrink"
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow-[var(--shadow-soft)] transition group-hover:scale-110"
                  aria-hidden
                >
                  {item.flag}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg font-semibold text-earth-900 group-hover:text-brand-700">
                    {item.country}
                  </p>
                  <p className="text-xs text-earth-500">{item.label}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-earth-400 transition group-hover:translate-x-1 group-hover:text-brand-700" />
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
