import Link from 'next/link'
import { ArrowRight, ChefHat } from 'lucide-react'
import { COOK_TONIGHT_BUNDLES } from '@/lib/constants/collections'
import { Button } from '@/components/ui/button'

export function CookTonight() {
  return (
    <section className="page-section african-texture border-y border-earth-200 bg-cream-dark">
      <div className="store-container">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-600 text-white">
            <ChefHat className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <p className="section-eyebrow">Cook tonight</p>
            <h2 className="section-title mt-1">Everything for one perfect meal</h2>
          </div>
        </div>
        <p className="section-subtitle mt-3">
          Curated bundles to get dinner on the table — jollof, egusi, fufu & more.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {COOK_TONIGHT_BUNDLES.map((bundle) => (
            <Link
              key={bundle.title}
              href={bundle.href}
              className="group flex flex-col rounded-3xl border border-earth-200/80 bg-white p-6 no-underline shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
            >
              <span className="w-fit rounded-full bg-gold-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-earth-800">
                {bundle.tag}
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-brand-950 group-hover:text-brand-700">
                {bundle.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-earth-600">{bundle.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-600">
                Shop ingredients <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/shop" className="no-underline">
            <Button variant="outline" size="lg">
              Browse all products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
