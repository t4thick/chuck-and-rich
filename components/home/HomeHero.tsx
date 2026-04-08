import Image from 'next/image'
import Link from 'next/link'

/** Bright, food-focused photography (grocery / African staples) */
const HERO_FOOD =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=85'

const HERO_SIDE =
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=85'

export function HomeHero() {
  return (
    <section className="border-b border-neutral-200/80 bg-[#f9f9f9]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:gap-12 md:py-16 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-20">
        <div className="order-2 lg:order-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f3d2e]/80">
            Columbus · African &amp; Caribbean grocery
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.35rem]">
            Authentic African Groceries Delivered to Your Door
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-600">
            Shop pantry staples, spices, meats, and cultural essentials with fast delivery
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#0f3d2e] px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#0c3024] hover:shadow-lg"
            >
              Shop Now
            </Link>
            <a
              href="#categories"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-neutral-300 bg-white px-7 py-3 text-sm font-semibold text-neutral-800 shadow-sm transition hover:border-[#0f3d2e]/40 hover:text-[#0f3d2e]"
            >
              Browse Categories
            </a>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-xl">
            <div className="relative aspect-[4/3] w-full md:aspect-[16/11]">
              <Image
                src={HERO_FOOD}
                alt="African groceries — rice, produce, and pantry staples"
                fill
                priority
                className="object-cover object-center"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-black/10" aria-hidden />
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-neutral-100 p-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src={HERO_SIDE}
                  alt="Rice and grains"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                />
              </div>
              <div className="flex flex-col justify-center rounded-xl bg-[#f9f9f9] p-4">
                <p className="text-xs font-semibold text-[#0f3d2e]">Fresh picks</p>
                <p className="mt-1 text-sm font-medium text-neutral-800">
                  Staples your kitchen uses every week — in stock and ready to ship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
