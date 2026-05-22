import Link from 'next/link'
import { Dancing_Script } from 'next/font/google'
import { QueenTiaraMark } from '@/components/ui/QueenTiaraMark'
import { BRAND } from '@/lib/constants/brand'
import { cn } from '@/lib/utils'

const lovelyScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
})

type StoreLogoProps = {
  className?: string
  /** `nav` = header (compact). `footer` = larger with tagline accents. */
  variant?: 'nav' | 'footer'
  linked?: boolean
}

function LogoContent({ variant }: { variant: 'nav' | 'footer' }) {
  const isFooter = variant === 'footer'

  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      <QueenTiaraMark
        uid={isFooter ? 'lq-footer' : 'lq-nav'}
        className={cn(isFooter ? 'w-12 sm:w-14' : undefined)}
      />

      <div className="flex min-w-0 flex-col leading-none">
        {/* Row 1: Lovely (script) + QUEEN */}
        <div className="flex items-baseline gap-1 sm:gap-1.5">
          <span
            className={cn(
              lovelyScript.className,
              'font-bold tracking-normal',
              isFooter ? 'text-[1.65rem] sm:text-[1.85rem]' : 'text-[1.05rem] sm:text-[1.2rem]'
            )}
            style={{ color: BRAND.red }}
          >
            Lovely
          </span>
          <span
            className={cn(
              'font-black uppercase tracking-tight text-[#121212]',
              isFooter ? 'text-base sm:text-lg' : 'text-[0.72rem] sm:text-[0.82rem]'
            )}
          >
            Queen
          </span>
        </div>

        {/* Row 2: AFRICAN MARKET — the hero line from the sign */}
        <p
          className={cn(
            'mt-0.5 font-black uppercase tracking-[0.06em]',
            isFooter ? 'text-sm sm:text-base' : 'text-[0.62rem] sm:text-[0.72rem]'
          )}
        >
          <span style={{ color: BRAND.black }}>African </span>
          <span style={{ color: BRAND.red }}>Market</span>
        </p>

        {isFooter && (
          <div className="mt-2.5 flex items-center gap-2">
            <span className="h-px w-4 shrink-0" style={{ backgroundColor: BRAND.gold }} />
            <span className="h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: BRAND.gold }} />
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-earth-500">
              {BRAND.tagline}
            </p>
            <span className="h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: BRAND.gold }} />
            <span className="h-px w-4 shrink-0" style={{ backgroundColor: BRAND.gold }} />
          </div>
        )}
      </div>
    </div>
  )
}

export function StoreLogo({ className, variant = 'nav', linked = true }: StoreLogoProps) {
  const inner = <LogoContent variant={variant} />

  if (!linked) {
    return <div className={cn('inline-flex shrink-0', className)}>{inner}</div>
  }

  return (
    <Link
      href="/"
      className={cn('inline-flex shrink-0 no-underline transition-opacity duration-150 hover:opacity-90', className)}
      aria-label="Lovely Queen African Market — home"
    >
      {inner}
    </Link>
  )
}
