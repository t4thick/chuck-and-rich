import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Heart, ShieldCheck, Store } from 'lucide-react'
import { STORE } from '@/lib/constants/store'

const AUTH_IMAGE =
  'https://images.unsplash.com/photo-1596040035739-62d3p17a625?w=1200&q=80'

type AuthShellProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-cream">
      <div className="grid min-h-[calc(100dvh-4rem)] lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-sand lg:flex lg:flex-col lg:justify-between">
          <Image
            src={AUTH_IMAGE}
            alt=""
            fill
            className="object-cover opacity-90"
            sizes="50vw"
            priority
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-br from-earth-950/80 via-earth-950/50 to-transparent" />
          <div className="relative z-10 p-10 xl:p-14">
            <Link href="/" className="inline-flex items-center gap-2 no-underline">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
                <Store className="h-5 w-5" aria-hidden />
              </span>
              <span className="font-display text-xl font-bold text-white">{STORE.shortName}</span>
            </Link>
            <p className="mt-10 max-w-md font-display text-3xl font-bold leading-tight text-white xl:text-4xl">
              Authentic African & Caribbean groceries
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/85">
              {STORE.tagline}. Family-owned in Columbus — shop online for pickup or delivery.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-4 p-10 xl:p-14">
            {[
              { icon: Heart, label: 'Family-owned' },
              { icon: ShieldCheck, label: 'Secure checkout' },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm"
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:py-14">
          <div className="w-full max-w-md">
            <div className="mb-6 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2 no-underline">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-800 text-white">
                  <Store className="h-4 w-4" aria-hidden />
                </span>
                <span className="font-display text-lg font-bold text-earth-950">{STORE.shortName}</span>
              </Link>
            </div>
            <div className="premium-card p-6 sm:p-8">
              <h1 className="font-display text-2xl font-bold text-earth-950 sm:text-3xl">{title}</h1>
              {subtitle && <p className="mt-2 text-sm text-earth-600 sm:text-base">{subtitle}</p>}
              <div className="mt-6">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
