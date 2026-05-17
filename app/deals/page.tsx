import { DealsSection } from '@/components/home/DealsSection'

export default function DealsPage() {
  return (
    <main className="min-h-screen bg-[#f9f9f9]">
      <div className="border-b border-[#0f3d2e]/20 bg-[#0f3d2e]">
        <div className="mx-auto max-w-7xl px-5 py-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f4b400]">Save more</p>
          <h1 className="text-3xl font-bold tracking-tight text-white">Deals &amp; promotions</h1>
          <p className="mt-1 text-sm text-white/85">Weekly savings and bundle offers from our Columbus store.</p>
        </div>
      </div>
      <DealsSection />
    </main>
  )
}
