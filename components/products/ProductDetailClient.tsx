'use client'


import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Truck, RefreshCw, Shield, X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Share2 } from 'lucide-react'
import { useCartStore } from '@/lib/stores/cart-store'
import { useWishlistStore } from '@/lib/stores/wishlist-store'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compareAtPrice: number | null
  images: string[]
  category: { name: string }
  stock: number
}

function ZoomableImage({ src, alt }: { src: string; alt: string }) {
  const [zoomActive, setZoomActive] = useState(false)
  const [origin, setOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 })

  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setOrigin({ x, y })
  }

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setZoomActive(true)}
      onMouseLeave={() => setZoomActive(false)}
      onMouseMove={onMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 600px"
        className="object-cover transition-transform duration-200 ease-out"
        style={{
          transform: zoomActive ? 'scale(1.75)' : 'scale(1)',
          transformOrigin: `${origin.x}% ${origin.y}%`,
        }}
        priority
      />
    </div>
  )
}

function VerticalThumbnails({
  images,
  productName,
  selectedIndex,
  onHover,
  onClick,
}: {
  images: string[]
  productName: string
  selectedIndex: number
  onHover: (i: number) => void
  onClick: (i: number) => void
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const scrollByAmount = 190

  const scrollUp = () => {
    if (ref.current) ref.current.scrollBy({ top: -scrollByAmount, behavior: 'smooth' })
  }
  const scrollDown = () => {
    if (ref.current) ref.current.scrollBy({ top: scrollByAmount, behavior: 'smooth' })
  }

  return (
    <div className="relative hidden lg:block">
      {/* Scroll buttons */}
      <button
        onClick={scrollUp}
        aria-label="Scroll thumbnails up"
        className="absolute -top-3 left-0 right-0 z-10 h-6 flex items-center justify-center text-ink/70 hover:text-ink"
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      <button
        onClick={scrollDown}
        aria-label="Scroll thumbnails down"
        className="absolute -bottom-3 left-0 right-0 z-10 h-6 flex items-center justify-center text-ink/70 hover:text-ink"
      >
        <ChevronDown className="w-4 h-4" />
      </button>

      <div ref={ref} className="w-[112px] h-[750px] overflow-y-auto pr-1 scroll-smooth">
        <div className="flex flex-col gap-2 h-full">
          {images.slice(0, 8).map((img, idx) => (
            <button
              key={idx}
              type="button"
              onMouseEnter={() => onHover(idx)}
              onClick={() => onClick(idx)}
              className={`relative w-full h-[calc((100%-24px)/4)] overflow-hidden transition-all flex-none ${
                selectedIndex === idx
                  ? 'ring-2 ring-ink'
                  : 'ring-1 ring-hairline/40 opacity-80 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${productName} - View ${idx + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [showAddedToCart, setShowAddedToCart] = useState(false)
  
  const { addItem } = useCartStore()
  const { toggleItem, isInWishlist } = useWishlistStore()

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  // Ensure we have multiple images to drive the gallery; if not, duplicate the primary as a lightweight demo fallback.
  const sourceImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['/assets/img/logo-anna-paris.png']
  const images = sourceImages.length >= 5
    ? sourceImages
    : Array.from({ length: Math.max(5, sourceImages.length) }, (_, i) => sourceImages[i % sourceImages.length])
  const primaryImage = images?.[selectedImage] ?? images?.[0] ?? '/assets/img/logo-anna-paris.png'
  const inWishlist = isInWishlist(product.id)

  // Build hi-res URL for providers that support query transforms (e.g., Unsplash)
  const getHiResUrl = (src: string) => {
    try {
      const u = new URL(src, typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
      if (u.hostname.includes('images.unsplash.com')) {
        u.searchParams.set('w', '3000')
        u.searchParams.set('q', '85')
        u.searchParams.set('auto', 'format')
        u.searchParams.set('fit', 'crop')
        return u.toString()
      }
      return src
    } catch {
      return src
    }
  }

  // Preload neighbor images for smoother UX
  useEffect(() => {
    if (!images?.length) return
    const next = images[(selectedImage + 1) % images.length]
    const prev = images[(selectedImage - 1 + images.length) % images.length]
    ;[next, prev].forEach((src) => {
      if (!src) return
      const imgEl = typeof window !== 'undefined' ? new window.Image() : null
      if (imgEl) imgEl.src = src
    })
  }, [selectedImage, images])

  const handleAddToCart = () => {
    if (product.stock === 0) return
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: primaryImage,
        slug: product.slug,
      },
      quantity
    )
    setShowAddedToCart(true)
    setTimeout(() => setShowAddedToCart(false), 2000)
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] opacity-[0.08] blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(244,239,229,0.4) 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-[54px] py-10 md:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20">

          {/* LEFT: Gallery */}
          <div className="lg:grid lg:grid-cols-[112px_minmax(0,600px)] lg:gap-4 lg:items-start">
            {/* Vertical Thumbnails (desktop) */}
            <VerticalThumbnails
              images={images}
              productName={product.name}
              selectedIndex={selectedImage}
              onHover={(i) => setSelectedImage(i)}
              onClick={(i) => openLightbox(i)}
            />

            {/* Main Image 4:5 */}
            <div
              onClick={() => openLightbox(selectedImage)}
              className="relative w-full mx-auto max-w-[600px] aspect-[4/5] overflow-hidden bg-platinum/10 cursor-pointer hover:opacity-95 transition-opacity"
            >
              {/* Desktop hover zoom */}
              <ZoomableImage src={primaryImage} alt={`${product.name} - Main`} />
              {hasDiscount && product.compareAtPrice && (
                <div className="absolute top-4 left-4 px-4 py-1.5 bg-ink text-white text-[0.7rem] font-medium uppercase tracking-wider">
                  Save {'\u0E3F'}{(product.compareAtPrice - product.price).toLocaleString()}
                </div>
              )}
            </div>

            {/* Horizontal Thumbnails (mobile/tablet) */}
            <div className="mt-3 flex gap-2.5 max-w-[600px] mx-auto lg:hidden overflow-x-auto">
              {images.slice(0, 8).map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseEnter={() => setSelectedImage(idx)}
                  onClick={() => openLightbox(idx)}
                  className={`relative w-20 flex-none aspect-[4/5] overflow-hidden transition-all ${
                    selectedImage === idx ? 'ring-2 ring-ink ring-offset-2' : 'ring-1 ring-hairline/40 opacity-80 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`${product.name} - View ${idx + 1}`} fill className="object-cover" sizes="100px" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 lg:pt-2">
            <div className="flex items-center justify-between">
              <p className="text-[0.7rem] uppercase tracking-[0.25em] text-ink-2/50 font-medium">
                {product.category.name}
              </p>
              <button className="p-2 rounded-full hover:bg-platinum/50 transition-colors">
                <Share2 className="w-4 h-4 text-ink-2/60" />
              </button>
            </div>

            <h1 className="font-serif text-[1.85rem] md:text-[2.25rem] lg:text-[2.75rem] font-medium text-ink leading-[1.1] -tracking-[0.015em]">
              {product.name}
            </h1>

            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-champagne fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm text-ink-2/60">4.7</span>
            </div>

                        <div className="flex items-baseline gap-3 pt-2">
              <p className="font-sans text-[1.65rem] md:text-[1.85rem] text-ink font-semibold">{'\u0E3F'}{product.price.toLocaleString()}</p>
              {hasDiscount && product.compareAtPrice && (
                <p className="font-sans text-[1rem] text-ink-2/35 line-through">{'\u0E3F'}{product.compareAtPrice.toLocaleString()}</p>
              )}
            </div>

            <p className="font-sans text-[0.9rem] leading-[1.7] text-ink-2/75 max-w-[50ch] pt-1">
              {product.description}
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-ink">Quantity</span>
                <div className="flex items-center border border-hairline">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-platinum/50">-</button>
                  <span className="w-12 h-10 flex items-center justify-center border-x border-hairline text-sm font-medium">
                    {quantity}
                  </span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-platinum/50">+</button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 h-12 px-8 text-[0.8rem] uppercase tracking-[0.15em] font-medium transition-all ${
                    product.stock > 0 ? 'bg-ink text-white hover:bg-ink-2' : 'bg-platinum/50 text-ink-2/40 cursor-not-allowed'
                  }`}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>

                <button
                  onClick={() => toggleItem({
                    id: product.id, name: product.name, slug: product.slug, price: product.price, image: primaryImage
                  })}
                  className={`w-12 h-12 flex items-center justify-center border transition-all ${
                    inWishlist ? 'bg-champagne border-champagne' : 'bg-white border-hairline hover:border-ink'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-ink text-ink' : 'text-ink-2/60'}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-3 pt-5 border-t border-hairline/60">
              {[
                { icon: Truck, text: 'Free Shipping' },
                { icon: RefreshCw, text: '30-Day Returns' },
                { icon: Shield, text: 'Authentic' },
                { icon: Shield, text: 'Secure Payment' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 text-ink-2/35" strokeWidth={1.5} />
                  <span className="text-xs text-ink-2/65">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-[100] bg-black/95" onClick={() => setIsLightboxOpen(false)}>
            <button onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10" onClick={(e) => e.stopPropagation()}>
              <div className="w-full max-w-6xl h-full max-h-[90vh] grid md:grid-cols-[1fr_180px] gap-6">
                
                <div className="relative flex items-center justify-center">
                  <div className="relative w-full h-[80vh]">
                    <Image src={getHiResUrl(images[lightboxIndex])} alt={`${product.name} - Lightbox ${lightboxIndex + 1}`} fill className="object-contain" sizes="90vw" priority />
                  </div>

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                      >
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                      >
                        <ChevronRight className="w-6 h-6 text-white" />
                      </button>
                    </>
                  )}
                </div>

                <div className="hidden md:flex flex-col gap-3 overflow-y-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                      className={`relative aspect-square overflow-hidden transition-all ${
                        lightboxIndex === idx ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : 'opacity-50 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt={`${product.name} - View ${idx + 1}`} fill className="object-cover" sizes="180px" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white text-sm">
              {lightboxIndex + 1} / {images.length}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {showAddedToCart && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-ink text-white px-8 py-3.5 rounded-full shadow-2xl flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium text-sm">Added to cart</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}




