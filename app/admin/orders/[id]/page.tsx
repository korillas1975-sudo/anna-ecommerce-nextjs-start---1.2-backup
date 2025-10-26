'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { signOut } from 'next-auth/react'

interface OrderItem {
  id: string
  quantity: number
  price: number
  variant?: string | null
  product: {
    id: string
    name: string
    images: string[]
  } | null
}

interface ShippingAddress {
  firstName?: string
  lastName?: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  phone?: string
  email?: string
}

interface AdminOrderDetail {
  id: string
  orderNumber: string
  status: string
  total: number
  createdAt: string
  paymentMethod: string | null
  shippingAddress: ShippingAddress | null
  items: OrderItem[]
  notes?: Array<{ id: string; author: string; message: string; at: string }>
}

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<AdminOrderDetail | null>(null)
  const [updating, setUpdating] = useState(false)
  const [note, setNote] = useState('')
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    params.then(p => setOrderId(p.id))
  }, [params])

  useEffect(() => {
    if (!orderId) return
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (!res.ok) {
          throw new Error('Failed to load order')
        }
        const data: AdminOrderDetail = await res.json()
        setOrder(data)
      } catch (error) {
        console.error('Failed to fetch order:', error)
        setOrder(null)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  async function updateStatus(newStatus: string) {
    if (!order || !orderId) return
    setUpdating(true)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        const updatedOrder: AdminOrderDetail = await res.json()
        setOrder(updatedOrder)
      } else {
        alert('Failed to update order status')
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  async function addNote() {
    if (!order || !note.trim()) return
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: note.trim() }),
      })
      if (res.ok) {
        const { entry } = await res.json()
        setOrder({ ...order, notes: [entry, ...(order.notes || [])] })
        setNote('')
      } else {
        alert('Failed to add note')
      }
    } catch (e) {
      console.error(e)
      alert('Failed to add note')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-platinum/20 flex items-center justify-center">
        <p>Loading...</p>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-platinum/20 flex items-center justify-center">
        <p>Order not found</p>
      </main>
    )
  }

  const shippingAddress = order.shippingAddress

  return (
    <main className="min-h-screen bg-platinum/20 admin-surface">
      <div className="bg-ink text-white">
        <div className="max-w-[1600px] mx-auto px-5 md:px-10 py-6">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-[1.75rem] font-medium">Order {order.orderNumber}</h1>
            <div className="flex items-center gap-3">
              <Link href="/admin/orders" className="text-sm hover:text-champagne transition-colors flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Orders
              </Link>
              <button onClick={() => signOut({ callbackUrl: '/auth/login' })} className="border border-white/30 text-white/90 px-3 py-2 text-sm hover:bg-white/10">Sign out</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-10">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-hairline p-6">
              <h2 className="font-serif text-xl font-medium text-ink mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-hairline pb-4 last:border-0 last:pb-0">
                    <div className="relative w-20 h-20 flex-shrink-0 bg-platinum/20">
                      <Image
                        src={item.product?.images?.[0] ?? '/assets/img/logo-anna-paris.png'}
                        alt={item.product?.name ?? 'Product image'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-ink">{item.product?.name ?? 'Unknown product'}</h3>
                      {item.variant && <p className="text-sm text-ink-2/60">Variant: {item.variant}</p>}
                      <p className="text-sm text-ink-2/60">Qty: {item.quantity}</p>
                      <p className="text-ink font-medium mt-1">THB {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {shippingAddress && (
              <div className="bg-white border border-hairline p-6">
                <h2 className="font-serif text-xl font-medium text-ink mb-4">Shipping Address</h2>
                <p className="text-ink-2/70">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                  <br />
                  {shippingAddress.address1}
                  <br />
                  {shippingAddress.address2 && (
                    <>
                      {shippingAddress.address2}
                      <br />
                    </>
                  )}
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                  <br />
                  {shippingAddress.country}
                  <br />
                  Phone: {shippingAddress.phone}
                  <br />
                  Email: {shippingAddress.email}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-hairline p-6">
              <h2 className="font-serif text-xl font-medium text-ink mb-4">Order Status</h2>
              <select
                value={order.status}
                onChange={(e) => updateStatus(e.target.value)}
                disabled={updating}
                className="w-full border border-hairline px-4 py-2 text-ink disabled:opacity-50"
              >
                <option value="pending">Pending</option>
                <option value="pending_payment">Pending Payment</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="bg-white border border-hairline p-6">
              <h2 className="font-serif text-xl font-medium text-ink mb-4">Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-2/70">Payment Method:</span>
                  <span className="text-ink capitalize">{order.paymentMethod?.replace('_', ' ') ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-2/70">Order Date:</span>
                  <span className="text-ink">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-hairline text-lg font-medium">
                  <span className="text-ink">Total:</span>
                  <span className="text-ink">THB {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-hairline p-6">
              <h2 className="font-serif text-xl font-medium text-ink mb-4">Internal Notes</h2>
              <div className="flex gap-2 mb-4">
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note for this order"
                  className="flex-1 border border-hairline px-3 py-2"
                />
                <button onClick={addNote} className="border border-ink text-ink px-4 py-2 hover:bg-platinum">
                  Add
                </button>
              </div>
              <div className="space-y-3">
                {(order.notes || []).map((n) => (
                  <div key={n.id} className="text-sm border-b border-hairline pb-2">
                    <p className="text-ink">{n.message}</p>
                    <p className="text-ink-2/60">{n.author} • {new Date(n.at).toLocaleString()}</p>
                  </div>
                ))}
                {(!order.notes || order.notes.length === 0) && (
                  <p className="text-ink-2/60 text-sm">No notes yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
