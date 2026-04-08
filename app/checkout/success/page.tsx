import { Suspense } from 'react'
import { CheckoutSuccessClient } from './CheckoutSuccessClient'

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="page-shell flex min-h-[50vh] items-center justify-center">
          <p className="text-gray-600">Loading…</p>
        </main>
      }
    >
      <CheckoutSuccessClient />
    </Suspense>
  )
}
