import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChefHat } from 'lucide-react'
import { COOK_TONIGHT_BUNDLES } from '@/lib/constants/collections'
import { Button } from '@/components/ui/button'
import { RevealOnScroll } from '@/components/store/RevealOnScroll'

export function CookTonight() {
  return (
    <section className="page-section bg-cream">
      <div className="store-container">
        <RevealOnScroll>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-brand-700 text-white shadow-[var(--shadow-card)]">
              <ChefHat className="h-7 w-7" aria-hidden />
            </div>
            <div>
              <p className="section-eyebrow">Cook tonight</p>
              <h2 className="section-title mt-1">Shop by the meal you&apos;re making</h2>
            </div>
          </div>
          <p className="section-subtitle mt-4 max-w-3xl">
            Smart grocery discovery — jollof, egusi, weekend snacks. Ingredients only; you bring
            the love in your kitchen.
          </p>
        </RevealOnScroll>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {COOK_TONIGHT_BUNDLES.map((bundle, i) => (
            <RevealOnScroll key={bundle.title} delay={i * 80} className="h-full">
              <Link
                href={bundle.href}
                className="group premium-card premium-card-hover flex h-full flex-col overflow-hidden no-underline"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={bundle.image}
                    alt=""
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width:768px) 100vw, 33vw"
                    aria-hidden
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-earth-950/70 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-md bg-accent-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {bundle.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl font-bold text-earth-900 group-hover:text-brand-700">
                    {bundle.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-earth-600">
                    {bundle.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                    Shop ingredients
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={200}>
          <div className="mt-10 text-center">
            <Link href="/shop" className="no-underline">
              <Button variant="outline" size="lg">
                View all products
              </Button>
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
