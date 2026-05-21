import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PRODUCT_CATEGORIES } from '@/lib/constants/categories'
import { CategoryIcon } from '@/components/store/CategoryIcon'
import { RevealOnScroll } from '@/components/store/RevealOnScroll'

type CategoryBrowseProps = {
  displayCategories: readonly string[]
  categoryCount: Record<string, number>
}

export function CategoryBrowse({ displayCategories, categoryCount }: CategoryBrowseProps) {
  return (
    <section id="categories" className="page-section bg-white">
      <div className="store-container">
        <RevealOnScroll>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-eyebrow">Start here</p>
              <h2 className="section-title mt-2">Shop by category</h2>
              <p className="section-subtitle">
                From spices to frozen fish — everything for your kitchen.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 no-underline hover:text-brand-900"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {displayCategories.map((cat, i) => (
            <RevealOnScroll key={cat} delay={i * 50}>
              <Link
                href={`/shop?category=${encodeURIComponent(cat)}`}
                className="group premium-card premium-card-hover flex flex-col items-center p-6 text-center no-underline"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand shadow-inner transition duration-300 group-hover:scale-105 group-hover:bg-brand-50">
                  <CategoryIcon category={cat} className="h-7 w-7" />
                </span>
                <span className="mt-4 line-clamp-2 text-sm font-semibold text-earth-950 group-hover:text-brand-800">
                  {cat}
                </span>
                {(categoryCount[cat] ?? 0) > 0 && (
                  <span className="mt-1 text-xs text-earth-500">{categoryCount[cat]} products</span>
                )}
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={100}>
          <div className="mt-10 flex flex-wrap justify-center gap-2 sm:justify-start">
            {PRODUCT_CATEGORIES.slice(0, 6).map((cat) => (
              <Link
                key={cat}
                href={`/shop?category=${encodeURIComponent(cat)}`}
                className="rounded-full border border-earth-200 bg-cream px-4 py-2 text-xs font-medium text-earth-700 no-underline transition hover:border-brand-300 hover:bg-white hover:text-brand-800"
              >
                {cat}
              </Link>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
