"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface AdminPageItem {
  id: string
  title: string
  slug: string
  published: boolean
  updatedAt: string
}

export default function AdminContentPage() {
  const [items, setItems] = useState<AdminPageItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/content')
      if (!res.ok) throw new Error('Failed to load content')
      const data = await res.json()
      setItems(data)
    } catch (e) {
      console.error(e)
      alert('Failed to load content')
    } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen bg-platinum/20 admin-surface">
      <div className="bg-ink text-white">
        <div className="max-w-[1600px] mx-auto px-5 md:px-10 py-6">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-[1.75rem] font-medium">Content</h1>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="text-sm hover:text-champagne transition-colors">Back to Dashboard</Link>
              <button onClick={() => signOut({ callbackUrl: '/auth/login' })} className="border border-white/30 text-white/90 px-3 py-2 text-sm hover:bg-white/10">Sign out</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-5 md:px-10 py-10">
        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-ink-2/70">No content pages yet</div>
        ) : (
          <div className="bg-white admin-card border border-hairline overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead className="bg-platinum/30 border-b border-hairline">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-ink">Title</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-ink">Slug</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-ink">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-ink">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p.id} className="border-b border-hairline hover:bg-platinum/10">
                      <td className="px-6 py-4 text-ink">{p.title}</td>
                      <td className="px-6 py-4 text-ink-2/80">{p.slug}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs ${p.published ? 'bg-champagne/20 text-ink' : 'bg-ink-2/10 text-ink-2/60'}`}>
                          {p.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-ink-2/80">{new Date(p.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

