/** Stored in checkout_snapshots.payload — rebuilt server-side with DB prices on fulfill */
export type CheckoutSnapshotPayload = {
  items: { productId: string; quantity: number }[]
  customer_name: string
  customer_phone: string
  address_line: string
  city: string
  state: string | null
  country: string
  postal_code: string | null
  shipping_method: string
  shipping_zone: string | null
  account_email: string
}
