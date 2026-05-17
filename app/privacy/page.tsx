import Link from 'next/link'

export const metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <div className="stack">
      <h2>Privacy policy</h2>
      <p className="muted">Concise placeholder. Replace with attorney-reviewed policy before launch.</p>
      <p>
        We collect information you provide when you create an account, place an order, or contact us — for example
        name, email, phone, and shipping address. We use this information to fulfill orders, communicate about your
        purchases, and improve our store.
      </p>
      <p>Payment processing is handled by our payment partners; we do not store full card numbers on our servers.</p>
      <p>
        We do not sell your personal information. We may use service providers (hosting, email delivery, analytics)
        who process data on our behalf under appropriate agreements.
      </p>
      <p><Link href="/shop">← Continue shopping</Link></p>
    </div>
  )
}
