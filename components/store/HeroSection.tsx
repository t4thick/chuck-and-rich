import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { STORE } from '@/lib/constants/store'

const HERO_BG =
  'https://images.unsplash.com/photo-1596040035739-62d3p17a625?w=1920&q=85'
const HERO_ACCENT =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=85'

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-earth-950">
      <Image
        src={HERO_BG}
        alt=""
        fill
        priority
        className="object-cover opacity-75"
        sizes="100vw"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-earth-950/95 via-earth-950/75 to-earth-950/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-earth-950/80 via-transparent to-earth-950/20" />
      <div className="kente-overlay absolute inset-0 opacity-[0.12]" aria-hidden />

      <div className="store-container relative z-10 flex min-h-[92vh] flex-col justify-center py-16 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="animate-fade-up flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Premium African grocery · Columbus
            </p>
            <h1 className="hero-title animate-fade-up-delay-1 mt-6 text-balance text-white">
              Taste home again — spices, grains &amp; flavors from across Africa
            </h1>
            <p className="animate-fade-up-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">
              {STORE.tagline}. Family-owned, culturally rooted, and built for the meals you cook
              with love — not a generic marketplace.
            </p>

            <div className="animate-fade-up-delay-2 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/shop" className="no-underline">
                <Button
                  size="lg"
                  variant="accent"
                  className="h-12 w-full gap-2 rounded-md px-8 text-base sm:w-auto"
                >
                  Shop groceries
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/shop#categories" className="no-underline">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full rounded-md border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 sm:w-auto"
                >
                  Explore categories
                </Button>
              </Link>
            </div>

            <p className="animate-fade-up-delay-2 mt-8 flex items-center gap-2 text-sm text-white/70">
              <MapPin className="h-4 w-4 shrink-0 text-gold-400" aria-hidden />
              <span>{STORE.address}</span>
            </p>
          </div>

          <div className="relative hidden lg:col-span-5 lg:block">
            <div className="animate-float relative aspect-[4/5] overflow-hidden rounded-xl border border-white/15 shadow-[var(--shadow-float)]">
              <Image
                src={HERO_ACCENT}
                alt="Fresh African market produce"
                fill
                className="object-cover"
                sizes="40vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-earth-950/60 to-transparent" />
            </div>
            <div className="absolute -bottom-4 -left-6 rounded-lg border border-white/20 bg-white/95 px-5 py-4 shadow-[var(--shadow-premium)] backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-700">
                In stock now
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-earth-900">170+ products</p>
              <p className="text-sm text-earth-600">Spices · rice · beauty · more</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
