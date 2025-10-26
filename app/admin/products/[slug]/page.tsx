'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Category {
  id: string
  name: string
}

interface ProductForm {
  name: string
  slug: string
  description: string
  price: number
  compareAtPrice: number | null
  stock: number
  categoryId: string
  published: boolean
  featured: boolean
}

interface ProductResponse {
  product: {
    id: string
    name: string
    slug: string
    description: string | null
    price: number
    compareAtPrice: number | null
    stock: number
    categoryId: string
    published: boolean
    featured: boolean
  }
}

export default function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [productSlug, setProductSlug] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    slug: '',
    description: '',
    price: 0,
    compareAtPrice: null,
    stock: 0,
    categoryId: '',
    published: true,
    featured: false,
  })

  useEffect(() => {
    params.then(p => setProductSlug(p.slug))
  }, [params])

  useEffect(() => {
    if (!productSlug) return
    async function fetchData() {
      try {
        setLoading(true)
        const [productRes, categoriesRes] = await Promise.all([
          fetch(`/api/products/${productSlug}`),
          fetch('/api/categories'),
        ])

        if (!productRes.ok) {
          throw new Error('Failed to load product')
        }

        const productPayload = (await productRes.json()) as ProductResponse
        const productData = productPayload.product

        if (!productData) {
          throw new Error('Product not found')
        }

        if (!categoriesRes.ok) {
          throw new Error('Failed to load categories')
        }

        const categoriesData: Category[] = await categoriesRes.json()

        setCategories(categoriesData)
        setFormData({
          name: productData.name,
          slug: productData.slug,
          description: productData.description ?? '',
          price: productData.price,
          compareAtPrice: productData.compareAtPrice,
          stock: productData.stock,
          categoryId: productData.categoryId,
          published: productData.published,
          featured: productData.featured,
        })
      } catch (error) {
        console.error('Failed to fetch product:', error)
        alert('????????????????????????????')
        router.push('/admin/products')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [productSlug, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productSlug) return
    setSaving(true)

    try {
      const res = await fetch(`/api/products/${productSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/admin/products')
      } else {
        alert('Failed to update product')
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-platinum/20 flex items-center justify-center">
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-platinum/20">
      <div className="bg-ink text-white">
        <div className="max-w-[1600px] mx-auto px-5 md:px-10 py-6">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-[1.75rem] font-medium">Edit Product</h1>
            <Link href="/admin/products" className="text-sm hover:text-champagne transition-colors flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-5 md:px-10 py-10">
        <form onSubmit={handleSubmit} className="bg-white border border-hairline p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-hairline px-4 py-2 text-ink"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full border border-hairline px-4 py-2 text-ink"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-hairline px-4 py-2 text-ink"
                rows={4}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Price (?)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-hairline px-4 py-2 text-ink"
                  min={0}
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Compare At Price (?)</label>
                <input
                  type="number"
                  value={formData.compareAtPrice ?? ''}
                  onChange={(e) => {
                    const value = e.target.value
                    setFormData({
                      ...formData,
                      compareAtPrice: value === '' ? null : parseFloat(value),
                    })
                  }}
                  className="w-full border border-hairline px-4 py-2 text-ink"
                  min={0}
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                  className="w-full border border-hairline px-4 py-2 text-ink"
                  min={0}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full border border-hairline px-4 py-2 text-ink"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-ink">Published</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-ink">Featured</span>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <Link
                href="/admin/products"
                className="flex-1 border border-hairline text-ink py-3 text-center uppercase tracking-wider text-sm hover:border-ink transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-ink text-white py-3 uppercase tracking-wider text-sm hover:bg-ink-2 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
