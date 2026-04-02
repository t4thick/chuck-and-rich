import { Suspense } from 'react'
import { TrackOrderClient } from './TrackOrderClient'

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 py-10 px-6 flex items-center justify-center">
          <p className="text-sm text-gray-500">Loading…</p>
        </main>
      }
    >
      <TrackOrderClient />
    </Suspense>
  )
}
