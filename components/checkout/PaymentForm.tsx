'use client'

import { useState } from 'react'
import { CreditCard, Building2 } from 'lucide-react'

export type PaymentMethod = 'credit_card' | 'bank_transfer'

export interface PaymentFormValues {
  method: PaymentMethod
}

interface PaymentFormProps {
  onSubmit: (data: PaymentFormValues) => void
  onBack: () => void
}

export default function PaymentForm({ onSubmit, onBack }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({ method: paymentMethod })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-hairline p-6 md:p-8 space-y-6">
      <h2 className="font-serif text-[1.5rem] font-medium text-ink mb-6">Payment Method</h2>

      <div className="space-y-3">
        <label className="flex items-center gap-4 p-4 border border-hairline cursor-pointer hover:border-ink transition-colors">
          <input
            type="radio"
            name="payment"
            value="credit_card"
            checked={paymentMethod === 'credit_card'}
            onChange={() => setPaymentMethod('credit_card')}
            className="w-5 h-5"
          />
          <CreditCard className="w-6 h-6 text-ink-2/60" />
          <div className="flex-1">
            <p className="font-medium text-ink">Credit / Debit Card</p>
            <p className="text-sm text-ink-2/60">Visa, Mastercard, Amex</p>
          </div>
        </label>

        <label className="flex items-center gap-4 p-4 border border-hairline cursor-pointer hover:border-ink transition-colors">
          <input
            type="radio"
            name="payment"
            value="bank_transfer"
            checked={paymentMethod === 'bank_transfer'}
            onChange={() => setPaymentMethod('bank_transfer')}
            className="w-5 h-5"
          />
          <Building2 className="w-6 h-6 text-ink-2/60" />
          <div className="flex-1">
            <p className="font-medium text-ink">Bank Transfer</p>
            <p className="text-sm text-ink-2/60">Direct bank transfer</p>
          </div>
        </label>
      </div>

      {paymentMethod === 'credit_card' && (
        <div className="space-y-4 pt-4">
          <div>
            <label className="block text-sm text-ink mb-2">Card Number</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="1234 5678 9012 3456"
              className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-ink mb-2">Expiry Date</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM/YY"
                className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="block text-sm text-ink mb-2">CVV</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="123"
                className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-hairline text-ink py-4 uppercase tracking-wider text-sm hover:border-ink transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 bg-ink text-white py-4 uppercase tracking-wider text-sm hover:bg-ink-2 transition-colors"
        >
          Review Order
        </button>
      </div>
    </form>
  )
}
