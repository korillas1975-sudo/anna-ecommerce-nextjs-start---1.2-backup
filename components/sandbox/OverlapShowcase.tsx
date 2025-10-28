'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'

type Card = {
  title: string
  description: string
  image: string
  href?: string
  textClass?: string
}

const defaultCards: [Card, Card] = [
  {
    title: 'Timeless Elegance',
    description:
      'Each piece in our curated collection tells a story of craftsmanship and refined beauty.',
    image:
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=1400&auto=format&fit=crop&q=85',
    href: '/products?category=necklaces',
    textClass: 'text-ink/25',
  },
  {
    title: 'Handcrafted Excellence',
    description:
      'Every piece is meticulously crafted by master artisans, blending tradition with innovation.',
    image:
      'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=1400&auto=format&fit=crop&q=85',
    href: '/products?category=rings',
    textClass: 'text-white/25',
  },
]

export default function OverlapShowcase({ cards = defaultCards }: { cards?: [Card, Card] }) {
  const [front, setFront] = useState<'left' | 'right'>(() => 'right')
  return (
    <section className="relative w-full bg-bg py-8 md:py-10">
      <div className="relative max-w-[1400px] mx-auto px-5 md:px-10">
        {/* Mobile-first: stacked cards (no absolute positioning) */}
        <div className="grid gap-4 md:hidden">
          {cards.map((card, index) => (
            <div key={card.title} className="border border-[var(--hairline)] overflow-hidden">
              <Link
                href={card.href || '#'}
                aria-label={`${card.title} collection`}
                className="group block relative aspect-[3/4] w-full"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </Link>
              <div className="px-4 py-3">
                <h3 className="font-serif text-[1.5rem] text-ink font-medium leading-snug">
                  {card.title}
                </h3>
                <p className="mt-2 font-serif text-[0.95rem] text-ink/75 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: overlapped showcase (kept, but gated behind md) */}
        <div
          className="relative hidden md:block md:h-[700px]"
          style={{
            '--card-w': '584px',
            '--card-h': '383px',
            '--overlap': '40px',
            '--textL-top': '12%',
            '--textR-top': '16%',
            '--textR-shift': '50%',
            '--text-max': '420px',
            '--gutter': 'min(6vw, 64px)',
            '--hover-x': '16px',
          } as React.CSSProperties}
        >
          {cards.map((card, index) => {
            // Center the whole block vertically without changing relative offsets
            const SECTION_H = 700
            const CARD_H = 383
            const LEFT_TEXT_TOP_PCT = 0.12
            const leftTopPx = 0 // was 0%
          const rightTopPx = Math.round(0.22 * SECTION_H) // was 22% of section height
          const minTop = Math.min(leftTopPx, rightTopPx)
          const delta = Math.abs(rightTopPx - leftTopPx)
          const groupHeight = CARD_H + delta
          const baseTop = (SECTION_H - groupHeight) / 2 - minTop
          const finalLeftTop = baseTop + leftTopPx
          const finalRightTop = baseTop + rightTopPx
          const isRight = index === 1
          const isFront = (isRight && front === 'right') || (!isRight && front === 'left')
          const rightTextBottom = Math.round(CARD_H * LEFT_TEXT_TOP_PCT)

          const wrapperStyle = isRight
            ? {
                left: 'calc(50% - var(--overlap))', // right card starts slightly left of center for overlap
                top: `${finalRightTop}px`,
                width: 'var(--card-w)',
                height: 'var(--card-h)'
              }
            : {
                left: 'calc(50% - var(--card-w) + var(--overlap))', // left card intrudes into center
                top: `${finalLeftTop}px`,
                width: 'var(--card-w)',
                height: 'var(--card-h)'
              }

          const textStyle = isRight
            ? {
                right: 0,
                transform: 'translateX(50%)', // anchor at right edge, put 50% inside card
                bottom: `${rightTextBottom}px`,
                maxWidth: 'var(--text-max)',
              }
            : {
                left: 0,
                transform: 'translateX(-50%)', // anchor at left edge, put 50% inside card
                top: 'var(--textL-top)',
                maxWidth: 'var(--text-max)',
              }

            return (
              <div
                key={card.title}
                className="absolute"
                style={{ ...(wrapperStyle as React.CSSProperties), zIndex: isFront ? 30 : isRight ? 20 : 10 }}
                onMouseEnter={() => setFront(isRight ? 'right' : 'left')}
              >
                <motion.div
                  animate={isFront ? { x: isRight ? -10 : 10, scale: 1.02 } : { x: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  className="relative w-full h-full"
                >
                  <Link
                    href={card.href || '#'}
                    aria-label={`${card.title} collection`}
                    className="block relative w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
                  >
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 1280px) 80vw, 50vw"
                      className="object-cover"
                      priority={index === 0}
                    />
                  </Link>
                </motion.div>

                <div
                  className={`absolute pointer-events-none z-30 ${isRight ? 'text-right' : 'text-left'}`}
                  style={textStyle as React.CSSProperties}
                >
                  <h3 className="font-serif text-[3.6rem] leading-[1.05] font-medium text-[#0F1A24]">
                    {card.title}
                  </h3>
                  <p className="mt-6 font-serif text-lg leading-relaxed text-[#0F1A24]">
                    {card.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
