import { Suspense } from 'react'
import { LoginForm } from './LoginForm'

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-5 py-16">
          <p className="text-sm text-gray-500">Loading…</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
