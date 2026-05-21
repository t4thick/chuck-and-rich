import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { STORE } from '@/lib/constants/store'

const HERO_IMAGE =
  'https://asafointernational.com/wp-content/uploads/2025/01/yam-display.jpg'

export function HeroSection() {
  return (
    <section className="border-b border-earth-200 bg-sage">
      <div className="store-container">
        <div className="grid items-center gap-8 py-10 lg:grid-cols-2 lg:gap-12 lg:py-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
              African &amp; Caribbean grocery · Columbus, OH
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-earth-900 sm:text-5xl lg:text-[3.25rem]">
              Your source for authentic African &amp; Caribbean products
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-earth-700">
              {STORE.tagline}. Save time shopping for yams, spices, rice, frozen fish, and
              pantry staples in one convenient place.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="no-underline">
                <Button size="lg" className="h-12 w-full gap-2 rounded-md px-8 sm:w-auto">
                  Shop online
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/shop#categories" className="no-underline">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full rounded-md border-earth-300 sm:w-auto"
                >
                  Browse categories
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-earth-200 shadow-[var(--shadow-card)] lg:aspect-[5/4]">
            <Image
              src={HERO_IMAGE}
              alt="Fresh yams and African produce"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
