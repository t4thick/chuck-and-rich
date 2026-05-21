import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin, Sparkles, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { STORE } from '@/lib/constants/store'

const HERO_IMAGE =
  'https://asafointernational.com/wp-content/uploads/2025/01/yam-display.jpg'
const HERO_ACCENT =
  'https://asafointernational.com/wp-content/uploads/2025/01/Carribean-Display-min-420x420.png'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-earth-200 bg-sand">
      <div
        className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-brand-200/40 blur-3xl animate-blob-drift"
        aria-hidden
      />
      <div
        className="absolute -bottom-32 right-0 h-[26rem] w-[26rem] rounded-full bg-accent-200/35 blur-3xl animate-blob-drift"
        style={{ animationDelay: '-6s' }}
        aria-hidden
      />
      <div className="kente-overlay absolute inset-0 opacity-30" aria-hidden />

      <div className="store-container relative">
        <div className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:gap-14 lg:py-20">
          <div className="lg:col-span-6">
            <p className="animate-fade-up section-eyebrow">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Premium African &amp; Caribbean grocery
            </p>
            <h1 className="hero-title animate-fade-up-delay-1 mt-5 text-balance text-[2.5rem] text-earth-900 sm:text-[3.5rem] lg:text-[4rem]">
              Authentic flavors
              <br />
              <span className="text-brand-700">for the meals you love.</span>
            </h1>
            <p className="animate-fade-up-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-earth-700 sm:text-xl">
              {STORE.tagline}. Yams, spices, rice, frozen fish &amp; pantry staples — one
              family-owned store, delivered with care.
            </p>

            <div className="animate-fade-up-delay-2 mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="no-underline">
                <Button size="lg" className="btn-shine h-12 w-full gap-2 px-7 sm:w-auto">
                  Shop online
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/shop#categories" className="no-underline">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full border-earth-300 sm:w-auto"
                >
                  Browse categories
                </Button>
              </Link>
            </div>

            <div className="animate-fade-up-delay-2 mt-8 flex flex-col gap-3 text-sm text-earth-600 sm:flex-row sm:items-center sm:gap-6">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
                <span>{STORE.address}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="flex gap-0.5 text-gold-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </span>
                <span className="font-semibold text-earth-700">Loved by Columbus families</span>
              </p>
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative">
              <div className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-earth-200 bg-white shadow-[var(--shadow-premium)]">
                <Image
                  src={HERO_IMAGE}
                  alt="Fresh yams and African produce at Lovely Queen"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-earth-950/15 via-transparent to-transparent" />
              </div>

              <div
                className="animate-float absolute -bottom-6 -left-4 hidden w-44 overflow-hidden rounded-xl border border-earth-200 bg-white shadow-[var(--shadow-float)] sm:block lg:-left-8"
                style={{ animationDelay: '-1s' }}
              >
                <div className="relative aspect-square">
                  <Image
                    src={HERO_ACCENT}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="176px"
                    aria-hidden
                  />
                </div>
                <p className="px-3 py-2 text-xs font-semibold text-earth-800">
                  Caribbean &amp; West African
                </p>
              </div>

              <div className="absolute -right-3 top-6 hidden rounded-xl border border-earth-200 bg-white/95 px-4 py-3 shadow-[var(--shadow-card-hover)] backdrop-blur-md sm:block lg:-right-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-700">
                  In stock now
                </p>
                <p className="mt-1 font-display text-2xl font-semibold text-earth-900">170+</p>
                <p className="text-xs text-earth-600">products &amp; growing</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-earth-200/60 py-5 sm:py-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-center sm:grid-cols-4">
            {[
              { stat: '170+', label: 'Products in stock' },
              { stat: '14', label: 'Departments' },
              { stat: '100%', label: 'Family-owned' },
              { stat: 'OH', label: 'Columbus, Ohio' },
            ].map((item, i) => (
              <div key={item.label} className="animate-fade-up" style={{ animationDelay: `${0.3 + i * 0.05}s` }}>
                <p className="font-display text-2xl font-semibold text-earth-900 sm:text-3xl">
                  {item.stat}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-earth-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
