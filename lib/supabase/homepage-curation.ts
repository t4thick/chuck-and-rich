import type { Product } from '@/types'
import type { SupabaseClient } from '@supabase/supabase-js'

const PRODUCT_SELECT = 'id,name,price,image_url,category,in_stock,description,created_at'

/** Curated “Trending this week” — grocery staples first, cosmetics capped */
const TRENDING_SLOTS: {
  category: string
  limit: number
  keywords?: string[]
}[] = [
  { category: 'Flours & Rice', limit: 2, keywords: ['fufu', 'yam', 'plantain', 'gari', 'rice', 'banku'] },
  { category: 'Fresh Produce', limit: 2, keywords: ['yam', 'plantain', 'okra', 'ugwu'] },
  { category: 'Beverages', limit: 1 },
  { category: 'Spices', limit: 1 },
  { category: 'Snack', limit: 1 },
  { category: 'Meat and Seafood', limit: 1 },
  { category: 'Bread', limit: 1 },
  { category: 'Cosmetics', limit: 1 },
]

function nameMatchesKeywords(name: string, keywords: string[]): boolean {
  const n = name.toLowerCase()
  return keywords.some((k) => n.includes(k))
}

function pickFromRows(rows: Product[], limit: number, keywords?: string[]): Product[] {
  const withImage = rows.filter((p) => p.image_url?.trim())
  const pool = keywords?.length
    ? [...withImage.filter((p) => nameMatchesKeywords(p.name, keywords)), ...withImage]
    : withImage
  const seen = new Set<string>()
  const out: Product[] = []
  for (const p of pool) {
    if (seen.has(p.id)) continue
    seen.add(p.id)
    out.push(p)
    if (out.length >= limit) break
  }
  return out
}

export async function fetchCuratedHomepageShowcase(
  supabase: SupabaseClient
): Promise<{ trending: Product[]; newArrivals: Product[] }> {
  const slotResults = await Promise.all(
    TRENDING_SLOTS.map(async (slot) => {
      const { data } = await supabase
        .from('products')
        .select(PRODUCT_SELECT)
        .eq('in_stock', true)
        .eq('category', slot.category)
        .order('created_at', { ascending: false })
        .limit(24)
      return pickFromRows((data ?? []) as Product[], slot.limit, slot.keywords)
    })
  )

  const trending: Product[] = []
  const used = new Set<string>()
  for (const batch of slotResults) {
    for (const p of batch) {
      if (used.has(p.id)) continue
      used.add(p.id)
      trending.push(p)
    }
  }

  if (trending.length < 8) {
    const { data: fill } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('in_stock', true)
      .neq('category', 'Cosmetics')
      .order('created_at', { ascending: false })
      .limit(24)

    for (const p of (fill ?? []) as Product[]) {
      if (used.has(p.id)) continue
      used.add(p.id)
      trending.push(p)
      if (trending.length >= 8) break
    }
  }

  const { data: newest } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('in_stock', true)
    .order('created_at', { ascending: false })
    .limit(24)

  const newArrivals: Product[] = []
  for (const p of (newest ?? []) as Product[]) {
    if (used.has(p.id)) continue
    used.add(p.id)
    newArrivals.push(p)
    if (newArrivals.length >= 8) break
  }

  return { trending: trending.slice(0, 8), newArrivals }
}
