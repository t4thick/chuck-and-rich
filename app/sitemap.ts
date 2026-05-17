import type { MetadataRoute } from 'next'
import { createClientOptional } from '@/lib/supabase/server'
import { getPublicSiteUrl } from '@/lib/site-url'

/**
 * /sitemap.xml — generated at request time so newly added/removed products show up
 * without a redeploy. Excludes auth-gated and admin routes (those have noindex implicitly
 * via robots.ts disallow + auth redirects, and we don't want them in search anyway).
 */
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getPublicSiteUrl()
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/login`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/signup`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/track-order`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/forgot-password`, lastModified: now, changeFrequency: 'yearly', priority: 0.1 },
  ]

  let productEntries: MetadataRoute.Sitemap = []
  try {
    const supabase = await createClientOptional()
    if (!supabase) return staticEntries

    const { data: products } = await supabase
      .from('products')
      .select('id, category, created_at')
      .order('created_at', { ascending: false })

    type ProductSitemapRow = { id: string; category: string | null; created_at: string | null }

    productEntries =
      (products as ProductSitemapRow[] | null)?.map((p) => ({
        url: `${baseUrl}/products/${p.id}`,
        lastModified: p.created_at ? new Date(p.created_at) : now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })) ?? []

    // De-duplicate category landing pages so /shop?category=Spices etc. get crawled.
    const categories = new Set<string>()
    ;(products as ProductSitemapRow[] | null)?.forEach((p) => {
      if (p.category) categories.add(p.category)
    })
    for (const category of categories) {
      productEntries.push({
        url: `${baseUrl}/shop?category=${encodeURIComponent(category)}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  } catch (err) {
    // If supabase is unreachable during build, still return static pages so the sitemap
    // doesn't 500 in production.
    console.error('[sitemap] failed to load products:', err)
  }

  return [...staticEntries, ...productEntries]
}
