import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Heart, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { STORE } from '@/lib/constants/store'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1596040035739-62d3p17a625?w=1920&q=85'

const HERO_ACCENT =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-sand">
      <div className="store-container">
        <div className="grid min-h-[88vh] items-center gap-10 py-12 lg:grid-cols-12 lg:gap-12 lg:py-16">
          {/* Copy */}
          <div className="relative z-10 lg:col-span-5 xl:col-span-5">
            <p className="section-eyebrow animate-fade-up flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Premium Afrocentric grocery · Columbus, OH
            </p>
            <h1 className="animate-fade-up-delay-1 mt-5 font-display text-[2.5rem] font-bold leading-[1.05] text-earth-950 sm:text-5xl lg:text-[3.25rem] xl:text-6xl">
              The modern African marketplace
            </h1>
            <p className="animate-fade-up-delay-2 mt-6 max-w-lg text-lg leading-relaxed text-earth-700 sm:text-xl">
              {STORE.tagline}. Spices, rice, frozen fish & pantry staples — authentic ingredients
              for the meals you cook at home.
            </p>

            <div className="animate-fade-up-delay-2 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/shop" className="no-underline">
                <Button
                  size="lg"
                  variant="accent"
                  className="h-12 w-full min-w-[200px] gap-2 rounded-xl px-8 text-base shadow-[var(--shadow-card-hover)] sm:w-auto"
                >
                  Shop groceries
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/shop#categories" className="no-underline">
                <Button size="lg" variant="outline" className="h-12 w-full rounded-xl sm:w-auto">
                  Browse categories
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {[
                { icon: Heart, label: 'Family-owned' },
                { icon: ShieldCheck, label: 'Secure checkout' },
                { icon: Truck, label: 'Pickup & delivery' },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-earth-200/80 bg-white/80 px-4 py-2 text-xs font-semibold text-earth-700 shadow-sm backdrop-blur-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-brand-600" aria-hidden />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Cinematic imagery */}
          <div className="relative lg:col-span-7 xl:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[var(--shadow-float)] sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src={HERO_IMAGE}
                alt="Colorful African spices and dry goods at a market stall"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-earth-950/50 via-transparent to-transparent" />
            </div>

            {/* Floating accent card */}
            <div className="animate-float absolute -bottom-4 -left-2 z-10 hidden w-44 overflow-hidden rounded-2xl border border-white/60 shadow-[var(--shadow-premium)] sm:block lg:-left-8 lg:w-52">
              <div className="relative aspect-square">
                <Image
                  src={HERO_ACCENT}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="208px"
                  aria-hidden
                />
              </div>
              <p className="bg-white px-3 py-2 text-xs font-semibold text-earth-800">
                Fresh produce & pantry staples
              </p>
            </div>

            {/* Floating stat card */}
            <div className="absolute -right-2 top-8 z-10 hidden rounded-2xl border border-earth-200/80 bg-white/95 p-4 shadow-[var(--shadow-premium)] backdrop-blur-md sm:block lg:-right-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent-600">
                Authentic
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-earth-950">West African</p>
              <p className="text-sm text-earth-600">& Caribbean groceries</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
