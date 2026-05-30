import Link from 'next/link'
import { CheckCircle2, Circle, Truck } from 'lucide-react'
import { requireAdminPage } from '@/lib/auth/require-admin-page'
import { getShippingLabelConfigPublic } from '@/lib/shipping/label-config'

export default async function AdminShippingPage() {
  await requireAdminPage()
  const cfg = getShippingLabelConfigPublic()

  const steps = [
    {
      done: cfg.hasShippoToken,
      title: 'Create a free Shippo account',
      body: (
        <>
          Sign up at{' '}
          <a
            href="https://goshippo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-700 underline"
          >
            goshippo.com
          </a>
          . Shippo connects to <strong>USPS</strong> and <strong>UPS</strong> for you — you do not
          need separate USPS/UPS developer accounts.
        </>
      ),
    },
    {
      done: cfg.hasShippoToken,
      title: 'Copy your Shippo API token',
      body: (
        <>
          In Shippo: <strong>Settings → API</strong>. Copy the token. In{' '}
          <strong>Vercel → Project → Settings → Environment Variables</strong>, add{' '}
          <code className="rounded bg-earth-100 px-1 py-0.5 text-xs">SHIPPO_API_TOKEN</code> for
          Production (and Preview if you use admin on preview URLs). Redeploy after saving.
        </>
      ),
    },
    {
      done: cfg.shipFromComplete,
      title: 'Add your store ship-from address',
      body: (
        <>
          Add these in Vercel (same place as above). This is where packages ship from — your Columbus
          store:
          <ul className="mt-2 list-inside list-disc space-y-1 text-earth-700">
            <li>
              <code className="text-xs">SHIP_FROM_NAME</code> — Lovely Queen African Market
            </li>
            <li>
              <code className="text-xs">SHIP_FROM_STREET1</code> — street address
            </li>
            <li>
              <code className="text-xs">SHIP_FROM_CITY</code> — Columbus
            </li>
            <li>
              <code className="text-xs">SHIP_FROM_STATE</code> — OH
            </li>
            <li>
              <code className="text-xs">SHIP_FROM_ZIP</code> — your ZIP
            </li>
            <li>
              <code className="text-xs">SHIP_FROM_PHONE</code> — store phone (required by carriers)
            </li>
            <li>
              <code className="text-xs">SHIP_FROM_EMAIL</code> — optional (defaults to merchant email)
            </li>
          </ul>
        </>
      ),
    },
    {
      done: true,
      title: 'Default box size (optional)',
      body: (
        <>
          Override defaults if you want. Otherwise we assume a medium grocery box (~3 lb, 12×10×8
          in):
          <code className="ml-1 rounded bg-earth-100 px-1 py-0.5 text-xs">SHIP_DEFAULT_WEIGHT_LB</code>,{' '}
          <code className="rounded bg-earth-100 px-1 py-0.5 text-xs">SHIP_DEFAULT_LENGTH_IN</code>, etc.
        </>
      ),
    },
    {
      done: cfg.shippoConfigured,
      title: 'Buy & print labels from an order',
      body: (
        <>
          Open any paid order → <strong>Print shipping label</strong> → enter weight → pick USPS or
          UPS rate → <strong>Buy label</strong>. Then <strong>Print</strong> or <strong>Download
          PDF</strong>. Tracking is saved automatically and the customer is emailed.
        </>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="admin-page-title flex items-center gap-2">
          <Truck className="h-7 w-7 text-brand-700" aria-hidden />
          Shipping workflow
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-earth-600">
          Current mode: <strong>{cfg.labelModeLabel}</strong>. Most stores print USPS labels from an
          existing business account, then paste tracking on each order — same as TikTok Shop.
        </p>
      </div>

      <section className="admin-card">
        <h2 className="admin-section-title">Recommended: external labels (TikTok-style)</h2>
        <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-earth-700">
          <li>Open an order in admin → print the packing slip / address.</li>
          <li>
            Print the USPS label from <strong>USPS Click-N-Ship</strong>, Stamps.com, or your business
            contract (not from this website unless you enable Shippo below).
          </li>
          <li>Paste the tracking number → <strong>Save tracking &amp; mark shipped</strong>.</li>
        </ol>
        <p className="mt-4 text-sm text-earth-600">
          Set <code className="rounded bg-earth-100 px-1 text-xs">SHIP_LABEL_MODE=external</code> on
          Vercel (or leave unset — that is the default). No Shippo required.
        </p>
      </section>

      <section className="admin-card">
        <h2 className="admin-section-title">Optional: buy labels in admin (Shippo)</h2>
        <p className="mt-2 text-sm text-earth-600">
          Only if you want the website to purchase postage. Uses weight + zone pricing (not flat-rate
          unless you always use the same default box).
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-earth-700">
          <li>
            <code className="text-xs">SHIP_LABEL_MODE=quick</code> — one button, default 3 lb box, USPS
            Ground Advantage
          </li>
          <li>
            <code className="text-xs">SHIP_LABEL_MODE=advanced</code> — compare all USPS / UPS rates
          </li>
        </ul>
      </section>

      <section className="admin-card">
        <h2 className="admin-section-title">USPS direct (no Shippo)</h2>
        <p className="mt-2 text-sm text-earth-600">
          If you have a USPS business account with prepaid or contract rates, keep using{' '}
          <a
            href="https://cns.usps.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-700 underline"
          >
            Click-N-Ship
          </a>{' '}
          or your existing label printer. This site stores tracking only — no USPS API wiring needed
          unless you later add Enterprise Payment System (EPS) integration.
        </p>
      </section>

      <section className="admin-card">
        <h2 className="admin-section-title">Shippo setup (optional)</h2>
        <ul className="mt-4 space-y-2 text-sm">
          <StatusRow ok={cfg.hasShippoToken} label="Shippo API token" />
          <StatusRow ok={cfg.shipFromComplete} label="Store ship-from address" />
          <StatusRow ok={cfg.shippoConfigured} label="Ready to print labels" />
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
        <p className="mt-4 text-xs text-earth-500">
          Carriers enabled: {cfg.allowedCarriers.join(' and ')} only.
        </p>
      </section>

      <section className="admin-card">
        <h2 className="admin-section-title">Setup checklist</h2>
        <ol className="mt-4 space-y-6">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              {step.done ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
              ) : (
                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-earth-300" aria-hidden />
              )}
              <div>
                <p className="font-semibold text-earth-900">
                  {i + 1}. {step.title}
                </p>
                <div className="mt-1 text-sm text-earth-600">{step.body}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="admin-card">
        <h2 className="admin-section-title">Printing labels</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-earth-700">
          <li>
            <strong>Regular printer:</strong> print the PDF on 8.5×11 paper and tape to the box, or
            use label paper.
          </li>
          <li>
            <strong>Label printer (Rollo, DYMO, Zebra):</strong> install the printer on your PC, open
            the PDF, choose that printer, set paper to 4×6 if prompted.
          </li>
          <li>Test mode: Shippo gives a test token — labels are fake until you switch to live token.</li>
        </ul>
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
