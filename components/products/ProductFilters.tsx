'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
  _count: { products: number }
}

export default function ProductFilters() {
  const [categories, setCategories] = useState<Category[]>([])
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category')

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    }
    fetchCategories()
  }, [])

  return (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-serif text-[1.1rem] text-ink mb-4 font-medium">Categories</h3>
        <div className="space-y-2">
          <Link
            href="/products"
            className={`block text-[0.9rem] transition-colors ${
              !currentCategory
                ? 'text-ink font-medium'
                : 'text-ink-2/60 hover:text-ink'
            }`}
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`block text-[0.9rem] transition-colors ${
                currentCategory === cat.slug
                  ? 'text-ink font-medium'
                  : 'text-ink-2/60 hover:text-ink'
              }`}
            >
              {cat.name}
              <span className="text-ink-2/40 ml-1">({cat._count.products})</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Price Range - Placeholder */}
      <div>
        <h3 className="font-serif text-[1.1rem] text-ink mb-4 font-medium">Price Range</h3>
        <div className="space-y-2 text-[0.9rem] text-ink-2/60">
          <label className="flex items-center gap-2 cursor-pointer hover:text-ink transition-colors">
            <input type="checkbox" className="w-4 h-4" />
            <span>Under ฿10,000</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-ink transition-colors">
            <input type="checkbox" className="w-4 h-4" />
            <span>฿10,000 - ฿20,000</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-ink transition-colors">
            <input type="checkbox" className="w-4 h-4" />
            <span>฿20,000 - ฿50,000</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-ink transition-colors">
            <input type="checkbox" className="w-4 h-4" />
            <span>Above ฿50,000</span>
          </label>
        </div>
      </div>
    </div>
  )
}
