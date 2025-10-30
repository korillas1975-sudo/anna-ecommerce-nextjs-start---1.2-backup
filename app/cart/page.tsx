'use client'

import { useCartStore } from '@/lib/stores/cart-store'
import Image from 'next/image'
import Link from 'next/link'
import { formatTHB } from '@/lib/utils/currency'
import { Trash2, ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, shipping, total } = useCartStore()

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center max-w-md px-5">
          <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-ink-2/20" strokeWidth={1} />
          <h1 className="font-serif text-[2rem] md:text-[2.5rem] font-medium text-ink mb-4">
            Your cart is empty
          </h1>
          <p className="text-ink-2/70 mb-8">Discover our exquisite collection of luxury jewelry</p>
          <Link href="/products" className="inline-block bg-ink text-white py-3 px-8 uppercase tracking-wider text-sm hover:bg-ink-2 transition-colors">
            Shop Now
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg">
      {/* Header */}
      <div className="border-b border-hairline bg-white">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-8 md:py-12">
          <h1 className="font-serif text-[2rem] md:text-[3rem] font-medium text-ink">Shopping Cart</h1>
          <p className="text-ink-2/70 mt-2">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-10 md:py-14">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 md:gap-6 bg-white border border-hairline p-4 md:p-6">
                {/* Image */}
                <div className="relative w-24 h-32 md:w-32 md:h-40 flex-shrink-0 bg-platinum/20">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-[1.1rem] md:text-[1.25rem] text-ink mb-1">{item.name}</h3>
                    {item.variant && (<p className="text-sm text-ink-2/60">Size: {item.variant}</p>)}
                    <p className="text-ink font-medium mt-2">{formatTHB(item.price)}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center border border-hairline hover:border-ink transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center border border-hairline hover:border-ink transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <button onClick={() => removeItem(item.id)} className="text-ink-2/60 hover:text-ink transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white border border-hairline p-6 space-y-4">
              <h2 className="font-serif text-[1.5rem] font-medium text-ink mb-4">Order Summary</h2>

              <div className="space-y-3 pb-4 border-b border-hairline">
                <div className="flex justify-between text-ink-2/70">
                  <span>Subtotal</span>
                  <span>{formatTHB(subtotal)}</span>
                </div>
                <div className="flex justify-between text-ink-2/70">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatTHB(shipping)}</span>
                </div>
                {shipping === 0 && subtotal < 3000 && (
                  <p className="text-xs text-champagne">Add {formatTHB(3000 - subtotal)} more for free shipping</p>
                )}
              </div>

              <div className="flex justify-between text-[1.25rem] font-medium text-ink pt-2">
                <span>Total</span>
                <span>{formatTHB(total)}</span>
              </div>

              <Link href="/checkout" className="block w-full bg-ink text-white text-center py-4 uppercase tracking-wider text-sm hover:bg-ink-2 transition-colors mt-6">
                Buy Now
              </Link>

              <Link href="/products" className="block text-center text-sm text-ink-2/70 hover:text-ink transition-colors mt-4">
                Continue Shopping
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 bg-platinum/30 p-6 space-y-3 text-sm text-ink-2/70">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-champagne rounded-full" />
                Secure checkout with SSL encryption
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-champagne rounded-full" />
                30-day hassle-free returns
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-champagne rounded-full" />
                Authenticity certificate included
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
