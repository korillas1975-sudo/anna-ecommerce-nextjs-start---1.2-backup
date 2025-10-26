'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  category: {
    name: string
  }
}

export function NewArrivals() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?featured=true&limit=8')
        const data = await res.json()
        setProducts(data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <section ref={ref} className="relative w-full py-6 md:py-8 lg:py-10">
      <div className="w-full md:ml-[2.5%] md:w-[95%]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 md:mb-10 lg:mb-12 px-5 md:px-10"
        >
          <h2 className="font-serif text-[1.85rem] md:text-[2.35rem] lg:text-[2.65rem] font-medium leading-snug text-ink -tracking-[0.01em]">
            New Arrivals
          </h2>
          <p className="font-serif text-[0.95rem] md:text-[1.02rem] text-ink-2/70 mt-3 max-w-[50ch]">
            Discover our latest collection of handcrafted jewelry pieces
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20 px-5 md:px-10">
            <p className="text-ink-2/40">Loading new arrivals...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 px-5 md:px-10">
            {products.map((product, index) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] overflow-hidden mb-3 md:mb-4 bg-platinum/20">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-block bg-white px-3 py-1 text-[0.7rem] font-sans uppercase tracking-wider text-ink">
                        New
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif text-[0.95rem] md:text-[1.02rem] text-ink font-normal leading-snug group-hover:text-champagne transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="font-sans text-[0.85rem] md:text-[0.9rem] text-ink-2/70">
                      THB {product.price.toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
