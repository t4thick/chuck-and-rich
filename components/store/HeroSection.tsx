import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { STORE } from '@/lib/constants/store'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1920&q=85'

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden sm:min-h-[90vh]">
      <Image
        src={HERO_IMAGE}
        alt="Colorful African spices and fresh groceries"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-earth-950/92 via-brand-950/75 to-brand-900/40" />
      <div className="african-texture absolute inset-0 opacity-30 mix-blend-overlay" />

      <div className="store-container relative flex min-h-[85vh] flex-col justify-center py-16 sm:min-h-[90vh] sm:py-24">
        <div className="max-w-2xl animate-fade-up">
          <p className="section-eyebrow flex items-center gap-2 text-gold-400">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Modern African marketplace · Columbus, OH
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Taste home anywhere
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/90 sm:text-xl">
            {STORE.tagline}. Curated African & Caribbean groceries — premium quality, family warmth,
            delivered to your door or ready for pickup.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/shop" className="no-underline">
              <Button size="lg" variant="accent" className="h-12 w-full min-w-[180px] gap-2 px-8 text-base sm:w-auto">
                Shop groceries
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/shop#categories" className="no-underline">
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 sm:w-auto"
              >
                Explore categories
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-cream/70">
            Family-owned · Secure checkout · {STORE.hours}
          </p>
        </div>
      </div>
    </section>
  )
}
