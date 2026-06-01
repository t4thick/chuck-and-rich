import { createClientOptional } from '@/lib/supabase/server'
import { getSupabasePublicConfig, formatCatalogError, SupabaseConfigError } from '@/lib/supabase/config'
import { fetchCuratedHomepageShowcase } from '@/lib/supabase/homepage-curation'
import type { Product } from '@/types'

export type ProductsQueryResult = {
  products: Product[]
  errorMessage: string | null
  configured: boolean
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'newest'

const SORT_CONFIG: Record<SortOption, { column: string; ascending: boolean }> = {
  featured: { column: 'created_at', ascending: false },
  newest: { column: 'created_at', ascending: false },
  'price-asc': { column: 'price', ascending: true },
  'price-desc': { column: 'price', ascending: false },
  'name-asc': { column: 'name', ascending: true },
}

export async function fetchProductsForShop(options?: {
  q?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  inStockOnly?: boolean
  sort?: SortOption
}): Promise<ProductsQueryResult> {
  const { configured } = getSupabasePublicConfig()
  if (!configured) {
    return {
      products: [],
      errorMessage: formatCatalogError(null, false),
      configured: false,
    }
  }

  try {
    const supabase = await createClientOptional()
    if (!supabase) {
      return {
        products: [],
        errorMessage: formatCatalogError(null, false),
        configured: false,
      }
    }
    let query = supabase.from('products').select('id,name,price,image_url,category,in_stock,description,created_at')
    if (options?.q) query = query.ilike('name', `%${options.q}%`)
    if (options?.category) query = query.eq('category', options.category)
    if (options?.minPrice != null && !Number.isNaN(options.minPrice)) {
      query = query.gte('price', options.minPrice)
    }
    if (options?.maxPrice != null && !Number.isNaN(options.maxPrice)) {
      query = query.lte('price', options.maxPrice)
    }
    if (options?.inStockOnly) {
      query = query.eq('in_stock', true)
    }

    const sort = SORT_CONFIG[options?.sort ?? 'featured']
    const { data, error } = await query.order(sort.column, { ascending: sort.ascending })
    if (error) {
      return {
        products: [],
        errorMessage: formatCatalogError(error, true),
        configured: true,
      }
    }

    return {
      products: (data ?? []) as Product[],
      errorMessage: null,
      configured: true,
    }
  } catch (e) {
    const err = e instanceof SupabaseConfigError ? null : e
    const message =
      e instanceof SupabaseConfigError
        ? formatCatalogError(null, false)
        : formatCatalogError(err instanceof Error ? err : { message: String(e) }, configured)
    return {
      products: [],
      errorMessage: message,
      configured,
    }
  }
}

export async function fetchCategoryCounts(): Promise<Record<string, number>> {
  const { configured } = getSupabasePublicConfig()
  if (!configured) return {}

  try {
    const supabase = await createClientOptional()
    if (!supabase) return {}
    const { data } = await supabase.from('products').select('category').eq('in_stock', true)
    return ((data ?? []) as { category: string | null }[]).reduce<Record<string, number>>(
      (acc, row) => {
        const name = row.category?.trim()
        if (!name) return acc
        acc[name] = (acc[name] ?? 0) + 1
        return acc
      },
      {}
    )
  } catch {
    return {}
  }
}

export async function searchProductsLite(q: string, limit = 6): Promise<Product[]> {
  const term = q.trim()
  if (!term) return []
  const { configured } = getSupabasePublicConfig()
  if (!configured) return []
  try {
    const supabase = await createClientOptional()
    if (!supabase) return []
    const { data } = await supabase
      .from('products')
      .select('id,name,price,image_url,category,in_stock')
      .ilike('name', `%${term}%`)
      .order('in_stock', { ascending: false })
      .limit(limit)
    return ((data ?? []) as Product[]) ?? []
  } catch {
    return []
  }
}

export async function fetchFrequentlyBoughtTogether(
  category: string,
  excludeId: string,
  limit = 3
): Promise<Product[]> {
  const { configured } = getSupabasePublicConfig()
  if (!configured) return []
  try {
    const supabase = await createClientOptional()
    if (!supabase) return []
    const { data } = await supabase
      .from('products')
      .select('id,name,price,image_url,category,in_stock,description,created_at')
      .eq('category', category)
      .eq('in_stock', true)
      .neq('id', excludeId)
      .order('created_at', { ascending: false })
      .limit(limit)
    return ((data ?? []) as Product[]) ?? []
  } catch {
    return []
  }
}

export async function fetchHomepageProducts(): Promise<{
  staples: Product[]
  trending: Product[]
  newArrivals: Product[]
  categoryCount: Record<string, number>
  configured: boolean
  errorMessage: string | null
}> {
  const { configured } = getSupabasePublicConfig()
  if (!configured) {
    return {
      staples: [],
      trending: [],
      newArrivals: [],
      categoryCount: {},
      configured: false,
      errorMessage: formatCatalogError(null, false),
    }
  }

  try {
    const supabase = await createClientOptional()
    if (!supabase) {
      return {
        staples: [],
        trending: [],
        newArrivals: [],
        categoryCount: {},
        configured: false,
        errorMessage: formatCatalogError(null, false),
      }
    }
    const [showcase, catRes] = await Promise.all([
      fetchCuratedHomepageShowcase(supabase),
      supabase.from('products').select('category').eq('in_stock', true),
    ])

    if (catRes.error) {
      return {
        staples: [],
        trending: [],
        newArrivals: [],
        categoryCount: {},
        configured: true,
        errorMessage: formatCatalogError(catRes.error, true),
      }
    }

    const categoryCount = ((catRes.data ?? []) as { category: string | null }[]).reduce<
      Record<string, number>
    >((acc, row) => {
      const name = row.category?.trim()
      if (!name) return acc
      acc[name] = (acc[name] ?? 0) + 1
      return acc
    }, {})

    return {
      staples: showcase.staples,
      trending: showcase.trending,
      newArrivals: showcase.newArrivals,
      categoryCount,
      configured: true,
      errorMessage: null,
    }
  } catch (e) {
    return {
      staples: [],
      trending: [],
      newArrivals: [],
      categoryCount: {},
      configured: configured,
      errorMessage: formatCatalogError(e instanceof Error ? e : { message: String(e) }, configured),
    }
  }
}
