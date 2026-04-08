import Link from 'next/link'

export default function CheckoutCancelPage() {
  return (
    <main className="page-shell flex min-h-[50vh] items-center justify-center px-4">
      <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Checkout canceled</h1>
        <p className="mt-3 text-sm text-gray-600">
          No payment was taken. Your cart is unchanged — you can return to checkout when you&apos;re ready.
        </p>
        <Link
          href="/checkout"
          className="mt-6 inline-block w-full rounded-xl bg-[#0f3d2e] py-3 text-sm font-semibold text-white hover:bg-[#0c3024]"
        >
          Back to checkout
        </Link>
        <Link href="/cart" className="mt-3 block text-sm text-gray-500 hover:text-gray-800">
          View cart
        </Link>
      </div>
    </main>
  )
}
