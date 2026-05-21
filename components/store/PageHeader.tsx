import { cn } from '@/lib/utils'

type PageHeaderProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  className?: string
  centered?: boolean
}

export function PageHeader({ eyebrow, title, subtitle, className, centered }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'border-b border-earth-200/80 bg-white',
        className
      )}
    >
      <div className={cn('store-container py-10 sm:py-12', centered && 'text-center')}>
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
        <h1 className={cn('section-title', eyebrow ? 'mt-2' : '')}>{title}</h1>
        {subtitle && (
          <p className={cn('section-subtitle', centered && 'mx-auto')}>{subtitle}</p>
        )}
      </div>
    </div>
  )
}
