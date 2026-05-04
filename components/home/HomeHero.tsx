import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types'

/**
 * Pulls a small selection of real, in-stock products to drive the hero — a
 * featured product on the right, plus a row of three thumbnails ("Trending
 * today"). Falls back to a friendly placeholder when the DB is unreachable.
 */
async function loadHeroProducts(): Promise<{ featured: Product | null; trending: Product[] }> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('id, name, category, price, image_url, in_stock')
      .eq('in_stock', true)
      .not('image_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(40)

    const rows = (data ?? []) as Product[]
    if (rows.length === 0) return { featured: null, trending: [] }

    const seed = new Date().toISOString().slice(0, 10) // rotates daily, stable per day
    const seeded = [...rows].sort((a, b) => {
      const ka = (a.id + seed).length + a.id.charCodeAt(0)
      const kb = (b.id + seed).length + b.id.charCodeAt(0)
      return ka - kb
    })

    const [featured, ...rest] = seeded
    return { featured: featured ?? null, trending: rest.slice(0, 3) }
  } catch {
    return { featured: null, trending: [] }
  }
}

export async function HomeHero() {
  const { featured, trending } = await loadHeroProducts()

  return (
    <section className="border-b border-neutral-200/80 bg-gradient-to-br from-[#fdfcf8] via-white to-[#f5f1e6]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:gap-12 md:py-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:py-20">
        <div className="order-2 lg:order-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f3d2e]/80">
            Columbus · African &amp; Caribbean grocery
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.5rem]">
            Authentic African groceries,
            <br className="hidden sm:block" />
            <span className="text-[#0f3d2e]"> delivered to your door.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-600">
            Pantry staples, spices, fresh meat and seafood, and the cultural essentials your kitchen
            already loves — packed and shipped from our Columbus store.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#0f3d2e] px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#0c3024] hover:shadow-lg"
            >
              Shop now
            </Link>
            <a
              href="#categories"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-neutral-300 bg-white px-7 py-3 text-sm font-semibold text-neutral-800 shadow-sm transition hover:border-[#0f3d2e]/40 hover:text-[#0f3d2e]"
            >
              Browse categories
            </a>
          </div>

          {trending.length > 0 && (
            <div className="mt-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Trending today
              </p>
              <ul className="grid grid-cols-3 gap-3 sm:max-w-md">
                {trending.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.id}`}
                      className="group block overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="relative aspect-square w-full bg-neutral-50">
                        {product.image_url && (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            sizes="(min-width: 1024px) 110px, 30vw"
                            className="object-contain p-2 transition duration-300 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <p className="px-2 pb-2 pt-1 text-[11px] font-semibold leading-tight text-neutral-700 line-clamp-2">
                        ${product.price.toFixed(2)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative">
            {/* Decorative bg accent */}
            <div
              aria-hidden
              className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-[#c8811a]/15 via-transparent to-[#0f3d2e]/15 blur-2xl"
            />

            {featured ? (
              <Link
                href={`/products/${featured.id}`}
                className="group relative block overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-xl transition hover:shadow-2xl"
              >
                <div className="relative aspect-[4/5] w-full bg-neutral-50 sm:aspect-[4/3] md:aspect-[5/4]">
                  {featured.image_url && (
                    <Image
                      src={featured.image_url}
                      alt={featured.name}
                      fill
                      priority
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-contain p-6 transition duration-500 group-hover:scale-[1.03]"
                    />
                  )}
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#c8811a] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    Today’s pick
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-neutral-100 p-4 md:p-5">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                      {featured.category}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-bold text-neutral-900 md:text-base">
                      {featured.name}
                    </p>
                  </div>
                  <p className="shrink-0 rounded-lg bg-[#0f3d2e] px-3 py-1.5 text-sm font-extrabold text-white">
                    ${featured.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-xl">
                <div className="relative aspect-[5/4] w-full bg-gradient-to-br from-[#f4ede1] to-[#e8d9b9]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-sm font-semibold text-[#0f3d2e]">Lovely Queen African Market</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-neutral-700">
                    Real product photography lights up here once your shop has stock.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
