'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

export function CraftsmanshipSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="relative w-full py-8 md:py-10 lg:py-12">
      <div className="w-full md:ml-[2.5%] md:w-[95%]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center px-5 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/3] lg:aspect-[3/2] overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&auto=format&fit=crop&q=85"
              alt="Artisan crafting jewelry"
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
              style={{ filter: 'contrast(1.05) brightness(0.98) saturate(0.95)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[560px] lg:max-w-none"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-sans uppercase tracking-[0.18em] text-[0.7rem] md:text-[0.75rem] text-champagne mb-3"
            >
              HANDCRAFTED EXCELLENCE
            </motion.p>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="font-serif text-[1.85rem] md:text-[2.35rem] lg:text-[2.65rem] font-medium leading-snug text-ink mb-4 md:mb-5 -tracking-[0.01em]"
            >
              Where Artistry Meets Precision
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="space-y-3 md:space-y-4"
            >
              <p className="font-serif text-[0.95rem] md:text-[1.02rem] leading-[1.75] md:leading-[1.85] text-ink-2/85 font-normal">
                Each piece tells a story of dedication, shaped by the skilled hands of our master artisans. From the first sketch to the final polish, every detail receives meticulous attention.
              </p>
              <p className="font-serif text-[0.95rem] md:text-[1.02rem] leading-[1.75] md:leading-[1.85] text-ink-2/85 font-normal">
                We honor time-tested techniques passed down through generations, combined with modern precision to create jewelry that transcends trends.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
