'use client'

import { useEffect, useState, useRef } from 'react'
import { Search } from 'lucide-react'
import Image from 'next/image'
import { useUIStore } from '@/lib/stores/ui-store'
import { motion, useScroll, useTransform } from 'framer-motion'

interface HeroSectionProps {
  tagline?: string
  headline?: string
  videoUrl?: string
}

export function HeroSection({
  tagline = 'ANNA PARIS EXPERIENCE',
  headline = 'Express your unique self<br>through the jewelry you choose',
  videoUrl = '/assets/videos/hero-jewelry.mp4',
}: HeroSectionProps) {
  const { openSearch } = useUIStore()
  const [isMounted, setIsMounted] = useState(false)
  const containerRef = useRef<HTMLElement>(null)

  const { scrollY } = useScroll()

  // Parallax transforms
  const videoY = useTransform(scrollY, [0, 1000], [0, 500])
  const contentY = useTransform(scrollY, [0, 1000], [0, 200])
  const contentOpacity = useTransform(scrollY, [0, 600], [1, 0])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen md:h-[120vh] flex items-center justify-center overflow-hidden bg-bg"
    >
      {/* Video Background */}
      <div className="absolute inset-0 md:left-[2.5%] md:w-[95%] overflow-hidden">
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-black/45 md:from-black/15 md:to-black/35 pointer-events-none z-[1]" />

        {/* Video with Parallax */}
        {isMounted ? (
          <motion.div
            style={{ y: videoY }}
            className="absolute inset-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:min-h-full md:min-w-full md:w-auto md:h-auto w-full h-full"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-95 md:opacity-88"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        ) : (
          <div className="absolute inset-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:min-h-full md:min-w-full md:w-auto md:h-auto w-full h-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-95 md:opacity-88"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          </div>
        )}
      </div>

      {/* Hero Content with Parallax */}
      {isMounted ? (
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 text-center px-5 max-w-[1600px] w-full mx-auto flex flex-col items-center gap-4 md:gap-0 translate-y-20 md:translate-y-0"
        >
          {/* Mobile Logo */}
          <div className="block md:hidden w-[340px] h-auto mb-2">
            <Image
              src="/assets/img/logo-anna-paris.png"
              alt="ANNA PARIS"
              width={340}
              height={100}
              className="w-full h-auto brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
              priority
            />
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-[0.78rem] md:text-base lg:text-[1.2rem] tracking-[0.32em] md:tracking-[0.40em] lg:tracking-[0.45em] text-white/95 m-0 font-thin uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] md:mb-7 lg:mb-8"
          >
            {tagline}
          </motion.p>

          {/* Headline - Hidden on mobile */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="hidden md:block font-serif text-[clamp(2.5rem,5vw,4.5rem)] lg:text-[clamp(2.8rem,5vw,5.5rem)] font-medium leading-tight text-white m-0 -tracking-[0.01em] max-w-full text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)] [word-spacing:0.1em]"
            dangerouslySetInnerHTML={{ __html: headline }}
          />
        </motion.div>
      ) : (
        <div className="relative z-10 text-center px-5 max-w-[1600px] w-full mx-auto flex flex-col items-center gap-4 md:gap-0 translate-y-20 md:translate-y-0">
          <div className="block md:hidden w-[340px] h-auto mb-2">
            <Image
              src="/assets/img/logo-anna-paris.png"
              alt="ANNA PARIS"
              width={340}
              height={100}
              className="w-full h-auto brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
              priority
            />
          </div>
          <p className="text-[0.78rem] md:text-base lg:text-[1.2rem] tracking-[0.32em] md:tracking-[0.40em] lg:tracking-[0.45em] text-white/95 m-0 font-thin uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] md:mb-7 lg:mb-8">
            {tagline}
          </p>
          <h1
            className="hidden md:block font-serif text-[clamp(2.5rem,5vw,4.5rem)] lg:text-[clamp(2.8rem,5vw,5.5rem)] font-medium leading-tight text-white m-0 -tracking-[0.01em] max-w-full text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)] [word-spacing:0.1em]"
            dangerouslySetInnerHTML={{ __html: headline }}
          />
        </div>
      )}

      {/* Mobile Search Bar */}
      <div className="block md:hidden absolute bottom-[60px] left-0 right-0 px-7 z-[15]">
        <button
          onClick={openSearch}
          className="flex items-center gap-2.5 w-full max-w-[480px] mx-auto py-2.5 px-4 bg-white/96 backdrop-blur-[20px] border border-white/60 rounded-full shadow-[0_6px_24px_rgba(0,0,0,0.18)] transition-all hover:bg-white hover:border-ink hover:shadow-[0_8px_32px_rgba(0,0,0,0.22)] hover:-translate-y-0.5"
        >
          <Search className="w-[18px] h-[18px] text-ink-2 opacity-60 flex-shrink-0" strokeWidth={2} />
          <span className="flex-1 text-left font-sans text-[0.88rem] text-ink-2 opacity-60">
            Search for jewelry...
          </span>
        </button>
      </div>
    </section>
  )
}
