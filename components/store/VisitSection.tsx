import Link from 'next/link'
import { ArrowRight, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { STORE } from '@/lib/constants/store'
import { RevealOnScroll } from '@/components/store/RevealOnScroll'

export function VisitSection() {
  return (
    <section className="page-section bg-cream">
      <div className="store-container">
        <RevealOnScroll>
          <div className="relative overflow-hidden rounded-[2rem] border border-earth-200/80 bg-white p-8 shadow-[var(--shadow-premium)] sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-100/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent-100/50 blur-3xl" />

            <div className="relative mx-auto max-w-2xl text-center">
              <p className="section-eyebrow">Visit us in Columbus</p>
              <h2 className="section-title mt-3 text-balance">
                Your neighborhood African marketplace
              </h2>
              <p className="section-subtitle mx-auto mt-4">
                Shop online for pickup or delivery — or walk our aisles for the full market experience.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 text-sm text-earth-600 sm:flex-row sm:justify-center sm:gap-6">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-600" aria-hidden />
                  {STORE.address}
                </span>
                <span className="hidden h-4 w-px bg-earth-200 sm:block" aria-hidden />
                <a
                  href={STORE.phoneHref}
                  className="inline-flex items-center gap-2 font-medium text-brand-700 no-underline hover:text-brand-900"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  {STORE.phone}
                </a>
              </div>

              <p className="mt-2 text-sm text-earth-500">{STORE.hours}</p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/shop" className="no-underline">
                  <Button size="lg" variant="accent" className="h-12 w-full min-w-[180px] sm:w-auto">
                    Shop online
                  </Button>
                </Link>
                <a href={STORE.phoneHref} className="no-underline">
                  <Button size="lg" variant="outline" className="h-12 w-full sm:w-auto">
                    Call the store
                  </Button>
                </a>
              </div>

              <Link
                href="/track-order"
                className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 no-underline hover:text-brand-900"
              >
                Track an order <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
