"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatTHB } from '@/lib/utils/currency'
import { ArrowLeft } from 'lucide-react'

interface AdminOrder {
  id: string
  orderNumber: string
  createdAt: string
  status: string
  total: number
  items: Array<{ id: string }>
}

import { signOut } from 'next-auth/react'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  // Filters
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  // Column chooser
  const [cols, setCols] = useState({
    orderNumber: true,
    date: true,
    status: true,
    items: true,
    total: true,
  })

  useEffect(() => {
    // restore filters
    try {
      const saved = localStorage.getItem('adminOrdersFilters')
      if (saved) {
        const f = JSON.parse(saved)
        setQ(f.q ?? '')
        setStatus(f.status ?? '')
        setFrom(f.from ?? '')
        setTo(f.to ?? '')
      }
    } catch {}
  }, [])

  useEffect(() => {
    // persist filters
    try {
      localStorage.setItem('adminOrdersFilters', JSON.stringify({ q, status, from, to }))
    } catch {}
  }, [q, status, from, to])

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (q) params.set('q', q)
        if (status) params.set('status', status)
        if (from) params.set('from', from)
        if (to) params.set('to', to)
        const res = await fetch(`/api/admin/orders?${params.toString()}`)
        if (!res.ok) throw new Error('Failed to load orders')
        const data: AdminOrder[] = await res.json()
        setOrders(data)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        alert('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [q, status, from, to])

  async function quickUpdateStatus(id: string, newStatus: string) {
    try {
      setSaving(id)
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Update failed')
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)))
    } catch (e) {
      console.error(e)
      alert('Failed to update status')
    } finally {
      setSaving(null)
    }
  }

  return (
    <main className="min-h-screen bg-platinum/20 admin-surface">
      <div className="bg-ink text-white">
        <div className="max-w-[1600px] mx-auto px-5 md:px-10 py-6">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-[1.75rem] font-medium">Orders</h1>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="text-sm hover:text-champagne transition-colors flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <button onClick={() => signOut({ callbackUrl: '/auth/login' })} className="border border-white/30 text-white/90 px-3 py-2 text-sm hover:bg-white/10">Sign out</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-5 md:px-10 py-10">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
          <div className="flex gap-3 flex-wrap">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search orders or email" className="border border-hairline px-3 py-2 w-[260px]" />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-hairline px-3 py-2">
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border border-hairline px-3 py-2" />
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border border-hairline px-3 py-2" />
            <details className="border border-hairline px-3 py-2">
              <summary className="cursor-pointer text-sm">Columns</summary>
              <div className="flex gap-3 pt-2">
                {Object.entries(cols).map(([k, v]) => (
                  <label key={k} className="text-sm flex items-center gap-2">
                    <input type="checkbox" checked={v} onChange={(e) => setCols({ ...cols, [k]: e.target.checked })} /> {k}
                  </label>
                ))}
              </div>
            </details>
          </div>
          <div>
            <a
              href={`/api/admin/orders/export?${new URLSearchParams({ ...(q ? { q } : {}), ...(status ? { status } : {}), ...(from ? { from } : {}), ...(to ? { to } : {}) }).toString()}`}
              className="inline-block border border-hairline px-4 py-2 text-sm text-ink hover:border-ink"
            >
              Export CSV
            </a>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-ink-2/60">No orders yet</p>
          </div>
        ) : (
          <div className="bg-white border border-hairline overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
              <thead className="bg-platinum/30 border-b border-hairline">
                <tr>
                  {cols.orderNumber && <th className="text-left px-6 py-4 text-sm font-medium text-ink">Order Number</th>}
                  {cols.date && <th className="text-left px-6 py-4 text-sm font-medium text-ink">Date</th>}
                  {cols.status && <th className="text-left px-6 py-4 text-sm font-medium text-ink">Status</th>}
                  {cols.items && <th className="text-left px-6 py-4 text-sm font-medium text-ink">Items</th>}
                  {cols.total && <th className="text-right px-6 py-4 text-sm font-medium text-ink">Total</th>}
                  <th className="text-right px-6 py-4 text-sm font-medium text-ink">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-hairline hover:bg-platinum/10">
                    {cols.orderNumber && (
                      <td className="px-6 py-4">
                        <Link href={`/admin/orders/${order.id}`} className="font-medium text-ink hover:text-champagne">
                          {order.orderNumber}
                        </Link>
                      </td>
                    )}
                    {cols.date && (
                      <td className="px-6 py-4 text-sm text-ink-2/70">{new Date(order.createdAt).toLocaleDateString()}</td>
                    )}
                    {cols.status && (
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 text-xs bg-champagne/20 text-ink capitalize">
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                    )}
                    {cols.items && (
                      <td className="px-6 py-4 text-sm text-ink-2/70">{order.items?.length || 0} items</td>
                    )}
                    {cols.total && (
                      <td className="px-6 py-4 text-right text-sm text-ink font-medium">{formatTHB(order.total)}</td>
                    )}
                    <td className="px-6 py-4 text-right">
                      <select
                        className="border border-hairline px-2 py-1 text-sm"
                        value={order.status}
                        onChange={(e) => quickUpdateStatus(order.id, e.target.value)}
                        disabled={saving === order.id}
                      >
                        <option value="pending">Pending</option>
                        <option value="pending_payment">Pending Payment</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
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
