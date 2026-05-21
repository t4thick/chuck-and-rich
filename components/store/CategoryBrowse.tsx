import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CATEGORY_ICONS, PRODUCT_CATEGORIES } from '@/lib/constants/categories'

type CategoryBrowseProps = {
  displayCategories: readonly string[]
  categoryCount: Record<string, number>
}

export function CategoryBrowse({ displayCategories, categoryCount }: CategoryBrowseProps) {
  return (
    <section id="categories" className="page-section bg-white">
      <div className="store-container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-eyebrow">Browse</p>
            <h2 className="section-title mt-2">Shop by category</h2>
            <p className="section-subtitle">From fresh produce to beauty — everything for your table.</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 no-underline hover:text-brand-900"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:gap-4">
          {displayCategories.map((cat) => (
            <Link
              key={cat}
              href={`/shop?category=${encodeURIComponent(cat)}`}
              className="group flex flex-col items-center rounded-3xl border border-earth-200/80 bg-cream p-6 text-center no-underline shadow-sm transition-all hover:border-gold-500/40 hover:bg-white hover:shadow-[var(--shadow-card-hover)]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm transition group-hover:scale-105">
                {CATEGORY_ICONS[cat] ?? '🛒'}
              </span>
              <span className="mt-4 line-clamp-2 text-sm font-semibold text-brand-950 group-hover:text-brand-700">
                {cat}
              </span>
              {(categoryCount[cat] ?? 0) > 0 && (
                <span className="mt-1 text-xs text-earth-500">{categoryCount[cat]} products</span>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {PRODUCT_CATEGORIES.slice(0, 6).map((cat) => (
            <Link
              key={cat}
              href={`/shop?category=${encodeURIComponent(cat)}`}
              className="rounded-full border border-earth-200 bg-white px-4 py-2 text-xs font-medium text-earth-700 no-underline transition hover:border-brand-400 hover:text-brand-800"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
