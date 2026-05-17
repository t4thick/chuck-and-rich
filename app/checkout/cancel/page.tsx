import Link from 'next/link'

export default function CheckoutCancelPage() {
  return (
    <div className="stack">
      <h2>Checkout canceled</h2>
      <p>No payment was taken. Your cart is unchanged.</p>
      <p>
        <Link href="/checkout">← Back to checkout</Link> · <Link href="/cart">View cart</Link>
      </p>
    </div>
  )
}
