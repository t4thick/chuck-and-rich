export const ORDER_STATUS_FLOW = [
  'ordered',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
] as const

export type OrderStatus = (typeof ORDER_STATUS_FLOW)[number] | 'cancelled'
export const ORDER_STATUSES: OrderStatus[] = [...ORDER_STATUS_FLOW, 'cancelled']

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  ordered: 'Ordered',
  processing: 'Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const ORDER_STATUS_ADMIN_LABEL: Record<OrderStatus, string> = {
  ordered: '🧾 Ordered',
  processing: '⚙️ Processing',
  shipped: '📦 Shipped',
  out_for_delivery: '🚚 Out for Delivery',
  delivered: '✅ Delivered',
  cancelled: '❌ Cancelled',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  ordered: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-violet-100 text-violet-700',
  out_for_delivery: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-600',
}

const LEGACY_MAP: Record<string, OrderStatus> = {
  pending: 'ordered',
}

export function normalizeOrderStatus(input: string | null | undefined): OrderStatus {
  const key = (input ?? '').trim().toLowerCase()
  if (key in LEGACY_MAP) return LEGACY_MAP[key]
  if (
    key === 'ordered' ||
    key === 'processing' ||
    key === 'shipped' ||
    key === 'out_for_delivery' ||
    key === 'delivered' ||
    key === 'cancelled'
  ) {
    return key
  }
  return 'ordered'
}

export function getStatusStepIndex(status: string | null | undefined): number {
  const normalized = normalizeOrderStatus(status)
  if (normalized === 'cancelled') return -1
  return ORDER_STATUS_FLOW.indexOf(normalized)
}

export const ORDER_STATUS_TIMESTAMP_COLUMN: Record<OrderStatus, string> = {
  ordered: 'ordered_at',
  processing: 'processing_at',
  shipped: 'shipped_at',
  out_for_delivery: 'out_for_delivery_at',
  delivered: 'delivered_at',
  cancelled: 'cancelled_at',
}
