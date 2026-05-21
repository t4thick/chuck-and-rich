import Link from 'next/link'
import { ArrowRight, ShoppingBasket } from 'lucide-react'
import { COOK_TONIGHT_BUNDLES } from '@/lib/constants/collections'
import { Button } from '@/components/ui/button'
import { RevealOnScroll } from '@/components/store/RevealOnScroll'

export function CookTonight() {
  return (
    <section className="page-section border-y border-earth-200/80 bg-cream">
      <div className="store-container">
        <RevealOnScroll>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-600 text-white shadow-[var(--shadow-card)]">
              <ShoppingBasket className="h-7 w-7" aria-hidden />
            </div>
            <div>
              <p className="section-eyebrow">Cook this tonight</p>
              <h2 className="section-title mt-1">Ingredient bundles for your favorite dishes</h2>
            </div>
          </div>
          <p className="section-subtitle mt-4 max-w-3xl">
            Smart grocery groupings — jollof, egusi, fufu & more. You cook at home; we stock the
            pantry.
          </p>
        </RevealOnScroll>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {COOK_TONIGHT_BUNDLES.map((bundle, i) => (
            <RevealOnScroll key={bundle.title} delay={i * 80} className="h-full">
              <Link
                href={bundle.href}
                className="group premium-card premium-card-hover flex h-full flex-col p-6 no-underline"
              >
                <span className="w-fit rounded-full bg-gold-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-earth-800">
                  {bundle.tag}
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-earth-950 group-hover:text-brand-800">
                  {bundle.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-earth-600">
                  {bundle.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent-600">
                  Shop ingredients{' '}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={200}>
          <div className="mt-10 text-center">
            <Link href="/shop" className="no-underline">
              <Button variant="outline" size="lg" className="rounded-xl">
                Browse all products
              </Button>
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
