import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CategoryIcon } from '@/components/store/CategoryIcon'
import { getCategoryImage } from '@/lib/constants/category-images'
import { PRODUCT_CATEGORIES } from '@/lib/constants/categories'
import { RevealOnScroll } from '@/components/store/RevealOnScroll'

type CategoryBrowseProps = {
  displayCategories: readonly string[]
  categoryCount: Record<string, number>
}

export function CategoryBrowse({ displayCategories, categoryCount }: CategoryBrowseProps) {
  return (
    <section id="categories" className="page-section grain-bg bg-white">
      <div className="store-container">
        <RevealOnScroll>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-eyebrow">Shop by department</p>
              <h2 className="section-title mt-3">Everything for your kitchen</h2>
              <p className="section-subtitle">
                Browse 170+ products across spices, rice, frozen, beauty, and more — the same
                departments you know from a full African market.
              </p>
            </div>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand-700 no-underline hover:text-brand-800 sm:self-auto"
            >
              View all products
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </RevealOnScroll>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
          {displayCategories.map((cat, i) => {
            const imageUrl = getCategoryImage(cat)
            const count = categoryCount[cat] ?? 0

            return (
              <RevealOnScroll key={cat} delay={i * 40}>
                <li>
                  <Link
                    href={`/shop?category=${encodeURIComponent(cat)}`}
                    className="asafo-category-tile group block no-underline"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-earth-100 to-earth-200">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={cat}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-110"
                          sizes="(max-width:640px) 50vw, 20vw"
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center bg-sage">
                          <CategoryIcon category={cat} className="h-12 w-12 text-brand-700" />
                        </span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-earth-950/30 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                      <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-700 opacity-0 shadow-md transition duration-500 group-hover:opacity-100">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <div className="border-t border-earth-100 px-3 py-3 text-center">
                      <h3 className="line-clamp-1 text-sm font-semibold text-earth-900 transition group-hover:text-brand-700">
                        {cat}
                      </h3>
                      {count > 0 && (
                        <p className="mt-0.5 text-[11px] text-earth-500">
                          {count} item{count === 1 ? '' : 's'}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              </RevealOnScroll>
            )
          })}
        </ul>

        <RevealOnScroll delay={80}>
          <div className="mt-10 flex flex-wrap justify-center gap-2 border-t border-earth-100 pt-8">
            {PRODUCT_CATEGORIES.filter((c) => (categoryCount[c] ?? 0) > 0)
              .slice(0, 8)
              .map((cat) => (
                <Link
                  key={cat}
                  href={`/shop?category=${encodeURIComponent(cat)}`}
                  className="rounded-full border border-earth-200 bg-white px-3.5 py-1.5 text-xs font-medium text-earth-700 no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-800 hover:shadow-sm"
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
