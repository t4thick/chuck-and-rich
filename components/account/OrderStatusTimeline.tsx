import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL, getStatusStepIndex } from '@/lib/order-status'
import { cn } from '@/lib/utils'

type OrderStatusTimelineProps = {
  status: string | null | undefined
  className?: string
}

export function OrderStatusTimeline({ status, className }: OrderStatusTimelineProps) {
  const stepIndex = getStatusStepIndex(status)

  return (
    <ol className={cn('space-y-0', className)}>
      {ORDER_STATUS_FLOW.map((step, index) => {
        const done = stepIndex >= index
        const current = stepIndex === index
        return (
          <li key={step} className="relative flex gap-4 pb-8 last:pb-0">
            {index < ORDER_STATUS_FLOW.length - 1 && (
              <span
                className={cn(
                  'absolute left-[11px] top-6 h-[calc(100%-1.5rem)] w-0.5',
                  done ? 'bg-brand-400' : 'bg-earth-200'
                )}
                aria-hidden
              />
            )}
            <span
              className={cn(
                'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                done
                  ? 'bg-brand-700 text-white'
                  : 'border-2 border-earth-200 bg-white text-earth-400'
              )}
              aria-hidden
            >
              {done ? '✓' : index + 1}
            </span>
            <div className="pt-0.5">
              <p
                className={cn(
                  'text-sm font-semibold',
                  current ? 'text-brand-800' : done ? 'text-earth-900' : 'text-earth-500'
                )}
              >
                {ORDER_STATUS_LABEL[step]}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
