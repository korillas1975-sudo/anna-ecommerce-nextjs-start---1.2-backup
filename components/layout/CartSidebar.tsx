'use client'

import { useEffect } from 'react'
import { X, ShoppingCart, Minus, Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/stores/cart-store'
import { useUIStore } from '@/lib/stores/ui-store'
import { cn } from '@/lib/utils/cn'
import { formatTHB } from '@/lib/utils/currency'

export function CartSidebar() {
  const { items, subtotal, shipping, total, updateQuantity, removeItem } = useCartStore()
  const { isCartOpen, closeCart } = useUIStore()

  const isEmpty = items.length === 0

  // Prevent body scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.classList.add('cart-open')
    } else {
      document.body.classList.remove('cart-open')
    }
    return () => document.body.classList.remove('cart-open')
  }, [isCartOpen])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCartOpen, closeCart])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/55 transition-opacity duration-200 z-[75]',
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeCart}
        aria-hidden={!isCartOpen}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 w-[min(480px,100vw)] h-screen transform transition-transform duration-300 ease-out z-[85] bg-white flex flex-col shadow-[-4px_0_24px_rgba(15,26,36,0.08)]',
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-hidden={!isCartOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-7 px-8 border-b border-hairline">
          <h2 className="font-serif text-2xl font-medium m-0 text-ink">
            Shopping Cart
          </h2>
          <button
            onClick={closeCart}
            className="w-10 h-10 flex items-center justify-center bg-transparent border border-hairline text-ink text-[28px] cursor-pointer transition-all hover:bg-platinum hover:border-ink"
            type="button"
            aria-label="Close cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-6 px-8">
          {isEmpty ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center h-full gap-6">
              <ShoppingCart className="w-16 h-16 text-platinum opacity-50" strokeWidth={1} />
              <p className="text-base text-ink-2 m-0">Your cart is empty</p>
              <Link
                href="/collections"
                onClick={closeCart}
                className="inline-flex items-center justify-center py-4 px-8 font-sans text-[0.95rem] tracking-[0.08em] bg-ink text-white border border-ink cursor-pointer transition-all hover:bg-ink-2"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            /* Cart Items */
            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-6 border-b border-hairline last:border-b-0 last:pb-0"
                >
                  {/* Image */}
                  <div className="w-[100px] h-[100px] flex-shrink-0 bg-platinum overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col gap-2">
                    <h3 className="text-base font-normal text-ink m-0 leading-snug">
                      {item.name}
                    </h3>
                    {item.variant && (
                      <p className="text-[0.85rem] text-ink-2 opacity-70 m-0">
                        {item.variant}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-auto">
                      {/* Quantity */}
                      <div className="flex items-center gap-3 border border-hairline py-1 px-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="w-6 h-6 flex items-center justify-center bg-transparent border-0 text-ink cursor-pointer text-base transition-colors hover:text-ink-2 disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="min-w-[20px] text-center text-[0.9rem] text-ink">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center bg-transparent border-0 text-ink cursor-pointer text-base transition-colors hover:text-ink-2"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-base font-normal text-ink">{formatTHB(item.price * item.quantity)}</span>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="bg-transparent border-0 text-ink-2 cursor-pointer text-[0.8rem] underline opacity-60 py-1 px-0 transition-opacity hover:opacity-100 self-start"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="border-t border-hairline py-6 px-8 bg-bg">
            {/* Summary */}
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between items-center text-[0.95rem] text-ink-2">
                <span>Subtotal</span>
                <span>{formatTHB(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-[0.95rem] text-ink-2">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatTHB(shipping)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-hairline text-[1.1rem] font-medium text-ink mt-2">
                <span>Total</span>
                <span>{formatTHB(total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="inline-flex items-center justify-center py-4 px-8 font-sans text-[0.95rem] tracking-[0.08em] bg-ink text-white border border-ink cursor-pointer transition-all hover:bg-ink-2 no-underline text-center"
              >
                Buy Now
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="inline-flex items-center justify-center py-4 px-8 font-sans text-[0.95rem] tracking-[0.08em] bg-transparent text-ink border border-ink cursor-pointer transition-all hover:bg-platinum text-center no-underline"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
