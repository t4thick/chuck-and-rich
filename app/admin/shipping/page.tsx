import Link from 'next/link'
import { CheckCircle2, Circle, Truck } from 'lucide-react'
import { requireAdminPage } from '@/lib/auth/require-admin-page'
import { getShippingLabelConfigPublic, isShippoConfigured } from '@/lib/shipping/label-config'
import { listShippoCarrierAccounts } from '@/lib/shipping/shippo-client'

export default async function AdminShippingPage() {
  await requireAdminPage()
  const cfg = getShippingLabelConfigPublic()
  let carrierAccounts: Awaited<ReturnType<typeof listShippoCarrierAccounts>> = []
  if (isShippoConfigured()) {
    try {
      carrierAccounts = await listShippoCarrierAccounts()
    } catch {
      carrierAccounts = []
    }
  }
  const uspsOwnAccounts = carrierAccounts.filter((a) => a.carrier === 'USPS' && !a.isShippoAccount)

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
          Open any paid order → <strong>Print shipping label</strong>. For quick mode, one click buys{' '}
          {cfg.preferredCarrier} {cfg.preferredCarrierService} at the default box size. Tracking saves
          automatically and the customer is emailed.
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
          Current mode: <strong>{cfg.labelModeLabel}</strong>.
          {cfg.labelMode === 'quick' && cfg.shippoConfigured ? (
            <>
              {' '}
              Open an order → <strong>Print shipping label</strong> → {cfg.preferredCarrier}{' '}
              {cfg.preferredCarrierService} → PDF opens and tracking saves automatically.
            </>
          ) : cfg.shippoConfigured ? (
            <> Shippo is connected — configure quick or advanced mode in Vercel.</>
          ) : (
            <> Connect Shippo to print labels here, or enter tracking after shipping from your carrier account.</>
          )}
        </p>
      </div>

      {cfg.labelMode === 'quick' && cfg.shippoConfigured ? (
        <section className="admin-card border-brand-200 bg-brand-50/30">
          <h2 className="admin-section-title">Print labels in admin</h2>
          <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-earth-700">
            <li>Open a paid shipping order.</li>
            <li>
              Click <strong>Print shipping label</strong> — {cfg.preferredCarrier}{' '}
              {cfg.preferredCarrierService}, default box size.
            </li>
            <li>Label PDF opens; tracking is saved and the customer is emailed.</li>
          </ol>
          <p className="mt-4 text-sm text-earth-600">
            Carrier: <code className="rounded bg-earth-100 px-1 text-xs">SHIP_PREFERRED_CARRIER={cfg.preferredCarrier}</code>
            {' · '}
            Service: <code className="rounded bg-earth-100 px-1 text-xs">{cfg.preferredCarrierService}</code>
          </p>
        </section>
      ) : !cfg.shippoConfigured ? (
        <section className="admin-card">
          <h2 className="admin-section-title">Manual tracking</h2>
          <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-earth-700">
            <li>Print the packing slip from the order.</li>
            <li>Buy and print a label from your carrier account.</li>
            <li>Paste the tracking number → <strong>Save tracking &amp; mark shipped</strong>.</li>
          </ol>
          <p className="mt-4 text-sm text-earth-600">
            Add <code className="rounded bg-earth-100 px-1 text-xs">SHIPPO_API_TOKEN</code> on Vercel to
            print labels directly in admin instead.
          </p>
        </section>
      ) : null}

      <section className="admin-card border-brand-200 bg-brand-50/30">
        <h2 className="admin-section-title">Use your USPS business account</h2>
        <p className="mt-2 text-sm text-earth-600">
          Shippo is the print button on this site. Connect <strong>your</strong> USPS business account
          inside Shippo so labels bill to your existing USPS rates — not Shippo&apos;s default rates.
        </p>
        <ol className="mt-4 list-inside list-decimal space-y-2 text-sm text-earth-700">
          <li>
            Log in at{' '}
            <a
              href="https://goshippo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-700 underline"
            >
              goshippo.com
            </a>{' '}
            with the same account as your <code className="text-xs">SHIPPO_API_TOKEN</code>.
          </li>
          <li>
            <strong>Settings → Carriers → Connect carrier account → USPS</strong>. Sign in with your
            USPS business / Click-N-Ship credentials.
          </li>
          <li>
            Copy your account&apos;s <strong>object ID</strong> from the list below (or Shippo → Carriers →
            Your accounts).
          </li>
          <li>
            In Vercel, set{' '}
            <code className="rounded bg-earth-100 px-1 text-xs">SHIPPO_CARRIER_ACCOUNT_IDS</code> to that
            ID (comma-separated if you have more than one). Also set{' '}
            <code className="rounded bg-earth-100 px-1 text-xs">SHIP_PREFERRED_CARRIER=USPS</code> and{' '}
            <code className="rounded bg-earth-100 px-1 text-xs">SHIP_PREFERRED_USPS_SERVICE=Ground Advantage</code>.
          </li>
          <li>Redeploy. Print labels in admin — postage charges your USPS account (+ Shippo API fee if applicable).</li>
        </ol>
        <ul className="mt-4 space-y-2 text-sm">
          <StatusRow ok={cfg.ownCarrierAccountsConfigured} label="SHIPPO_CARRIER_ACCOUNT_IDS set on Vercel" />
        </ul>
        {carrierAccounts.length > 0 ? (
          <div className="mt-4 overflow-x-auto rounded-lg border border-earth-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-earth-50 text-xs font-semibold uppercase text-earth-600">
                <tr>
                  <th className="px-3 py-2">Account</th>
                  <th className="px-3 py-2">Carrier</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Object ID (for Vercel)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-100">
                {carrierAccounts.map((a) => (
                  <tr key={a.objectId}>
                    <td className="px-3 py-2 text-earth-900">{a.name}</td>
                    <td className="px-3 py-2">{a.carrier}</td>
                    <td className="px-3 py-2">{a.isShippoAccount ? 'Shippo rates' : 'Your account'}</td>
                    <td className="px-3 py-2 font-mono text-xs text-earth-800">{a.objectId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : cfg.hasShippoToken ? (
          <p className="mt-4 text-sm text-amber-800">
            Could not load carrier accounts — check that your Shippo API token is live and redeployed.
          </p>
        ) : null}
        {uspsOwnAccounts.length > 0 && !cfg.ownCarrierAccountsConfigured ? (
          <p className="mt-4 text-sm font-medium text-brand-800">
            Your USPS business account is connected in Shippo. Add{' '}
            <code className="text-xs">{uspsOwnAccounts[0]!.objectId}</code> to{' '}
            <code className="text-xs">SHIPPO_CARRIER_ACCOUNT_IDS</code> on Vercel so we only use your
            rates.
          </p>
        ) : null}
      </section>

      <section className="admin-card">
        <h2 className="admin-section-title">Shippo configuration</h2>
        <p className="mt-2 text-sm text-earth-600">
          Shippo runs the print API. Connect your own USPS account inside Shippo to use your business
          rates.
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-earth-700">
          <li>
            <code className="text-xs">SHIP_LABEL_MODE=quick</code> — <strong>Print shipping label</strong>{' '}
            button, {cfg.preferredCarrier} {cfg.preferredCarrierService}
          </li>
          <li>
            <code className="text-xs">SHIP_PREFERRED_CARRIER=USPS</code> — USPS Ground Advantage default
          </li>
          <li>
            <code className="text-xs">SHIPPO_CARRIER_ACCOUNT_IDS</code> — force your USPS business account
          </li>
          <li>
            <code className="text-xs">SHIP_LABEL_MODE=advanced</code> — compare all rates before buying
          </li>
        </ul>
      </section>

      <section className="admin-card">
        <h2 className="admin-section-title">Status</h2>
        <ul className="mt-4 space-y-2 text-sm">
          <StatusRow ok={cfg.hasShippoToken} label="Shippo API token" />
          <StatusRow ok={cfg.shipFromComplete} label="Store ship-from address" />
          <StatusRow ok={cfg.shippoConfigured} label="Ready to print labels" />
          <StatusRow ok={cfg.ownCarrierAccountsConfigured} label="Using your carrier account IDs" />
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
