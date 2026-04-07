import Image from 'next/image'
import Link from 'next/link'

const IMG_MARKET =
  'https://images.unsplash.com/photo-1672363547647-8fad02572412?auto=format&fit=crop&w=2400&q=88'

const IMG_TEXTILE =
  'https://images.unsplash.com/photo-1768212565424-efa3a3852b81?auto=format&fit=crop&w=1800&q=88'

const STORE_MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=1668+E+Dublin+Granville+Rd+Columbus+OH+43229'

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-emerald-900/25">
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={IMG_MARKET}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/48 to-black/28" aria-hidden />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-black/30 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-100 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 shrink-0 rounded-sm bg-amber-300" aria-hidden />
            Columbus African Market
          </span>

          <h1 className="mb-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-xl sm:text-5xl lg:text-[3.25rem]">
            <span className="block">African staples,</span>
            <span className="block text-amber-200">
              fresh finds, and easy delivery.
            </span>
          </h1>

          <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/90">
            Shop pantry essentials, beverages, spices, frozen goods, and fabrics from a Columbus store
            built for African families and anyone craving real flavor.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-amber-400"
            >
              Shop All Products
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href={STORE_MAP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/45 bg-black/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/30"
            >
              Visit the Store
            </Link>
          </div>

          <div className="mt-7 grid max-w-3xl gap-2.5 sm:grid-cols-3">
            {[
              'Located in Karl Plaza',
              '1668 E Dublin Granville Rd, Columbus, OH 43229',
              '(614) 446-0893',
            ].map((detail) => (
              <div
                key={detail}
                className="rounded-xl border border-white/20 bg-black/25 px-3 py-2.5 text-sm font-medium text-white/90 backdrop-blur-sm"
              >
                {detail}
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="mx-auto w-full max-w-[420px]">
            <div className="overflow-hidden rounded-3xl border border-white/25 bg-white/10 shadow-2xl backdrop-blur-sm">
              <div className="relative aspect-[4/5]">
                <Image
                  src={IMG_TEXTILE}
                  alt="African fabric collection at the market"
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 1024px) 420px, 0px"
                />
              </div>
              <div className="border-t border-white/20 bg-black/35 p-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">In-Store Highlights</p>
                <p className="mt-2 text-sm text-white/90">Pantry groceries, spices, frozen foods, drinks, and celebration fabrics.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          <div className="relative h-52 overflow-hidden rounded-2xl border border-white/25 shadow-xl sm:h-60">
            <Image
              src={IMG_TEXTILE}
              alt="African fabric display"
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" aria-hidden />
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">In-Store Highlights</p>
              <p className="mt-1 text-sm font-semibold text-white">Fresh groceries, pantry staples, and authentic flavors.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
