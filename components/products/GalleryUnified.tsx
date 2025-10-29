"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"

type GalleryUnifiedProps = {
  images: string[]
  productName: string
  onOpenFullscreen?: (index: number) => void
  onSlideChange?: (index: number) => void
}

export default function GalleryUnified({ images, productName, onOpenFullscreen, onSlideChange }: GalleryUnifiedProps) {
  const baseImages = useMemo(() => (images && images.length > 0 ? images : ["/assets/img/logo-anna-paris.png"]), [images])
  const N = baseImages.length

  // sentinel clones for seamless infinite loop (only when N>1)
  const slides = useMemo(() => (N > 1 ? [baseImages[N - 1], ...baseImages, baseImages[0]] : baseImages), [baseImages, N])

  const viewportRef = useRef<HTMLDivElement | null>(null)
  const widthRef = useRef(0)
  const scrollTimer = useRef<number | null>(null)

  // visual index in the extended array; start at 1 (the first real slide)
  const [vIndex, setVIndex] = useState(N > 1 ? 1 : 0)

  const logicalIndex = N > 1 ? (vIndex - 1 + N) % N : 0

  // update consumer when logical index changes
  useEffect(() => {
    onSlideChange?.(logicalIndex)
  }, [logicalIndex, onSlideChange])

  // measure width and position to the correct slide
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const setWidthAndSnap = () => {
      widthRef.current = el.clientWidth
      // keep current logical slide centered visually
      const target = (N > 1 ? vIndex : 0) * widthRef.current
      el.scrollTo({ left: target, behavior: "auto" })
    }

    setWidthAndSnap()

    const ro = new ResizeObserver(() => setWidthAndSnap())
    ro.observe(el)
    return () => ro.disconnect()
  }, [N, vIndex])

  // handle scroll to compute visual index and wrap at edges (0 and N+1)
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const onScroll = () => {
      const w = widthRef.current || el.clientWidth || 1
      const idx = Math.round(el.scrollLeft / w)
      if (idx !== vIndex) setVIndex(idx)

      if (scrollTimer.current) window.clearTimeout(scrollTimer.current)
      scrollTimer.current = window.setTimeout(() => {
        if (N <= 1) return
        // wrap logic – jump without animation
        if (idx === 0) {
          el.style.scrollBehavior = "auto"
          el.scrollTo({ left: N * w })
          el.style.scrollBehavior = "smooth"
          setVIndex(N)
        } else if (idx === N + 1) {
          el.style.scrollBehavior = "auto"
          el.scrollTo({ left: 1 * w })
          el.style.scrollBehavior = "smooth"
          setVIndex(1)
        }
      }, 80)
    }

    el.addEventListener("scroll", onScroll, { passive: true } as AddEventListenerOptions)
    return () => el.removeEventListener("scroll", onScroll)
  }, [N, vIndex])

  // prefetch neighbors for smoothness (client-only)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const list = [
      baseImages[(logicalIndex + 1) % N],
      baseImages[(logicalIndex - 1 + N) % N],
    ].filter(Boolean) as string[]
    list.forEach((src) => {
      const im = new window.Image()
      im.src = src
    })
  }, [baseImages, logicalIndex, N])

  const go = (dir: -1 | 1) => {
    const el = viewportRef.current
    if (!el) return
    const w = widthRef.current || el.clientWidth || 1
    const next = vIndex + dir
    el.scrollTo({ left: next * w, behavior: "smooth" })
    setVIndex(next)
  }

  return (
    <div className="relative w-full">
      <div
        ref={viewportRef}
        className="relative w-full aspect-[4/5] overflow-hidden snap-x snap-mandatory flex scroll-smooth no-scrollbar"
        style={{ overflowX: "auto" }}
        aria-roledescription="carousel"
        aria-label={`${productName} images`}
      >
        {slides.map((src, i) => (
          <div key={`${src}-${i}`} className="relative w-full h-full flex-none snap-center bg-platinum/20">
            <Image
              src={src}
              alt={`${productName} - View ${((i - 1 + N) % N) + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover select-none"
              draggable={false}
              onClick={() => onOpenFullscreen?.(logicalIndex)}
            />
          </div>
        ))}
      </div>

      {N > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white/60 hover:bg-white/80 transition flex items-center justify-center"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 text-ink" />
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white/60 hover:bg-white/80 transition flex items-center justify-center"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 text-ink" />
          </button>
          <button
            onClick={() => onOpenFullscreen?.(logicalIndex)}
            className="hidden lg:flex absolute right-3 bottom-3 w-10 h-10 rounded-full bg-white/60 hover:bg-white/80 items-center justify-center"
            aria-label="Open fullscreen"
          >
            <Maximize2 className="w-5 h-5 text-ink" />
          </button>
        </>
      )}

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded-full bg-white/70 text-ink">
        {N > 1 ? logicalIndex + 1 : 1} / {N}
      </div>
    </div>
  )
}


