import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import ProductDetailClient from '@/components/products/ProductDetailClient'
import BackToResults from '@/components/products/BackToResults'
import RelatedProducts from '@/components/products/RelatedProducts'
import type { Metadata } from 'next'

function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  try {
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

async function getData(slug: string) {
  const product = await db.product.findUnique({
    where: { slug },
    include: { category: true },
  })

  if (!product) return null

  const parsedProduct = {
    ...product,
    description: product.description ?? '',
    images: parseJson<string[]>(product.images as unknown as string, []),
    tags: parseJson<string[]>(product.tags as string | null | undefined, []),
    variants: parseJson<Record<string, unknown>[] | null>(product.variants as string | null | undefined, null),
    details: parseJson<Record<string, unknown> | null>(product.details as string | null | undefined, null),
    sku: product.sku ?? '',
  }

  const related = await db.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, published: true },
    include: { category: true },
    take: 4,
  })

  const parsedRelated = related.map((p) => ({
    ...p,
    images: parseJson<string[]>(p.images as unknown as string, []),
    tags: parseJson<string[]>(p.tags as string | null | undefined, []),
  }))

  return { product: parsedProduct, relatedProducts: parsedRelated }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getData(slug)
  if (!data) notFound()

  const { product, relatedProducts } = data

  return (
    <main className="min-h-screen bg-bg overflow-x-hidden">
      <BackToResults fallbackCategory={product.category.slug} />
      <ProductDetailClient product={product} />
      {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}
      {/* JSON-LD Product for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: Array.isArray(product.images) ? product.images : [],
            description: typeof product.description === 'string' ? product.description : '',
            sku: product.sku || undefined,
            brand: { '@type': 'Brand', name: 'ANNA PARIS' },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'THB',
              price: product.price,
              availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            },
          }),
        }}
      />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const data = await getData(slug)
  if (!data) {
    return { title: 'Product Not Found | ANNA PARIS' }
  }
  const { product } = data
  return {
    title: `${product.name} | ANNA PARIS`,
    description: typeof product.description === 'string' ? product.description.slice(0, 160) : undefined,
  }
}
