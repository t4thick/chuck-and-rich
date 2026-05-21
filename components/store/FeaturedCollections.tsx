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
          <p className="section-eyebrow">Curated for you</p>
          <h2 className="section-title mt-2">Featured collections</h2>
          <p className="section-subtitle">
            Discover by culture, craving, and what&apos;s trending in our aisles.
          </p>
        </RevealOnScroll>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_COLLECTIONS.map((col, i) => (
            <RevealOnScroll key={col.id} delay={i * 70}>
              <Link
                href={col.href}
                className="group premium-card premium-card-hover relative block min-h-[240px] no-underline"
              >
                <Image
                  src={col.image}
                  alt=""
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width:640px) 100vw, 25vw"
                  aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-t from-earth-950/90 via-earth-950/40 to-earth-950/10" />
                <div className="relative flex h-full min-h-[240px] flex-col justify-end p-6">
                  <span className="text-2xl" aria-hidden>
                    {col.emoji}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-bold text-white">{col.title}</h3>
                  <p className="mt-1 text-sm text-white/75">{col.subtitle}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-400 transition-all group-hover:gap-2">
                    Shop collection <ArrowRight className="h-4 w-4" />
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
