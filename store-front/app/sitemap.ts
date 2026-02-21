import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://abu-imran-farm.com'

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/shop',
    '/hatching',
    '/privacy',
    '/terms',
    '/faq',
    '/shipping',
    '/returns',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route === '/shop' ? 0.9 : 0.8,
  }))

  // 2. Fetch Active Products
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('slug, created_at')
    .eq('is_active', true)
    .limit(100)

  const productRoutes = (products || []).map((product: any) => ({
    url: `${baseUrl}/shop/${product.slug}`,
    lastModified: product.created_at ? new Date(product.created_at) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...productRoutes]
}
