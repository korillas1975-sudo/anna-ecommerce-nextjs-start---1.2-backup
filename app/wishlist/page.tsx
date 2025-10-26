'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Trash2 } from 'lucide-react'
import { useWishlistStore } from '@/lib/stores/wishlist-store'

export default function WishlistPage() {
  const { items, removeItem, clear } = useWishlistStore()

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center max-w-md px-5">
          <Heart className="w-20 h-20 mx-auto mb-6 text-ink-2/20" strokeWidth={1} />
          <h1 className="font-serif text-[2rem] md:text-[2.5rem] font-medium text-ink mb-4">
            Your Wishlist is Empty
          </h1>
          <p className="text-ink-2/70 mb-8">Save your favorite items for later</p>
          <Link
            href="/products"
            className="inline-block bg-ink text-white py-3 px-8 uppercase tracking-wider text-sm hover:bg-ink-2 transition-colors"
          >
            Explore Products
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg">
      <div className="border-b border-hairline bg-white">
        <div className="max-w-[1700px] mx-auto px-5 md:px-10 py-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="font-serif text-[2rem] md:text-[3rem] font-medium text-ink">My Wishlist</h1>
            <p className="text-ink-2/70 mt-2">{items.length} item{items.length > 1 ? 's' : ''}</p>
          </div>
          <button
            type="button"
            onClick={clear}
            className="self-start lg:self-auto border border-hairline px-4 py-2 text-sm uppercase tracking-[0.08em] text-ink hover:border-ink transition-colors"
          >
            Clear Wishlist
          </button>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto px-5 md:px-10 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((item) => (
            <div key={item.id} className="border border-hairline bg-white">
              <Link href={`/products/${item.slug}`} className="block">
                <div className="relative aspect-[3/4] bg-platinum/20">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </Link>
              <div className="p-4 space-y-2">
                <Link href={`/products/${item.slug}`} className="font-serif text-[0.95rem] text-ink block leading-snug hover:text-champagne transition-colors">
                  {item.name}
                </Link>
                <p className="text-sm text-ink font-medium">?{item.price.toLocaleString()}</p>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="inline-flex items-center gap-2 text-sm text-ink-2/70 hover:text-ink transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
