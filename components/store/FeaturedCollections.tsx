import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FEATURED_COLLECTIONS } from '@/lib/constants/collections'
import { RevealOnScroll } from '@/components/store/RevealOnScroll'

export function FeaturedCollections() {
  return (
    <section className="page-section bg-white">
      <div className="store-container">
        <RevealOnScroll>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-eyebrow">Curated aisles</p>
              <h2 className="section-title mt-3 text-balance">Featured collections</h2>
              <p className="section-subtitle">
                Editorial picks — discover by craving, culture, and what&apos;s moving fast this
                week.
              </p>
            </div>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand-700 no-underline hover:text-brand-800 sm:self-auto"
            >
              View all
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </RevealOnScroll>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_COLLECTIONS.map((col, i) => (
            <RevealOnScroll key={col.id} delay={i * 100}>
              <Link
                href={col.href}
                className="group relative block min-h-[260px] overflow-hidden rounded-xl border border-earth-200/80 no-underline shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
              >
                <Image
                  src={col.image}
                  alt=""
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                  sizes="(max-width:640px) 50vw, 25vw"
                  aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-t from-earth-950/90 via-earth-950/40 to-transparent" />
                <div className="relative flex h-full min-h-[260px] flex-col justify-end p-5">
                  <span className="text-2xl drop-shadow" aria-hidden>
                    {col.emoji}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-semibold text-white">
                    {col.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/80">{col.subtitle}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gold-400 transition-all group-hover:gap-2.5">
                    Shop now <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
