'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PrintSlipActions({ orderId, autoPrint }: { orderId: string; autoPrint?: boolean }) {
  useEffect(() => {
    if (autoPrint) {
      const t = window.setTimeout(() => window.print(), 400)
      return () => window.clearTimeout(t)
    }
  }, [autoPrint])

  return (
    <div className="print-slip-toolbar mb-6 flex flex-wrap items-center gap-3">
      <Link
        href={`/admin/orders/${orderId}`}
        className="inline-flex items-center gap-1 text-sm font-medium text-earth-600 no-underline hover:text-earth-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to order
      </Link>
      <Button type="button" onClick={() => window.print()}>
        <Printer className="mr-1.5 h-4 w-4" aria-hidden />
        Print slip
      </Button>
      <p className="text-sm text-earth-500">
        Tape this to the box, print your label at USPS Click-N-Ship, then paste tracking in admin.
      </p>
    </div>
  )
}
