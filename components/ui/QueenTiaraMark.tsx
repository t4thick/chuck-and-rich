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
      width={385}
      height={182}
      sizes="(max-width: 640px) 72px, 80px"
      className={cn('h-8 w-auto shrink-0 object-contain sm:h-9', className)}
      priority
    />
  )
}
