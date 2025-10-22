'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

interface BrandStoryTeaserProps {
  heading?: string
  description?: string
}

export function BrandStoryTeaser({
  heading = 'The Art of Timeless Elegance',
  description = 'For over 20 years, Anna Paris has been crafting pearl jewelry that whispers sophistication. Each piece embodies our philosophy of Quiet Luxury—where understated beauty meets exceptional craftsmanship. We believe true elegance needs no announcement.',
}: BrandStoryTeaserProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section
      ref={ref}
      id="brand-story-teaser"
      aria-label="Brand story teaser"
      className="relative w-full min-h-[300px] flex items-center justify-center px-5 md:px-10 lg:px-20 bg-bg"
    >
      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-[720px] md:max-w-[900px] lg:max-w-[1100px] mx-auto text-center"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.8 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="font-sans uppercase tracking-[0.18em] text-[0.7rem] md:text-[0.75rem] text-ink/60 mb-3"
        >
          Maison Story
        </motion.p>
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-serif text-[1.75rem] md:text-[2.35rem] lg:text-[2.65rem] font-medium leading-snug text-ink mb-4 md:mb-5 -tracking-[0.01em]"
        >
          {heading}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="font-serif text-[0.95rem] md:text-[1.02rem] leading-[1.75] md:leading-[1.85] text-ink-2/85 max-w-[640px] md:max-w-[800px] lg:max-w-[950px] mx-auto font-normal"
        >
          {description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 md:mt-7"
        >
          <Link
            href="/about"
            aria-label="Discover our story"
            className="inline-flex items-center gap-2 px-5 py-3 text-[0.85rem] tracking-[0.08em] uppercase rounded-[2px] border border-hairline text-ink hover:bg-platinum/40 transition-colors duration-300 min-h-[44px]"
          >
            Discover our story <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
