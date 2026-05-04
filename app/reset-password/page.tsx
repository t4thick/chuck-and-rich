import { Suspense } from 'react'
import { ResetPasswordForm } from './ResetPasswordForm'

export const metadata = {
  title: 'Reset password — Lovely Queen African Market',
  robots: { index: false, follow: false },
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-5 py-16">
          <p className="text-sm text-gray-500">Loading…</p>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
