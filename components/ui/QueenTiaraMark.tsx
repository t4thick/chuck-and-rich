import Image from 'next/image'
import { cn } from '@/lib/utils'

type QueenTiaraMarkProps = {
  className?: string
  /** Kept for API compat when multiple marks render on one page. */
  uid?: string
}

/**
 * Official Lovely Queen tiara — extracted from the real in-store / Facebook logo.
 * Raster PNG so heart filigree and side scrolls match the sign exactly at web sizes.
 */
export function QueenTiaraMark({ className }: QueenTiaraMarkProps) {
  return (
    <Image
      src="/brand/crown-mark.png"
      alt=""
      width={440}
      height={390}
      sizes="(max-width: 640px) 42px, 52px"
      className={cn('h-auto w-[2.625rem] shrink-0 object-contain sm:w-[3.125rem]', className)}
      priority
    />
  )
}
