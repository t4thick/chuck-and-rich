import Link from 'next/link'

export function AuthTrustFooter({ className = '' }: { className?: string }) {
  return (
    <div className={`text-center space-y-2 ${className}`}>
      <p className="text-xs text-gray-500 flex flex-wrap items-center justify-center gap-1.5">
        <span className="inline-flex items-center gap-1" aria-hidden>
          <svg className="w-3.5 h-3.5 text-[#1a4731]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Secure sign-in
        </span>
        <span className="text-gray-300">·</span>
        <span>We never sell your personal information.</span>
      </p>
      <p className="text-xs text-gray-500">
        <Link href="/privacy" className="text-[#236641] font-medium hover:underline">
          Privacy
        </Link>
        <span className="mx-1.5 text-gray-300">·</span>
        <Link href="/terms" className="text-[#236641] font-medium hover:underline">
          Terms
        </Link>
      </p>
    </div>
  )
}
