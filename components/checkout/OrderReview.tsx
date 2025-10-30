'use client'

import Image from 'next/image'
import { useCartStore } from '@/lib/stores/cart-store'
import type { ShippingFormValues } from '@/components/checkout/ShippingForm'
import type { PaymentFormValues } from '@/components/checkout/PaymentForm'
import { formatTHB } from '@/lib/utils/currency'

interface OrderReviewProps {
  shippingData: ShippingFormValues
  paymentData: PaymentFormValues
  onSubmit: () => void
  onBack: () => void
}

export default function OrderReview({ shippingData, paymentData, onSubmit, onBack }: OrderReviewProps) {
  const { items, subtotal, shipping, total } = useCartStore()

  return (
    <div className="space-y-6">
      <div className="bg-white border border-hairline p-6 md:p-8">
        <h2 className="font-serif text-[1.5rem] font-medium text-ink mb-6">Order Summary</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative w-20 h-24 flex-shrink-0 bg-platinum/20">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-ink">{item.name}</h3>
                {item.variant && <p className="text-sm text-ink-2/60">Variant: {item.variant}</p>}
                <p className="text-sm text-ink-2/60">Qty: {item.quantity}</p>
                <p className="text-ink font-medium mt-1">{formatTHB(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-hairline mt-6 pt-4 space-y-2">
          <div className="flex justify-between text-ink-2/70">
            <span>Subtotal</span>
            <span>{formatTHB(subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink-2/70">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatTHB(shipping)}</span>
          </div>
          <div className="flex justify-between text-[1.25rem] font-medium text-ink pt-2 border-t border-hairline">
            <span>Total</span>
            <span>{formatTHB(total)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-hairline p-6 md:p-8">
        <h2 className="font-serif text-[1.25rem] font-medium text-ink mb-4">Shipping Address</h2>
        <p className="text-ink-2/70">
          {shippingData.firstName} {shippingData.lastName}
          <br />
          {shippingData.address1}
          <br />
          {shippingData.address2 && (
            <>
              {shippingData.address2}
              <br />
            </>
          )}
          {shippingData.city}, {shippingData.state} {shippingData.postalCode}
          <br />
          {shippingData.country}
          <br />
          {shippingData.phone}
        </p>
      </div>

      <div className="bg-white border border-hairline p-6 md:p-8">
        <h2 className="font-serif text-[1.25rem] font-medium text-ink mb-4">Payment Method</h2>
        <p className="text-ink-2/70 capitalize">{paymentData.method.replace('_', ' ')}</p>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-hairline text-ink py-4 uppercase tracking-wider text-sm hover:border-ink transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="flex-1 bg-ink text-white py-4 uppercase tracking-wider text-sm hover:bg-ink-2 transition-colors"
        >
          Place Order
        </button>
      </div>
    </div>
  )
}

