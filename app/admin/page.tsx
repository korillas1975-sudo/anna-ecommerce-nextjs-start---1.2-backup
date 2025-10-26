"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { Package, ShoppingCart, Users, FileText, Settings, BarChart3, Moon, Sun } from 'lucide-react'

type Metrics = { orders: number; products: number; customers: number; revenue: number }

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('adminDark') === '1'
  })

  useEffect(() => {
    document.body.classList.toggle('admin-dark', dark)
    try { localStorage.setItem('adminDark', dark ? '1' : '0') } catch {}
  }, [dark])

  async function load() {
    const params = new URLSearchParams()
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    const res = await fetch(`/api/admin/metrics?${params.toString()}`)
    const data = await res.json()
    setMetrics(data)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to])

  const menuItems = [
    { label: 'Products', href: '/admin/products', icon: Package, description: 'Manage products and inventory' },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart, description: 'View and process orders' },
    { label: 'Customers', href: '/admin/customers', icon: Users, description: 'Manage customers' },
    { label: 'Content', href: '/admin/content', icon: FileText, description: 'Manage pages and content' },
    { label: 'Settings', href: '/admin/settings', icon: Settings, description: 'Site settings' },
  ]

  return (
    <main className="min-h-screen bg-platinum/20 admin-surface">
      {/* Header */}
      <div className="bg-ink text-white">
        <div className="max-w-[1600px] mx-auto px-5 md:px-10 py-6">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-[1.75rem] font-medium">Admin Dashboard</h1>
            <div className="flex items-center gap-3">
              <button onClick={() => setDark(d => !d)} className="border border-white/30 text-white/90 px-3 py-2 text-sm hover:bg-white/10 flex items-center gap-2">
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} {dark ? 'Light' : 'Dark'}
              </button>
              <Link href="/" className="text-sm hover:text-champagne transition-colors">Back to Store</Link>
              <button onClick={() => signOut({ callbackUrl: '/auth/login' })} className="border border-white/30 text-white/90 px-3 py-2 text-sm hover:bg-white/10">Sign out</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-5 md:px-10 py-10">
        {/* Filters */}
        <div className="flex gap-3 items-center mb-6">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border border-hairline px-3 py-2" />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border border-hairline px-3 py-2" />
          <button onClick={load} className="border border-hairline px-4 py-2 text-sm hover:border-ink">Apply</button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={ShoppingCart} label="Total Orders" value={metrics?.orders ?? 0} />
          <StatCard icon={Package} label="Total Products" value={metrics?.products ?? 0} />
          <StatCard icon={Users} label="Total Customers" value={metrics?.customers ?? 0} />
          <StatCard icon={BarChart3} label="Revenue" value={`THB ${(metrics?.revenue ?? 0).toLocaleString()}`} />
        </div>

        {/* Menu */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="bg-white admin-card border border-hairline p-6 hover:border-ink transition-colors group">
              <item.icon className="w-10 h-10 text-ink-2/40 mb-4 group-hover:text-ink transition-colors" />
              <h3 className="font-medium text-ink text-lg mb-2">{item.label}</h3>
              <p className="text-sm text-ink-2/60">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number }) {
  return (
    <div className="bg-white admin-card border border-hairline p-6">
      <div className="flex items-start justify-between mb-4">
        <Icon className="w-8 h-8 text-ink-2/40" />
      </div>
      <p className="text-2xl font-medium text-ink mb-1">{value}</p>
      <p className="text-sm text-ink-2/60">{label}</p>
    </div>
  )
}
