"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Category { id: string; name: string }

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    compareAtPrice: '',
    stock: 0,
    categoryId: '',
    published: true,
    featured: false,
  })

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    if (!form.slug && form.name) {
      setForm((f) => ({ ...f, slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }))
    }
  }, [form.name])

  const canSave = useMemo(() => form.name && form.slug && form.price > 0 && form.categoryId && images.length > 0, [form, images])

  async function handleUploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true); setError(null)
    try {
      const uploaded: string[] = []
      for (const file of Array.from(files)) {
        const presignRes = await fetch('/api/uploads/s3/presign', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename: file.name, contentType: file.type })
        })
        if (!presignRes.ok) throw new Error('Failed to get upload URL')
        const { uploadUrl, publicUrl } = await presignRes.json()
        const putRes = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })
        if (!putRes.ok) throw new Error('Upload failed')
        uploaded.push(publicUrl)
      }
      setImages((prev) => [...prev, ...uploaded])
    } catch (e: any) {
      setError(e?.message || 'Upload error')
    } finally { setUploading(false) }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!canSave) return
    setSaving(true); setError(null)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          description: form.description || null,
          price: Number(form.price),
          compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
          stock: Number(form.stock),
          categoryId: form.categoryId,
          published: form.published,
          featured: form.featured,
          images,
        })
      })
      if (!res.ok) throw new Error('Failed to create product')
      router.push('/admin/products')
    } catch (e: any) {
      setError(e?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  return (
    <main className="min-h-screen bg-platinum/20 admin-surface">
      <div className="bg-ink text-white">
        <div className="max-w-[1600px] mx-auto px-5 md:px-10 py-6">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-[1.75rem] font-medium">Add Product</h1>
            <div className="flex items-center gap-3">
              <Link href="/admin/products" className="text-sm hover:text-champagne transition-colors">Back to Products</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-5 md:px-10 py-10">
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
        <form onSubmit={handleSave} className="bg-white border border-hairline p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-hairline px-4 py-2 text-ink" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border border-hairline px-4 py-2 text-ink" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-hairline px-4 py-2 text-ink" rows={4} />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Price (THB)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full border border-hairline px-4 py-2 text-ink" min={0} step="0.01" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Compare At (THB)</label>
              <input type="number" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} className="w-full border border-hairline px-4 py-2 text-ink" min={0} step="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="w-full border border-hairline px-4 py-2 text-ink" min={0} required />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Category</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full border border-hairline px-4 py-2 text-ink" required>
                <option value="">Select category</option>
                {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
            <div className="flex gap-6 items-center">
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">Images</label>
            <input type="file" multiple accept="image/*" onChange={(e) => handleUploadFiles(e.target.files)} />
            {uploading && <p className="text-sm text-ink-2/70 mt-2">Uploading...</p>}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {images.map((src) => (
                  <div key={src} className="relative w-full aspect-[3/4] bg-platinum/20" style={{ backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Link href="/admin/products" className="flex-1 border border-hairline text-ink py-3 text-center uppercase tracking-wider text-sm hover:border-ink transition-colors">Cancel</Link>
            <button type="submit" disabled={!canSave || saving} className="flex-1 bg-ink text-white py-3 uppercase tracking-wider text-sm hover:bg-ink-2 transition-colors disabled:opacity-60">
              {saving ? 'Saving…' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

