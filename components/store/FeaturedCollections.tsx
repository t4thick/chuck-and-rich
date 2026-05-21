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
          <p className="section-eyebrow">Curated aisles</p>
          <h2 className="section-title mt-2">Featured collections</h2>
          <p className="section-subtitle">
            Editorial picks — discover by craving, culture, and what&apos;s moving fast this week.
          </p>
        </RevealOnScroll>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_COLLECTIONS.map((col, i) => (
            <RevealOnScroll key={col.id} delay={i * 70}>
              <Link
                href={col.href}
                className="group premium-card premium-card-hover relative block min-h-[220px] overflow-hidden no-underline"
              >
                <Image
                  src={col.image}
                  alt=""
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width:640px) 50vw, 25vw"
                  aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-t from-earth-950/90 via-earth-950/35 to-transparent" />
                <div className="relative flex h-full min-h-[220px] flex-col justify-end p-5">
                  <span className="text-xl" aria-hidden>
                    {col.emoji}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-bold text-white">{col.title}</h3>
                  <p className="mt-1 text-xs text-white/75">{col.subtitle}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold-400 transition-all group-hover:gap-2">
                    Shop <ArrowRight className="h-3.5 w-3.5" />
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
