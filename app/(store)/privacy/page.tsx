import Link from 'next/link'
import { PageHeader } from '@/components/store/PageHeader'
import { getSupportEmail } from '@/lib/constants/store'

export const metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  const supportEmail = getSupportEmail()
  return (
    <div className="min-h-screen bg-cream">
      <PageHeader eyebrow="Legal" title="Privacy policy" />
      <div className="store-container max-w-3xl py-10 sm:py-12">
        <p className="text-sm text-earth-500">
          Concise placeholder. Replace with attorney-reviewed policy before launch.
        </p>
        <div className="prose-earth mt-8 space-y-5 text-base leading-relaxed text-earth-700">
          <p>
            We collect information you provide when you create an account, place an order, or
            contact us — for example name, email, phone, and shipping address. We use this
            information to fulfill orders, communicate about your purchases, and improve our store.
          </p>
          <p>
            Payment processing is handled by our payment partners; we do not store full card
            numbers on our servers.
          </p>
          <p>
            We do not sell your personal information. We may use service providers (hosting, email
            delivery, analytics) who process data on our behalf under appropriate agreements.
          </p>
          <p>
            Questions or requests:{' '}
            <a href={`mailto:${supportEmail}`} className="font-medium text-brand-700 no-underline">
              {supportEmail}
            </a>
            . Website suggestions:{' '}
            <Link href="/feedback" className="font-medium text-brand-700 no-underline">
              feedback form
            </Link>
            .
          </p>
        </div>
        <p className="mt-10">
          <Link href="/shop" className="text-sm font-semibold text-brand-700 no-underline">
            ← Continue shopping
          </Link>
        </p>
      </div>
    </div>
  )
}
