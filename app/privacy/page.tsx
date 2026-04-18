import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | Lovely Queen African Market',
  description: 'How we handle your personal information.',
}

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <div className="page-container max-w-3xl">
        <p className="text-xs uppercase tracking-[0.14em] text-[#c8811a] font-semibold mb-2">Legal</p>
        <h1 className="section-title mb-4">Privacy policy</h1>
        <p className="text-sm text-gray-600 mb-8">
          This is a concise placeholder. Replace with your attorney-reviewed policy before launch.
        </p>
        <div className="panel p-8 max-w-none text-gray-700 space-y-4 text-sm leading-relaxed">
          <p>
            We collect information you provide when you create an account, place an order, or contact us — for example
            name, email, phone, and shipping address. We use this information to fulfill orders, communicate about your
            purchases, and improve our store.
          </p>
          <p>
            Payment processing is handled by our payment partners; we do not store full card numbers on our servers.
          </p>
          <p>
            We do not sell your personal information. We may use service providers (hosting, email delivery, analytics)
            who process data on our behalf under appropriate agreements.
          </p>
          <p>
            Questions? Contact us through the details on our website.
          </p>
        </div>
        <p className="text-center mt-8">
          <Link href="/shop" className="text-sm font-semibold text-[#236641] hover:underline">
            Continue shopping
          </Link>
        </p>
      </div>
    </main>
  )
}
