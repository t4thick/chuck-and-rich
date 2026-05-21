import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { STORE } from '@/lib/constants/store'

const HERO_IMAGE =
  'https://asafointernational.com/wp-content/uploads/2025/01/yam-display.jpg'

export function HeroSection() {
  return (
    <section className="border-b border-earth-200 bg-sand">
      <div className="store-container">
        <div className="grid items-center gap-8 py-10 sm:py-12 lg:grid-cols-2 lg:gap-12 lg:py-16">
          <div>
            <p className="animate-fade-up text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
              African &amp; Caribbean grocery · Columbus, OH
            </p>
            <h1 className="animate-fade-up-delay-1 mt-4 font-display text-4xl font-bold leading-tight text-earth-900 sm:text-5xl lg:text-[3rem]">
              Authentic flavors for the meals you cook at home
            </h1>
            <p className="animate-fade-up-delay-2 mt-5 max-w-xl text-lg leading-relaxed text-earth-700">
              {STORE.tagline}. Yams, spices, rice, frozen fish, beauty &amp; pantry staples — one
              place, family-owned.
            </p>

            <div className="animate-fade-up-delay-2 mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="no-underline">
                <Button size="lg" className="h-12 w-full gap-2 sm:w-auto">
                  Shop online
                  <ArrowRight className="h-5 w-5" />
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

            <p className="animate-fade-up-delay-2 mt-6 flex items-start gap-2 text-sm text-earth-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
              <span>{STORE.address}</span>
            </p>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-earth-200 bg-white shadow-[var(--shadow-card)] sm:aspect-[5/4]">
              <Image
                src={HERO_IMAGE}
                alt="Fresh yams and African produce"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-3 sm:absolute sm:-bottom-3 sm:left-4 sm:mt-0">
              <span className="rounded-md border border-earth-200 bg-white px-4 py-2.5 text-sm shadow-sm">
                <span className="font-bold text-brand-700">170+</span>{' '}
                <span className="text-earth-600">products in stock</span>
              </span>
              <span className="rounded-md border border-earth-200 bg-white px-4 py-2.5 text-sm shadow-sm text-earth-700">
                Pickup &amp; delivery
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
