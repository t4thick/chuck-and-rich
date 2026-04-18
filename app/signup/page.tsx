import { Suspense } from 'react'
import { SignupForm } from './SignupForm'

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-5 py-16">
          <p className="text-sm text-gray-500">Loading…</p>
        </main>
      }
    >
      <SignupForm />
    </Suspense>
  )
}
