import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FEATURED_COLLECTIONS } from '@/lib/constants/collections'
import { cn } from '@/lib/utils'

export function FeaturedCollections() {
  return (
    <section className="page-section bg-cream">
      <div className="store-container">
        <p className="section-eyebrow">Curated for you</p>
        <h2 className="section-title mt-2">Featured collections</h2>
        <p className="section-subtitle">Discover by culture, craving, and what&apos;s trending in our aisles.</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_COLLECTIONS.map((col) => (
            <Link
              key={col.id}
              href={col.href}
              className="group relative overflow-hidden rounded-3xl no-underline shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div
                className={cn(
                  'flex min-h-[200px] flex-col justify-end bg-gradient-to-br p-6 sm:min-h-[220px]',
                  col.gradient
                )}
              >
                <span className="text-3xl" aria-hidden>
                  {col.emoji}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold text-white">{col.title}</h3>
                <p className="mt-1 text-sm text-white/80">{col.subtitle}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-400 group-hover:gap-2 transition-all">
                  Shop collection <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
