import { Suspense } from 'react'
import { TrackOrderClient } from './TrackOrderClient'

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <TrackOrderClient />
    </Suspense>
  )
}
