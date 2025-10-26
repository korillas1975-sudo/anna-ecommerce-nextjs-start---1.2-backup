'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

const cards = [
  {
    title: 'Timeless Elegance',
    description:
      'Each piece in our curated collection tells a story of craftsmanship and refined beauty.',
    cardClass: 'from-white/5 via-white/15 to-white/5',
    textClass: 'text-ink/25',
    cardPosition: 'md:left-[4%] md:top-0',
    textPosition: 'md:left-[-6%] md:top-[12%]',
    textAlign: 'text-left',
    slug: 'necklaces',
    image:
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=1400&auto=format&fit=crop&q=85',
  },
  {
    title: 'Handcrafted Excellence',
    description:
      'Every piece is meticulously crafted by master artisans, blending tradition with innovation.',
    cardClass: 'from-black/20 via-black/35 to-black/15',
    textClass: 'text-white/25',
    cardPosition: 'md:right-[4%] md:top-[24%]',
    textPosition: 'md:right-[-6%] md:bottom-[18%]',
    textAlign: 'text-right',
    slug: 'rings',
    image:
      'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=1400&auto=format&fit=crop&q=85',
  },
]

export function FeaturedCollections() {
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const renderCard = (card: (typeof cards)[number]) => (
    <Link
      href={`/products?category=${encodeURIComponent(card.slug)}`}
      aria-label={`${card.title} collection`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
    >
      <div
        className="relative w-full aspect-[132/100] overflow-hidden rounded-[2px]"
        style={{
          backgroundImage: `url(${card.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${card.cardClass}`} />
      </div>
    </Link>
  )

  return (
    <section ref={ref} className="relative w-full py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="space-y-10 md:hidden">
          {cards.map((card) => (
            <div key={card.title} className="space-y-4">
              <h3 className="font-serif text-[2rem] font-medium text-ink">{card.title}</h3>
              {renderCard(card)}
              <p className="font-serif text-base text-ink/70">{card.description}</p>
            </div>
          ))}
        </div>

        <div
          className="relative hidden md:block md:min-h-[620px]"
          style={{
            '--card-w': '56%',
            '--overlap': '8%',
            '--left-top': '0%',
            '--right-top': '22%',
            '--gutter': 'min(6vw, 64px)',
          } as React.CSSProperties}
        >
          {cards.map((card, index) => {
            const isRight = index === 1
            const wrapperStyle = isRight
              ? {
                  left: 'calc(50% + var(--overlap))',
                  top: 'var(--right-top)',
                  width: 'var(--card-w)',
                }
              : {
                  left: 'calc(50% - var(--card-w) - var(--overlap))',
                  top: 'var(--left-top)',
                  width: 'var(--card-w)',
                }

            const textStyle = isRight
              ? {
                  left: 'min(calc(100% - var(--gutter)), calc(50% + var(--overlap)))',
                  transform: 'translateX(50%)',
                  top: '12%'
                }
              : {
                  left: 'max(var(--gutter), calc(50% - var(--overlap)))',
                  transform: 'translateX(-50%)',
                  top: '12%'
                }

            return (
              <div
                key={card.title}
                className={`absolute aspect-[132/100] ${isRight ? 'z-20' : 'z-10'}`}
                style={wrapperStyle as React.CSSProperties}
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{ duration: 0.85, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full h-full"
                >
                  {renderCard(card)}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.85, delay: 0.1 + index * 0.15 }}
                  className={`absolute max-w-[420px] pointer-events-none z-30 ${isRight ? 'text-right' : 'text-left'}`}
                  style={textStyle as React.CSSProperties}
                >
                  <h3 className={`font-serif text-[3.6rem] leading-[1.05] font-medium ${card.textClass}`}>
                    {card.title}
                  </h3>
                  <p className={`mt-6 font-serif text-lg leading-relaxed ${card.textClass}`}>
                    {card.description}
                  </p>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
