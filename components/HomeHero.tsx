import Image from 'next/image'
import Link from 'next/link'

const IMG_MARKET =
  'https://images.unsplash.com/photo-1672363547647-8fad02572412?auto=format&fit=crop&w=2400&q=88'

const IMG_TEXTILE =
  'https://images.unsplash.com/photo-1768212565424-efa3a3852b81?auto=format&fit=crop&w=1800&q=88'

const STORE_MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=1668+E+Dublin+Granville+Rd+Columbus+OH+43229'

const TEXTILE_SLIDES = [
  {
    position: 'object-[34%_52%]',
    title: 'Celebration fabrics',
    caption: 'Bold color, woven texture, and statement prints.',
  },
  {
    position: 'object-[62%_42%]',
    title: 'Heritage looks',
    caption: 'Premium cloth selections with rich African character.',
  },
  {
    position: 'object-[48%_60%]',
    title: 'Cultural style',
    caption: 'Textiles and market energy layered into the brand story.',
  },
]

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-emerald-950/40 min-h-[min(92vh,56rem)]">
      {/* Full-bleed interior market photography */}
      <div className="absolute inset-0 home-hero-ken" aria-hidden>
        <Image
          src={IMG_MARKET}
          alt=""
          fill
          priority
          className="object-cover object-center scale-110 max-md:object-[center_32%]"
          sizes="100vw"
        />
      </div>

      {/* ── Readability + brand wash ── */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#041510]/95 via-[#0d3d2f]/88 to-[#0a2820]/75"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#041510]/98 via-[#0d3d2f]/62 to-transparent md:from-[#041510]/96 md:via-[#0d3d2f]/42"
        aria-hidden
      />

      {/* Kente-inspired geometric veil (very subtle) */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              105deg,
              transparent,
              transparent 12px,
              rgba(232, 160, 32, 0.5) 12px,
              rgba(232, 160, 32, 0.5) 14px,
              transparent 14px,
              transparent 40px,
              rgba(34, 197, 94, 0.35) 40px,
              rgba(34, 197, 94, 0.35) 42px
            )
          `,
        }}
        aria-hidden
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-soft-light pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      {/* Warm light pools */}
      <div
        className="absolute -top-32 -right-20 w-[min(100vw,32rem)] h-[min(100vw,32rem)] rounded-full bg-amber-500/20 blur-[100px] home-hero-glow pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-emerald-400/10 blur-[90px] home-hero-glow pointer-events-none [animation-delay:-3s]"
        aria-hidden
      />

      {/* Slow gold sweep */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden
      >
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent home-hero-shimmer" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 py-16 sm:py-20 lg:py-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 border border-amber-400/55 text-amber-200 text-[11px] font-semibold px-3 py-1.5 rounded-full mb-7 tracking-[0.14em] uppercase shadow-[0_0_24px_rgba(232,160,32,0.15)] backdrop-blur-sm bg-black/10">
            <span className="w-1.5 h-1.5 rounded-sm bg-amber-400 shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.9)]" aria-hidden />
            Columbus African Market
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.35rem] xl:text-6xl font-extrabold leading-[1.08] tracking-tight mb-6 drop-shadow-[0_2px_28px_rgba(0,0,0,0.35)]">
            <span className="block text-white">African staples,</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-300">
              market energy, and home delivery.
            </span>
          </h1>

          <p className="text-lg text-white/92 max-w-xl mb-10 leading-relaxed drop-shadow-md">
            Shop pantry essentials, beverages, spices, frozen goods, and celebration fabrics from a Columbus store
            built for African families and anyone craving real flavor.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold px-8 py-4 rounded-xl text-base transition-all shadow-[0_8px_30px_rgba(217,119,6,0.45)] hover:shadow-[0_12px_36px_rgba(245,158,11,0.5)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Shop All Products
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href={STORE_MAP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-amber-300/70 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl text-base transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
            >
              Visit the Store
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 max-w-3xl">
            {[
              'Located in Karl Plaza',
              '1668 E Dublin Granville Rd, Columbus, OH 43229',
              '(614) 446-0893',
            ].map((detail) => (
              <div
                key={detail}
                className="rounded-xl border border-white/12 bg-black/18 backdrop-blur-sm px-4 py-3 text-sm font-medium text-white/88 shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
              >
                {detail}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold tracking-wide uppercase">
            {['Garri & flour', 'Malt & soft drinks', 'Spices & pantry', 'Store pickup available'].map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-amber-300/25 bg-white/8 px-3 py-1.5 text-amber-100/90 backdrop-blur-sm"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* Sliding textile feature */}
        <div className="relative hidden lg:block min-h-[22rem]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full max-w-[430px] aspect-[4/5] home-hero-kente-primary">
              <div className="absolute -top-4 -left-4 h-28 w-28 rounded-3xl border border-amber-300/35" aria-hidden />
              <div className="absolute -bottom-5 -right-6 h-32 w-32 rounded-full border border-white/15" aria-hidden />

              <div
                className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.55)] ring-2 ring-white/15 bg-[#081710]"
              >
                {TEXTILE_SLIDES.map((slide, index) => (
                  <div
                    key={slide.title}
                    className="absolute inset-0 home-hero-slide"
                    style={{ animationDelay: `${index * 5}s` }}
                  >
                    <Image
                      src={IMG_TEXTILE}
                      alt={slide.title}
                      fill
                      className={`object-cover ${slide.position}`}
                      sizes="(min-width: 1024px) 430px, 0px"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-[#041510]/90 via-[#041510]/18 to-amber-300/12"
                      aria-hidden
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-amber-200/90 mb-2">Fabric Feature</p>
                      <p className="text-2xl font-bold text-white">{slide.title}</p>
                      <p className="text-sm text-white/72 mt-2 max-w-xs">{slide.caption}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="absolute -bottom-6 -left-6 w-[78%] rounded-2xl border border-white/12 bg-[#0a241c]/90 backdrop-blur-md p-5 shadow-[0_20px_50px_rgba(0,0,0,0.45)] home-hero-kente-secondary"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-amber-200/80 mb-3">What people come for</p>
                <div className="grid grid-cols-2 gap-3 text-sm text-white/85">
                  {[
                    'Pantry & groceries',
                    'African spices',
                    'Frozen foods',
                    'Celebration fabrics',
                  ].map((item) => (
                    <div key={item} className="rounded-xl bg-white/5 px-3 py-3">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile textile strip */}
        <div className="lg:col-span-2 lg:hidden mt-4 -mb-2">
          <div className="relative h-52 sm:h-60 rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <Image
              src={IMG_TEXTILE}
              alt="African textiles and celebration fabrics"
              fill
              className="object-cover object-[center_40%]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#041510]/90 via-[#0d3d2f]/20 to-transparent" aria-hidden />
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-xs font-semibold text-amber-200/90 tracking-wide uppercase">Fabrics in motion</p>
              <p className="text-white text-sm font-semibold mt-1">Culture, color, and market energy built into the brand.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
