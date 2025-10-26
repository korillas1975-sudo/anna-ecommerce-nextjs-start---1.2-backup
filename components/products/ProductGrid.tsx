'use client'

import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice: number | null
  images: string[]
  category: { name: string }
  tags: string[]
}

export default function ProductGrid({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string; search?: string }
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchParams.category) params.append('category', searchParams.category)
      if (searchParams.sort) params.append('sort', searchParams.sort)
      if (searchParams.search) params.append('search', searchParams.search)

      const res = await fetch(`/api/products?${params}`)
      const data = await res.json()
      setProducts(data)
      setLoading(false)
    }

    fetchProducts()
  }, [searchParams])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-platinum/40 mb-3" />
            <div className="h-4 bg-platinum/40 mb-2 w-3/4" />
            <div className="h-3 bg-platinum/40 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-serif text-[1.2rem] text-ink-2/60">No products found</p>
      </div>
    )
  }

  return (
    <>
      {/* Results count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-ink-2/70">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </>
  )
}
