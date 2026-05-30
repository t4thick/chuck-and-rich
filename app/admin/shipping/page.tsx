import Link from 'next/link'
import { CheckCircle2, Circle, Truck } from 'lucide-react'
import { requireAdminPage } from '@/lib/auth/require-admin-page'
import { getShippingLabelConfigPublic } from '@/lib/shipping/label-config'

export default async function AdminShippingPage() {
  await requireAdminPage()
  const cfg = getShippingLabelConfigPublic()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="admin-page-title flex items-center gap-2">
          <Truck className="h-7 w-7 text-brand-700" aria-hidden />
          Shipping workflow
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-earth-600">
          Labels print from your <strong>USPS business account</strong> (Click-N-Ship). This site stores
          tracking and emails the customer — no Shippo or other label middleman.
        </p>
      </div>

      <section className="admin-card border-brand-200 bg-brand-50/30">
        <h2 className="admin-section-title">How to ship an order</h2>
        <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-earth-700">
          <li>
            <Link href="/admin/orders" className="font-medium text-brand-700 no-underline hover:underline">
              Open the order
            </Link>{' '}
            in admin.
          </li>
          <li>
            Click <strong>Print packing slip</strong> for the ship-to address.
          </li>
          <li>
            Go to{' '}
            <a
              href="https://cns.usps.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-700 underline"
            >
              USPS Click-N-Ship
            </a>{' '}
            → create label with your business account → print label.
          </li>
          <li>Paste tracking on the order → <strong>Save tracking &amp; mark shipped</strong>.</li>
        </ol>
      </section>

      <section className="admin-card">
        <h2 className="admin-section-title">Store ship-from address</h2>
        <p className="mt-2 text-sm text-earth-600">
          Used on packing slips. Set in Vercel if the default store address is wrong:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-earth-700">
          <li>
            <code className="text-xs">SHIP_FROM_NAME</code>, <code className="text-xs">SHIP_FROM_STREET1</code>,{' '}
            <code className="text-xs">SHIP_FROM_CITY</code>, <code className="text-xs">SHIP_FROM_STATE</code>,{' '}
            <code className="text-xs">SHIP_FROM_ZIP</code>, <code className="text-xs">SHIP_FROM_PHONE</code>
          </li>
        </ul>
        <ul className="mt-4 space-y-2 text-sm">
          <StatusRow ok={cfg.shipFromComplete} label="Ship-from address configured" />
        </ul>
        {cfg.shipFrom && (
          <div className="mt-4 rounded-lg border border-earth-200 bg-earth-50 px-4 py-3 text-sm text-earth-700">
            <p className="font-semibold text-earth-900">Ship from</p>
            <p className="mt-1">
              {cfg.shipFrom.name}
              <br />
              {cfg.shipFrom.street1}
              {cfg.shipFrom.street2 ? `, ${cfg.shipFrom.street2}` : ''}
              <br />
              {cfg.shipFrom.city}, {cfg.shipFrom.state} {cfg.shipFrom.zip}
            </p>
          </div>
        )}
      </section>

      <section className="admin-card">
        <h2 className="admin-section-title">Default package size (reference)</h2>
        <p className="mt-2 text-sm text-earth-600">
          Medium grocery box — use when entering weight/size in Click-N-Ship:{' '}
          <strong>{cfg.defaultParcel.weightLb} lb</strong>, {cfg.defaultParcel.lengthIn}×
          {cfg.defaultParcel.widthIn}×{cfg.defaultParcel.heightIn} in. Override with{' '}
          <code className="text-xs">SHIP_DEFAULT_*</code> env vars if needed.
        </p>
        <p className="mt-4">
          <Link href="/admin/orders" className="text-sm font-medium text-brand-700 no-underline hover:underline">
            Go to orders →
          </Link>
        </p>
      </section>
    </div>
  )
}

function StatusRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2">
      {ok ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden />
      ) : (
        <Circle className="h-4 w-4 text-earth-300" aria-hidden />
      )}
      <span className={ok ? 'text-earth-900' : 'text-earth-500'}>{label}</span>
    </li>
  )
}
