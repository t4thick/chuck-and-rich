/** Stored in `orders.payment_method` */
export type PaymentMethod = 'cod' | 'zelle' | 'manual'

export function normalizePaymentMethod(raw: unknown): PaymentMethod {
  if (raw === 'zelle' || raw === 'manual' || raw === 'cod') return raw
  return 'cod'
}

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  cod: 'Cash on delivery',
  zelle: 'Zelle',
  manual: 'Manual / other',
}
