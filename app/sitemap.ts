import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const urls: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1.0 },
    { url: `${base}/products`, priority: 0.9 },
    { url: `${base}/about`, priority: 0.6 },
    { url: `${base}/contact`, priority: 0.6 },
  ]

  try {
    const products = await db.product.findMany({ select: { slug: true, updatedAt: true }, where: { published: true } })
    for (const p of products) {
      urls.push({ url: `${base}/products/${encodeURIComponent(p.slug)}`, lastModified: p.updatedAt, priority: 0.8 })
    }
  } catch {}

  try {
    const pages = await db.contentPage.findMany({ select: { slug: true, updatedAt: true, published: true } })
    for (const page of pages) {
      if (page.published) urls.push({ url: `${base}/${page.slug}`, lastModified: page.updatedAt, priority: 0.5 })
    }
  } catch {}

  return urls
}

