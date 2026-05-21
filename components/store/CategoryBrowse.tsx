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
    <section id="categories" className="page-section bg-white">
      <div className="store-container">
        <RevealOnScroll>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-eyebrow">Shop by department</p>
              <h2 className="section-title mt-2">Product categories</h2>
              <p className="section-subtitle">
                Same layout as our partner stores — tap a category to start shopping.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 no-underline hover:text-brand-800"
            >
              View all products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </RevealOnScroll>

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
                    <div className="relative aspect-square overflow-hidden bg-earth-100">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={cat}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-105"
                          sizes="(max-width:640px) 50vw, 20vw"
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center bg-sage">
                          <CategoryIcon category={cat} className="h-12 w-12 text-brand-700" />
                        </span>
                      )}
                    </div>
                    <div className="border-t border-earth-100 px-3 py-3 text-center">
                      <h3 className="line-clamp-2 text-sm font-semibold text-earth-900">{cat}</h3>
                      {count > 0 && (
                        <p className="mt-0.5 text-xs text-earth-500">
                          {count} product{count === 1 ? '' : 's'}
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
          <div className="mt-8 flex flex-wrap justify-center gap-2 border-t border-earth-100 pt-8">
            {PRODUCT_CATEGORIES.filter((c) => (categoryCount[c] ?? 0) > 0)
              .slice(0, 8)
              .map((cat) => (
                <Link
                  key={cat}
                  href={`/shop?category=${encodeURIComponent(cat)}`}
                  className="rounded-md border border-earth-200 bg-sand px-3 py-1.5 text-xs font-medium text-earth-700 no-underline transition hover:border-brand-400 hover:bg-white hover:text-brand-800"
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
