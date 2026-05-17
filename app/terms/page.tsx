import Link from 'next/link'

export const metadata = { title: 'Terms of Service' }

export default function TermsPage() {
  return (
    <div className="stack">
      <h2>Terms of service</h2>
      <p className="muted">Concise placeholder. Replace with attorney-reviewed terms before launch.</p>
      <p>
        By using this website and creating an account, you agree to these terms and our privacy practices. You are
        responsible for keeping your login credentials confidential.
      </p>
      <p>
        Product availability, pricing, and shipping estimates may change. We reserve the right to refuse or cancel
        orders when necessary, including for fraud prevention or inventory limits.
      </p>
      <p>
        For returns, refunds, and support, follow the policies posted at checkout and in your order communications.
      </p>
      <p><Link href="/shop">← Continue shopping</Link></p>
    </div>
  )
}
