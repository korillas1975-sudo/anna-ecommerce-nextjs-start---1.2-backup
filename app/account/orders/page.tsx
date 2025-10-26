'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    images: string[]
  } | null
}

interface AccountOrder {
  id: string
  orderNumber: string
  createdAt: string
  status: string
  total: number
  items: OrderItem[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<AccountOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders')
        if (res.status === 401) {
          setError('Please sign in to view your orders.')
          return
        }
        if (!res.ok) {
          throw new Error('Failed to load orders')
        }
        const data: AccountOrder[] = await res.json()
        setOrders(data)
      } catch (err) {
        console.error('Failed to fetch orders:', err)
        setError('??????????????????????????????')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center">
        <p>Loading orders...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center max-w-md px-5">
          <Heart className="w-20 h-20 mx-auto mb-6 text-ink-2/20" strokeWidth={1} />
          <p className="text-ink-2/70">{error}</p>
          <Link
            href="/products"
            className="inline-block bg-ink text-white py-3 px-8 uppercase tracking-wider text-sm hover:bg-ink-2 transition-colors mt-6"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    )
  }

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center max-w-md px-5">
          <Heart className="w-20 h-20 mx-auto mb-6 text-ink-2/20" strokeWidth={1} />
          <p className="text-ink-2/70 mb-6">You haven&rsquo;t placed any orders yet</p>
          <Link
            href="/products"
            className="inline-block bg-ink text-white py-3 px-8 uppercase tracking-wider text-sm hover:bg-ink-2 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg">
      <div className="border-b border-hairline bg-white">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-12">
          <h1 className="font-serif text-[2rem] md:text-[3rem] font-medium text-ink">My Orders</h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-10 space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-hairline p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-hairline">
              <div>
                <p className="font-medium text-ink">Order {order.orderNumber}</p>
                <p className="text-sm text-ink-2/60">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <span className="inline-block px-3 py-1 bg-champagne/20 text-ink text-sm capitalize">
                  {order.status.replace('_', ' ')}
                </span>
                <p className="font-medium text-ink">?{order.total.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-24 flex-shrink-0 bg-platinum/20">
                    <Image
                      src={item.product?.images?.[0] ?? '/assets/img/logo-anna-paris.png'}
                      alt={item.product?.name ?? 'Product image'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-ink">{item.product?.name ?? 'Unknown product'}</h3>
                    <p className="text-sm text-ink-2/60">Qty: {item.quantity}</p>
                    <p className="text-ink mt-1">?{item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
