'use client'

import { type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/lib/stores/wishlist-store'
import { formatTHB } from '@/lib/utils/currency'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice: number | null
  images: string[]
  category?: { name: string }
  tags: string[]
}

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const { toggleItem, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)

  const hasDiscount = product.compareAtPrice !== null && product.compareAtPrice > product.price
  const discountPercent = hasDiscount && product.compareAtPrice !== null
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  const handleToggleWishlist = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    toggleItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0],
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group"
    >
      <Link
        href={`/products/${product.slug}`}
        className="block"
        onClick={() => {
          try {
            const ret = window.location.pathname + window.location.search
            sessionStorage.setItem('plp:return', ret)
            sessionStorage.setItem(`plp:scroll:${window.location.search}`, String(window.scrollY))
          } catch {}
        }}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-platinum/20 mb-3 md:mb-4">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.tags.includes('bestseller') && (
              <span className="inline-block bg-ink text-white px-2 py-1 text-[0.65rem] uppercase tracking-wider">
                Bestseller
              </span>
            )}
            {hasDiscount && (
              <span className="inline-block bg-champagne text-ink px-2 py-1 text-[0.65rem] uppercase tracking-wider">
                -{discountPercent}%
              </span>
            )}
          </div>

          <button
            type="button"
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={handleToggleWishlist}
          >
            <Heart
              className={`w-4 h-4 ${inWishlist ? 'text-champagne' : 'text-ink'}`}
              strokeWidth={inWishlist ? 2 : 1.5}
              fill={inWishlist ? 'currentColor' : 'none'}
            />
          </button>

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>
        <div className="space-y-1">
          {product.category?.name && (
            <p className="text-xs text-ink-2/50 uppercase tracking-wider">{product.category.name}</p>
          )}
          <h3 className="font-serif text-[0.95rem] md:text-[1rem] text-ink font-normal leading-snug group-hover:text-champagne transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <p className="font-sans text-[0.9rem] md:text-[0.95rem] text-ink font-medium">
              {formatTHB(product.price)}
            </p>
            {hasDiscount && (
              <p className="font-sans text-[0.8rem] text-ink-2/40 line-through">
                {formatTHB(product.compareAtPrice!)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
