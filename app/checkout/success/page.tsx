"use client"

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { useCartStore } from '@/lib/stores/cart-store'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber') || 'N/A'
  const sessionId = searchParams.get('session_id')
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    if (sessionId) clearCart()
  }, [sessionId, clearCart])

  return (
    <div className="text-center max-w-md px-5">
      <CheckCircle className="w-20 h-20 mx-auto mb-6 text-champagne" strokeWidth={1.5} />
      <h1 className="font-serif text-[2rem] md:text-[2.5rem] font-medium text-ink mb-4">Order Confirmed!</h1>
      <p className="text-ink-2/70 mb-2">Thank you for your purchase.</p>
      <p className="text-sm text-ink-2/50 mb-4">Order Number: <span className="font-medium text-ink">{orderNumber}</span></p>
      <p className="text-ink-2/70 mb-8">You will receive an email confirmation shortly.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/account/orders" className="inline-block bg-ink text-white py-3 px-8 uppercase tracking-wider text-sm hover:bg-ink-2 transition-colors">View Order</Link>
        <Link href="/products" className="inline-block border border-hairline text-ink py-3 px-8 uppercase tracking-wider text-sm hover:border-ink transition-colors">Continue Shopping</Link>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-bg flex items-center justify-center">
      <Suspense fallback={<div className="text-ink-2">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  )
}
