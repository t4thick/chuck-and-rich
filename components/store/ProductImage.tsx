'use client'

import Image from 'next/image'
import { Package } from 'lucide-react'
import { cn } from '@/lib/utils'

type ProductImageProps = {
  src: string | null
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
  framed?: boolean
}

export function ProductImage({
  src,
  alt,
  className,
  sizes = '(max-width:640px) 50vw, 25vw',
  priority,
  framed = true,
}: ProductImageProps) {
  if (!src?.trim()) {
    return (
      <div
        className={cn(
          framed ? 'product-image-frame' : 'flex aspect-square items-center justify-center bg-sand',
          className
        )}
        aria-hidden
      >
        <Package className="h-10 w-10 text-brand-400/60 sm:h-12 sm:w-12" strokeWidth={1.25} />
      </div>
    )
  }

  return (
    <div className={cn(framed ? 'product-image-frame' : 'relative aspect-square bg-sand', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-1 transition-transform duration-500 group-hover:scale-[1.04]"
        sizes={sizes}
        priority={priority}
      />
    </div>
  )
}
