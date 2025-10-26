"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { signOut } from 'next-auth/react'

interface AdminProduct {
  id: string
  name: string
  slug: string
  sku?: string | null
  price: number
  stock: number
  published: boolean
  featured: boolean
  images: string[]
  category?: { id: string; name: string }
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      const res = await fetch('/api/products')
      if (!res.ok) throw new Error('Failed to load products')
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Fetch products error:', error)
      alert('Failed to load products')
    } finally { setLoading(false) }
  }

  async function handleDelete(slug: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return
    try {
      const res = await fetch(`/api/products/${slug}`, { method: 'DELETE' })
      if (res.ok) fetchProducts(); else alert('Failed to delete product')
    } catch (e) { console.error(e); alert('Failed to delete product') }
  }

  return (
    <main className="min-h-screen bg-platinum/20 admin-surface">
      <div className="bg-ink text-white">
        <div className="max-w-[1600px] mx-auto px-5 md:px-10 py-6">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-[1.75rem] font-medium">Products</h1>
            <div className="flex gap-3">
              <Link href="/admin" className="text-sm hover:text-champagne transition-colors">Back to Dashboard</Link>
              <button onClick={() => signOut({ callbackUrl: '/auth/login' })} className="border border-white/30 text-white/90 px-3 py-2 text-sm hover:bg-white/10">Sign out</button>
              <button className="flex items-center gap-2 bg-champagne text-ink px-4 py-2 text-sm font-medium hover:bg-champagne/90 transition-colors">
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-5 md:px-10 py-10">
        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : (
          <div className="bg-white admin-card border border-hairline overflow-hidden">
            <table className="w-full">
              <thead className="bg-platinum/30 border-b border-hairline">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-ink">Product</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-ink">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-ink">Price</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-ink">Stock</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-ink">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-ink">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-hairline hover:bg-platinum/10">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 flex-shrink-0 bg-platinum/20">
                          <Image src={product.images?.[0] ?? '/assets/img/logo-anna-paris.png'} alt={product.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-ink">{product.name}</p>
                          {product.sku && (<p className="text-xs text-ink-2/60">{product.sku}</p>)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-2/70">{product.category?.name ?? '-'}</td>
                    <td className="px-6 py-4 text-sm text-ink font-medium">THB {product.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-ink-2/70">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-xs ${product.published ? 'bg-champagne/20 text-ink' : 'bg-ink-2/10 text-ink-2/60'}`}>
                        {product.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product.slug}`} className="p-2 hover:bg-platinum/20 transition-colors">
                          <Edit className="w-4 h-4 text-ink-2/60" />
                        </Link>
                        <button onClick={() => handleDelete(product.slug, product.name)} className="p-2 hover:bg-platinum/20 transition-colors">
                          <Trash2 className="w-4 h-4 text-ink-2/60" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}

