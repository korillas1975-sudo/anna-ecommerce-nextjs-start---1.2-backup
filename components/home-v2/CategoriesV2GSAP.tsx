'use client'

import { useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

type CategoryItem = { id: number; name: string; slug: string; href?: string; image?: string }
interface Props { heading?: string; description?: string; items?: CategoryItem[] }

const DEFAULT_ITEMS: CategoryItem[] = [
  { id: 1, name: 'Necklaces', slug: 'necklaces' },
  { id: 2, name: 'Earrings', slug: 'earrings' },
  { id: 3, name: 'Bracelets', slug: 'bracelets' },
  { id: 4, name: 'Rings', slug: 'rings' },
  { id: 5, name: 'Sets', slug: 'sets' },
  { id: 6, name: 'Others', slug: 'others' },
]

export default function CategoriesV2GSAP({
  heading = 'Shop by Category',
  description = 'Explore curated categories designed to elevate your style.',
  items = DEFAULT_ITEMS,
}: Props) {
  const list = items.map((it) => ({
    ...it,
    href: it.href || `/products?category=${encodeURIComponent(it.slug)}`,
  }))

  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const stickyRef = useRef<HTMLDivElement | null>(null)
  const leftRef = useRef<HTMLDivElement | null>(null)
  const rightRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    // Check if user prefers reduced motion
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduceMotion.matches) return

    const wrapper = wrapperRef.current
    const sticky = stickyRef.current
    const right = rightRef.current
    const track = trackRef.current
    if (!wrapper || !sticky || !right || !track) return

    // Use GSAP matchMedia to ensure animation only runs on desktop
    const mm = gsap.matchMedia()

    // Only run on desktop (min-width: 1280px) - NOT on tablet or mobile
    mm.add('(min-width: 1280px)', () => {
      // Calculate horizontal scroll distance
      const getScrollAmount = () => {
        const trackWidth = track.scrollWidth
        const viewportWidth = window.innerWidth
        // Adjust to show last card fully at right edge + extra 6px
        const rightWidth = viewportWidth * 0.65 - 6
        // Cards slide until last card is at right edge of right column
        return -(trackWidth - rightWidth)
      }

      const scrollAmount = getScrollAmount()

      // Create the horizontal scroll animation
      const tween = gsap.to(track, {
        x: scrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          pin: true,
          scrub: 1,
          start: 'top 150', // Start before hitting header (150px from top)
          end: () => `+=${Math.abs(scrollAmount)}`, // No multiplier - last card visible then scroll continues
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Cleanup function for this media query
      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    })

    // Cleanup function for the entire effect
    return () => {
      mm.revert() // Remove all matchMedia animations
    }
  }, [])

  return (
    <section id="categories" className="relative w-full py-10 md:py-12 lg:py-14" style={{ scrollMarginTop: '88px' }}>
      <div ref={wrapperRef} className="w-full xl:mx-[2.5%] xl:w-[95%] xl:overflow-x-hidden px-4 xl:px-0">
        {/* Heading mobile + tablet */}
        <div className="mb-6 xl:hidden">
          <h2 className="font-serif text-[1.75rem] text-ink font-medium tracking-tight">{heading}</h2>
          <p className="mt-2 text-[0.95rem] text-ink/80 max-w-[62ch]">{description}</p>
        </div>

        {/* Sticky area on desktop ONLY (xl: 1280px+) */}
        <div ref={stickyRef} className="xl:sticky xl:grid xl:grid-cols-[30%_1fr] xl:items-center xl:gap-8 2xl:gap-10" style={{ top: 'var(--header-height)' }}>
          {/* Left column - desktop only */}
          <div ref={leftRef} className="relative z-10 hidden xl:flex xl:flex-col xl:justify-center">
            <div className="mb-8 2xl:mb-10">
              <h2 className="font-serif text-[2.25rem] 2xl:text-[2.5rem] text-ink font-medium tracking-tight">{heading}</h2>
              <p className="mt-2 text-[1rem] text-ink/80 max-w-[62ch]">{description}</p>
            </div>
          </div>

          {/* Right column */}
          <div ref={rightRef} className="relative xl:h-full xl:flex xl:items-center">
            {/* Mobile + Tablet: horizontal scroll */}
            <div className="block xl:hidden -mx-4 px-4 overflow-x-auto">
              <div className="flex gap-[5px]">
                {list.map((cat) => (
                  <div key={cat.id} className="shrink-0 w-[64vw] max-w-[360px] border border-[var(--hairline)] rounded-none overflow-hidden">
                    <Link href={cat.href!} aria-label={cat.name} className="group relative block aspect-[3/4]">
                      <CardVisual image={cat.image} />
                    </Link>
                    <div className="px-4 py-3">
                      <h3 className="font-serif text-[1.2rem] text-ink font-medium tracking-tight">{cat.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop ONLY: track with ScrollTrigger animation */}
            <div className="hidden xl:block w-full">
              <div ref={trackRef} className="relative z-20 flex gap-[5px] will-change-transform">
                {list.map((cat) => (
                  <div key={cat.id} className="shrink-0 w-[18rem] 2xl:w-[20rem] border border-[var(--hairline)] rounded-none overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-0.5">
                    <Link href={cat.href!} aria-label={cat.name} className="group relative block aspect-[3/4]">
                      <CardVisual image={cat.image} />
                    </Link>
                    <div className="px-4 py-3 2xl:py-4">
                      <h3 className="font-serif text-[1.35rem] 2xl:text-[1.4rem] text-ink font-medium tracking-tight">{cat.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CardVisual({ image }: { image?: string }) {
  return (
    <div className="relative w-full h-full">
      {image ? (
        <Image src={image} alt="" fill sizes="(max-width: 768px) 72vw, (max-width: 1200px) 33vw, 400px" className="object-cover" unoptimized />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#f4efe5] via-[#eceff5] to-white" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

      {/* View More Button - Hidden by default, shows on hover */}
      <div className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" style={{ bottom: '25px' }}>
        <span className="inline-block px-5 py-2 bg-[#0F1A24] border border-white text-white text-[0.8rem] uppercase tracking-[0.15em] font-normal whitespace-nowrap">
          View More
        </span>
      </div>
    </div>
  )
}
