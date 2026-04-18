import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service | Lovely Queen African Market',
  description: 'Terms for using our website and placing orders.',
}

export default function TermsPage() {
  return (
    <main className="page-shell">
      <div className="page-container max-w-3xl">
        <p className="text-xs uppercase tracking-[0.14em] text-[#c8811a] font-semibold mb-2">Legal</p>
        <h1 className="section-title mb-4">Terms of service</h1>
        <p className="text-sm text-gray-600 mb-8">
          This is a concise placeholder. Replace with your attorney-reviewed terms before launch.
        </p>
        <div className="panel p-8 max-w-none text-gray-700 space-y-4 text-sm leading-relaxed">
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
