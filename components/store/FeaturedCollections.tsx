import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FEATURED_COLLECTIONS } from '@/lib/constants/collections'

export function FeaturedCollections() {
  return (
    <section className="page-section bg-earth-50">
      <div className="store-container">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Featured</h2>
            <p className="section-subtitle">Promotions and curated picks.</p>
          </div>
          <Link
            href="/shop"
            className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand-700 no-underline hover:text-brand-800"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_COLLECTIONS.map((col) => (
            <Link
              key={col.id}
              href={col.href}
              className="group relative block aspect-[4/3] overflow-hidden rounded-xl border border-earth-200 bg-white shadow-[var(--shadow-card)] no-underline transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[var(--shadow-card-hover)]"
            >
              <Image
                src={col.image}
                alt=""
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                sizes="(max-width:640px) 100vw, 25vw"
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-t from-earth-950/80 via-earth-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="text-base font-semibold text-white">{col.title}</h3>
                <p className="mt-0.5 text-xs text-white/80">{col.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
