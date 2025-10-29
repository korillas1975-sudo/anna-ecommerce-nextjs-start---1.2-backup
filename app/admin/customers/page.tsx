"use client"

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface AdminCustomer {
  id: string
  name: string | null
  email: string
  createdAt: string
  _count: { orders: number }
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      const res = await fetch(`/api/admin/customers?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to load customers')
      const data = await res.json()
      setCustomers(data)
    } catch (e) {
      console.error(e)
      alert('Failed to load customers')
    } finally { setLoading(false) }
  }, [q])

  useEffect(() => { fetchCustomers() }, [fetchCustomers])

  return (
    <main className="min-h-screen bg-platinum/20 admin-surface">
      <div className="bg-ink text-white">
        <div className="max-w-[1600px] mx-auto px-5 md:px-10 py-6">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-[1.75rem] font-medium">Customers</h1>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="text-sm hover:text-champagne transition-colors">Back to Dashboard</Link>
              <button onClick={() => signOut({ callbackUrl: '/auth/login' })} className="border border-white/30 text-white/90 px-3 py-2 text-sm hover:bg-white/10">Sign out</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-5 md:px-10 py-10">
        <div className="flex gap-3 mb-6">
          <input value={q} onChange={(e) => setQ(e.target.value)} className="border border-hairline px-3 py-2 w-[260px]" placeholder="Search name or email" />
          <button onClick={fetchCustomers} className="border border-hairline px-4 py-2 text-sm hover:border-ink">Search</button>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-20 text-ink-2/70">No customers found</div>
        ) : (
          <div className="bg-white admin-card border border-hairline overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead className="bg-platinum/30 border-b border-hairline">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-ink">Name</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-ink">Email</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-ink">Orders</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-ink">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} className="border-b border-hairline hover:bg-platinum/10">
                      <td className="px-6 py-4 text-ink">{c.name || '-'}</td>
                      <td className="px-6 py-4 text-ink-2/80">{c.email}</td>
                      <td className="px-6 py-4 text-ink-2/80">{c._count?.orders ?? 0}</td>
                      <td className="px-6 py-4 text-ink-2/80">{new Date(c.createdAt).toLocaleDateString()}</td>
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
