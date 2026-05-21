import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SHOP_BY_COUNTRY } from '@/lib/constants/collections'
import { RevealOnScroll } from '@/components/store/RevealOnScroll'

export function ShopByCountry() {
  return (
    <section className="border-y border-earth-200 bg-white py-10 sm:py-12">
      <div className="store-container">
        <RevealOnScroll>
          <p className="section-eyebrow">Shop by culture</p>
          <h2 className="section-title mt-2">Popular across the diaspora</h2>
          <p className="section-subtitle">
            Curated entry points — find ingredients familiar to your kitchen.
          </p>
        </RevealOnScroll>

        <div className="mt-8 -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {SHOP_BY_COUNTRY.map((item, i) => (
            <RevealOnScroll key={item.country} delay={i * 50}>
              <Link
                href={item.href}
                className="group flex shrink-0 items-center gap-3 rounded-lg border border-earth-200 bg-sand px-5 py-4 no-underline transition-all duration-300 hover:border-brand-400 hover:bg-white hover:shadow-[var(--shadow-card-hover)] sm:shrink"
              >
                <span className="text-2xl" aria-hidden>
                  {item.flag}
                </span>
                <div>
                  <p className="font-display text-lg font-bold text-earth-900 group-hover:text-brand-700">
                    {item.country}
                  </p>
                  <p className="text-xs text-earth-500">{item.label}</p>
                </div>
                <ArrowRight className="ml-2 h-4 w-4 text-earth-400 transition group-hover:translate-x-0.5 group-hover:text-brand-700" />
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
