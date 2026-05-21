import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChefHat } from 'lucide-react'
import { COOK_TONIGHT_BUNDLES } from '@/lib/constants/collections'
import { Button } from '@/components/ui/button'
import { RevealOnScroll } from '@/components/store/RevealOnScroll'

export function CookTonight() {
  return (
    <section className="page-section relative overflow-hidden bg-sand">
      <div
        className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-accent-200/30 blur-3xl"
        aria-hidden
      />
      <div className="store-container relative">
        <RevealOnScroll>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="section-eyebrow">Cook tonight</p>
              <h2 className="section-title mt-3 max-w-2xl text-balance">
                Shop by the meal you&apos;re making
              </h2>
              <p className="section-subtitle">
                Curated ingredient bundles — jollof, egusi, weekend snacks. You bring the kitchen
                love.
              </p>
            </div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white shadow-[var(--shadow-elev)]">
              <ChefHat className="h-7 w-7" aria-hidden />
            </div>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {COOK_TONIGHT_BUNDLES.map((bundle, i) => (
            <RevealOnScroll key={bundle.title} delay={i * 100} className="h-full">
              <Link
                href={bundle.href}
                className="group premium-card premium-card-hover flex h-full flex-col overflow-hidden no-underline"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={bundle.image}
                    alt=""
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                    sizes="(max-width:768px) 100vw, 33vw"
                    aria-hidden
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-earth-950/75 via-earth-950/30 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-accent-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                    {bundle.tag}
                  </span>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-display text-2xl font-semibold text-white">
                      {bundle.title}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="flex-1 text-sm leading-relaxed text-earth-600">
                    {bundle.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                    Shop ingredients
                    <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={200}>
          <div className="mt-12 text-center">
            <Link href="/shop" className="no-underline">
              <Button variant="outline" size="lg" className="border-earth-300">
                View all products
              </Button>
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
