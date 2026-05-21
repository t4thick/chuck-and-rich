import { createClientOptional } from '@/lib/supabase/server'
import { getSupabasePublicConfig, formatCatalogError, SupabaseConfigError } from '@/lib/supabase/config'
import type { Product } from '@/types'

export type ProductsQueryResult = {
  products: Product[]
  errorMessage: string | null
  configured: boolean
}

export async function fetchProductsForShop(options?: {
  q?: string
  category?: string
  minPrice?: number
  maxPrice?: number
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
    let query = supabase.from('products').select('*')
    if (options?.q) query = query.ilike('name', `%${options.q}%`)
    if (options?.category) query = query.eq('category', options.category)
    if (options?.minPrice != null && !Number.isNaN(options.minPrice)) {
      query = query.gte('price', options.minPrice)
    }
    if (options?.maxPrice != null && !Number.isNaN(options.maxPrice)) {
      query = query.lte('price', options.maxPrice)
    }

    const { data, error } = await query.order('name')
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

export async function fetchHomepageProducts(): Promise<{
  bestSellers: Product[]
  categoryCount: Record<string, number>
  configured: boolean
  errorMessage: string | null
}> {
  const { configured } = getSupabasePublicConfig()
  if (!configured) {
    return { bestSellers: [], categoryCount: {}, configured: false, errorMessage: formatCatalogError(null, false) }
  }

  try {
    const supabase = await createClientOptional()
    if (!supabase) {
      return { bestSellers: [], categoryCount: {}, configured: false, errorMessage: formatCatalogError(null, false) }
    }
    const [bestRes, catRes] = await Promise.all([
      supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(12),
      supabase.from('products').select('category').eq('in_stock', true),
    ])

    if (bestRes.error) {
      return {
        bestSellers: [],
        categoryCount: {},
        configured: true,
        errorMessage: formatCatalogError(bestRes.error, true),
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
      bestSellers: (bestRes.data ?? []) as Product[],
      categoryCount,
      configured: true,
      errorMessage: null,
    }
  } catch (e) {
    return {
      bestSellers: [],
      categoryCount: {},
      configured: configured,
      errorMessage: formatCatalogError(e instanceof Error ? e : { message: String(e) }, configured),
    }
  }
}
