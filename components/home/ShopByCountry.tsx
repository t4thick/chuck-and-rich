import Image from 'next/image'
import Link from 'next/link'

const REGIONS = [
  {
    name: 'Ghana',
    flag: '🇬🇭',
    href: '/shop?q=Ghana',
    image:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=85',
    blurb: 'Ingredients & favorites',
  },
  {
    name: 'Nigeria',
    flag: '🇳🇬',
    href: '/shop?q=Nigeria',
    image:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80',
    blurb: 'Pantry & seasonings',
  },
  {
    name: 'Caribbean',
    flag: '🌴',
    href: '/shop?category=Caribbean%20product',
    image:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
    blurb: 'Island flavors',
  },
] as const

export function ShopByCountry() {
  return (
    <section id="shop-by-country" className="border-t border-neutral-200 bg-white py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f3d2e]">Shop by region</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Explore flavors</h2>
          <p className="mt-2 text-neutral-600">Browse picks inspired by communities we serve.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {REGIONS.map((r) => (
            <Link
              key={r.name}
              href={r.href}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={r.image}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 640px) 33vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="text-2xl drop-shadow">{r.flag}</p>
                  <p className="mt-1 text-lg font-bold drop-shadow-sm">{r.name}</p>
                  <p className="text-sm text-white/90">{r.blurb}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
