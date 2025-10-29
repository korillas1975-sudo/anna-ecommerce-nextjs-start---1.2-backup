'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  _count: { products: number }
}

const SORT_OPTIONS = [
  { label: 'Newest', sort: 'createdAt', order: 'desc' },
  { label: 'Price: Low to High', sort: 'price', order: 'asc' },
  { label: 'Price: High to Low', sort: 'price', order: 'desc' },
  { label: 'Name Aâ†’Z', sort: 'name', order: 'asc' },
]

export default function MobileProductsControls() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const currentCategory = searchParams.get('category') ?? ''
  const currentSort = searchParams.get('sort') ?? 'createdAt'
  const currentOrder = searchParams.get('order') ?? 'desc'

  const [selectedCategory, setSelectedCategory] = useState(currentCategory)
  const [selectedSort, setSelectedSort] = useState(`${currentSort}:${currentOrder}`)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        setCategories(data)
      } catch {}
    }
    fetchCategories()
  }, [])

  // Build url with updated params
  const apply = () => {
    const params = new URLSearchParams(searchParams.toString())
    // Category
    if (selectedCategory) params.set('category', selectedCategory)
    else params.delete('category')
    // Sort
    const [s, o] = selectedSort.split(':')
    params.set('sort', s)
    params.set('order', o || 'desc')
    router.push(`/products?${params.toString()}`)
    setOpen(false)
  }

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    router.push(`/products?${params.toString()}`)
    setSelectedCategory('')
  }

  const sortValue = useMemo(() => `${currentSort}:${currentOrder}`, [currentSort, currentOrder])

  // Allow Back button to close the drawer
  useEffect(() => {
    const onPop = () => setOpen(false)
    if (open) {
      try { history.pushState({ drawer: "filter" }, "") } catch {}
      window.addEventListener("popstate", onPop)
      return () => window.removeEventListener("popstate", onPop)
    }
  }, [open])

  return (
    <>
      {/* Sticky controls bar (mobile/tablet) */}
      <div className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-hairline">
        <div className="max-w-[1700px] mx-auto px-5 py-3 flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-3 py-2 border border-hairline text-sm rounded-full bg-white active:scale-[0.98]"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>

          <div className="ml-auto">
            <select
              className="px-3 py-2 text-sm border border-hairline rounded-full bg-white"
              value={sortValue}
              onChange={(e) => {
                setSelectedSort(e.target.value)
                const [s, o] = e.target.value.split(':')
                const params = new URLSearchParams(searchParams.toString())
                params.set('sort', s)
                params.set('order', o || 'desc')
                router.push(`/products?${params.toString()}`)
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.label} value={`${opt.sort}:${opt.order}`}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
              <div className="font-medium">Filter</div>
              <button onClick={() => setOpen(false)} aria-label="Close filter" className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto no-scrollbar" style={{ maxHeight: 'calc(80vh - 56px - 64px)' }}>
              <div>
                <h3 className="font-serif text-[1.1rem] text-ink mb-3 font-medium">Categories</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-3 py-2 border rounded-full text-left ${
                      selectedCategory === '' ? 'bg-ink text-white border-ink' : 'border-hairline'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`px-3 py-2 border rounded-full text-left ${
                        selectedCategory === cat.slug ? 'bg-ink text-white border-ink' : 'border-hairline'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-hairline flex items-center gap-3">
              <button onClick={clearAll} className="px-4 py-2 text-sm border border-hairline rounded-full">Clear</button>
              <button onClick={apply} className="px-5 py-2 text-sm rounded-full bg-ink text-white ml-auto">Apply</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


