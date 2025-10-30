'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/stores/cart-store'
import CheckoutSteps from '@/components/checkout/CheckoutSteps'
import ShippingForm, { type ShippingFormValues } from '@/components/checkout/ShippingForm'
import PaymentForm, { type PaymentFormValues } from '@/components/checkout/PaymentForm'
import OrderReview from '@/components/checkout/OrderReview'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingData, setShippingData] = useState<ShippingFormValues | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentFormValues | null>(null)

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const handleShippingSubmit = (data: ShippingFormValues) => {
    setShippingData(data)
    setCurrentStep(2)
  }

  const handlePaymentSubmit = (data: PaymentFormValues) => {
    setPaymentData(data)
    setCurrentStep(3)
  }

  const handleOrderSubmit = async () => {
    if (!shippingData || !paymentData) return

    try {
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        variant: item.variant,
      }))

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress: shippingData,
          paymentMethod: paymentData.method,
          total,
        }),
      })

      if (response.ok) {
        const order = await response.json()
        if (paymentData.method === 'credit_card') {
          // Create Stripe Checkout session and redirect
          const res = await fetch('/api/payments/stripe/create-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: order.orderId }),
          })
          if (!res.ok) throw new Error('Failed to start payment')
          const data = await res.json()
          if (data.url) {
            // Do not clear cart yet; clear after success
            (typeof window !== 'undefined' ? (window.location.href = data.url as string) : router.push(data.url as string))
            return
          }
          throw new Error('Payment URL missing')
        } else {
          // Non-card method: finish order locally
          clearCart()
          router.push(`/checkout/success?orderNumber=${order.orderNumber}`)
        }
      } else {
        alert('Failed to create order. Please try again.')
      }
    } catch (error) {
      console.error('Order submission error:', error)
      alert('Failed to create order. Please try again.')
    }
  }

  return (
    <main className="min-h-screen bg-bg">
      <div className="border-b border-hairline bg-white">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-8 md:py-12">
          <h1 className="font-serif text-[2rem] md:text-[3rem] font-medium text-ink">Checkout</h1>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-8">
        <CheckoutSteps currentStep={currentStep} />
      </div>

      <div className="max-w-[900px] mx-auto px-5 md:px-10 pb-20">
        {currentStep === 1 && <ShippingForm onSubmit={handleShippingSubmit} />}
        {currentStep === 2 && <PaymentForm onSubmit={handlePaymentSubmit} onBack={() => setCurrentStep(1)} />}
        {currentStep === 3 && shippingData && paymentData && (
          <OrderReview
            shippingData={shippingData}
            paymentData={paymentData}
            onSubmit={handleOrderSubmit}
            onBack={() => setCurrentStep(2)}
          />
        )}
      </div>
    </main>
  )
}

