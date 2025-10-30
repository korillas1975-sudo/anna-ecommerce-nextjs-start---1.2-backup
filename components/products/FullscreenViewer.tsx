'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react'

export default function FullscreenViewer({
  images,
  startIndex = 0,
  onClose,
}: {
  images: string[]
  startIndex?: number
  onClose: () => void
}) {
  const [index, setIndex] = useState(startIndex)
  const [scale, setScale] = useState(1)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length])
  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, next, prev])

  return (
    <div className="fixed inset-0 z-[200] bg-black/95" role="dialog" aria-modal="true" aria-label="Product images fullscreen">
      <button
        onClick={onClose}
        aria-label="Close"
        className="fixed top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center z-[9999] pointer-events-auto"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div ref={containerRef} className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full h-full max-h-[90vh] max-w-7xl">
          <Image
            key={index}
            src={images[index]}
            alt={`View ${index + 1}`}
            fill
            className="object-contain select-none"
            sizes="100vw"
            style={{ transform: `scale(${scale})` }}
            draggable={false}
            onDoubleClick={() => setScale((s) => (s === 1 ? 1.8 : 1))}
          />
          {images.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">{index + 1} / {images.length}</div>
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button onClick={() => setScale((s) => Math.min(s + 0.2, 3))} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => setScale((s) => Math.max(s - 0.2, 1))} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
              <Minus className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="absolute inset-x-0 bottom-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
        </div>
      </div>
    </div>
  )
}
