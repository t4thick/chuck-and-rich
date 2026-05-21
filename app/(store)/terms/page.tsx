import Link from 'next/link'
import { PageHeader } from '@/components/store/PageHeader'

export const metadata = { title: 'Terms of Service' }

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <PageHeader eyebrow="Legal" title="Terms of service" />
      <div className="store-container max-w-3xl py-10 sm:py-12">
        <p className="text-sm text-earth-500">
          Concise placeholder. Replace with attorney-reviewed terms before launch.
        </p>
        <div className="mt-8 space-y-5 text-base leading-relaxed text-earth-700">
          <p>
            By using this website and creating an account, you agree to these terms and our privacy
            practices. You are responsible for keeping your login credentials confidential.
          </p>
          <p>
            Product availability, pricing, and shipping estimates may change. We reserve the right
            to refuse or cancel orders when necessary, including for fraud prevention or inventory
            limits.
          </p>
          <p>
            For returns, refunds, and support, follow the policies posted at checkout and in your
            order communications.
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
