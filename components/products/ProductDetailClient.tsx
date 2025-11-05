'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Truck, RefreshCw, Shield, Share2 } from 'lucide-react'
import GalleryUnified from './GalleryUnified'
import FullscreenViewer from './FullscreenViewer'
import { useCartStore } from '@/lib/stores/cart-store'
import { formatTHB } from '@/lib/utils/currency'
import { useWishlistStore } from '@/lib/stores/wishlist-store'
import { useUIStore } from '@/lib/stores/ui-store'

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
  details?: unknown
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fullscreenIndex, setFullscreenIndex] = useState(0)
  const [showAddedToCart, setShowAddedToCart] = useState(false)
  const [showStickyCta, setShowStickyCta] = useState(false)
  const ctaMainRef = useRef<HTMLDivElement | null>(null)

  const { addItem } = useCartStore()
  const { toggleItem, isInWishlist } = useWishlistStore()
  const { openCart } = useUIStore()

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const sourceImages = Array.isArray(product.images) && product.images.length > 0 ? product.images : ['/assets/img/logo-anna-paris.png']
  const images = sourceImages
  const primaryImage = images[currentIndex] ?? images[0]
  const inWishlist = isInWishlist(product.id)
  const percentOff = hasDiscount ? Math.round(((product.compareAtPrice as number - product.price) / (product.compareAtPrice as number)) * 100) : 0
  const FREE_SHIPPING_THRESHOLD = 3000

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

  useEffect(() => {
    const next = images[(currentIndex + 1) % images.length]
    const prev = images[(currentIndex - 1 + images.length) % images.length]
    for (const src of [next, prev]) {
      if (!src) continue
      const img = typeof window !== 'undefined' ? new window.Image() : null
      if (img) img.src = src
    }
  }, [currentIndex, images])

  useEffect(() => {
    const el = ctaMainRef.current
    if (!el) return
    const observer = new IntersectionObserver((entries) => {
      setShowStickyCta(!entries[0].isIntersecting)
    }, { threshold: 0.4 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

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
    openCart()
  }

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index)
    setIsFullscreen(true)
  }

  const closeFullscreen = () => setIsFullscreen(false)

  // Reviews (read-only preview)
  const [reviews, setReviews] = useState<{ id: string; authorName: string; rating: number; title?: string | null; body: string; verifiedPurchase: boolean; createdAt: string }[]>([])
  const [reviewSummary, setReviewSummary] = useState<{ ratingAvg: number; ratingCount: number }>({ ratingAvg: 0, ratingCount: 0 })
  useEffect(() => {
    let ignore = false
    async function loadReviews() {
      try {
        const res = await fetch(
          `/api/reviews?product=${encodeURIComponent(product.slug)}&page=1&pageSize=3`,
          { cache: 'no-store' satisfies RequestCache }
        )
        if (!res.ok) return
        const data = await res.json()
        if (ignore) return
        setReviews(data.items || [])
        setReviewSummary({ ratingAvg: data.ratingAvg || 0, ratingCount: data.ratingCount || 0 })
      } catch {}
    }
    loadReviews()
    return () => { ignore = true }
  }, [product.slug])

  return (
    <>
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[800px] h-[800px] opacity-[0.08] blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(244,239,229,0.4) 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-[54px] py-10 md:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20">
          <div>
            <GalleryUnified
              images={images}
              productName={product.name}
              onOpenFullscreen={openFullscreen}
              onSlideChange={setCurrentIndex}
            />
          </div>

          <div className="space-y-6 lg:pt-2">
            {percentOff > 0 && (
              <span className="inline-block text-xs px-2 py-1 bg-champagne/20 text-ink rounded-sm tracking-wider uppercase">Save {percentOff}%</span>
            )}
            <div className="flex items-center justify-between">
              <p className="text-[0.7rem] uppercase tracking-[0.25em] text-ink-2/50 font-medium">
                {product.category.name}
              </p>
              <button className="p-2 rounded-full hover:bg-platinum/50 transition-colors">
                <Share2 className="w-4 h-4 text-ink-2/60" />
              </button>
            </div>

            {product.stock > 0 && product.stock < 5 && (
              <div className="text-sm text-red-600">เหลือเพียง {product.stock} ชิ้น</div>
            )}

            {/* Value bullets (แก้ข้อความได้ภายหลัง) */}
            <ul className="space-y-2 text-ink-2/80 text-sm">
              <li>• คัดสรรวัสดุคุณภาพ งานประกอบประณีต</li>
              <li>• รับประกันสินค้า 1 ปี และบริการดูแลพื้นฐาน</li>
              <li>• ชำระเงินปลอดภัยผ่าน Stripe / บัตรเครดิต</li>
            </ul>

            <h1 className="font-serif text-[1.85rem] md:text-[2.25rem] lg:text-[2.75rem] font-medium text-ink leading-[1.1] -tracking-[0.015em]">
              {product.name}
            </h1>

            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-champagne fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-ink-2/60">4.7</span>
            </div>

            <div className="flex items-baseline gap-3 pt-2">
              <p className="font-sans text-[1.65rem] md:text-[1.85rem] text-ink font-semibold">
                {formatTHB(product.price)}
              </p>
              {hasDiscount && product.compareAtPrice && (
                <p className="font-sans text-[1rem] text-ink-2/35 line-through">
                  {formatTHB(product.compareAtPrice!)}
                </p>
              )}
            </div>

            <p className="font-sans text-[0.9rem] leading-[1.7] text-ink-2/75 max-w-[50ch] pt-1">
              {product.description}
            </p>

            <div className="lg:hidden divide-y divide-hairline/70 border-t border-b border-hairline/70 mt-3">
              <details>
                <summary className="flex items-center justify-between py-3 cursor-pointer text-ink">
                  <span className="font-medium">Details</span>
                  <span className="text-ink-2/60">+</span>
                </summary>
                <div className="pb-3 text-[0.95rem] text-ink-2/80">
                  {product.details ? JSON.stringify(product.details) : 'Premium materials. See full specs on desktop.'}
                </div>
              </details>
              <details>
                <summary className="flex items-center justify-between py-3 cursor-pointer text-ink">
                  <span className="font-medium">Care</span>
                  <span className="text-ink-2/60">+</span>
                </summary>
                <div className="pb-3 text-[0.95rem] text-ink-2/80">Avoid chemicals and store separately in a soft pouch.</div>
              </details>
              <details>
                <summary className="flex items-center justify-between py-3 cursor-pointer text-ink">
                  <span className="font-medium">Shipping & Returns</span>
                  <span className="text-ink-2/60">+</span>
                </summary>
                <div className="pb-3 text-[0.95rem] text-ink-2/80">Free shipping · 30-day returns · Secure payments.</div>
              </details>
            </div>

            <div className="space-y-4 pt-4" ref={ctaMainRef}>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-ink">Quantity</span>
                <div className="flex items-center border border-hairline">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-platinum/50"
                  >
                    -
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center border-x border-hairline text-sm font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-platinum/50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_48px] gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`h-12 w-full px-8 text-[0.8rem] uppercase tracking-[0.15em] font-medium transition-all ${
                    product.stock > 0 ? 'bg-ink text-white hover:bg-ink-2' : 'bg-platinum/50 text-ink-2/40 cursor-not-allowed'
                  }`}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>

                <button
                  onClick={() =>
                    toggleItem({
                      id: product.id,
                      name: product.name,
                      slug: product.slug,
                      price: product.price,
                      image: primaryImage,
                    })
                  }
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
            {/* Free shipping note */}
            <div className="text-sm text-ink-2/70">สั่งซื้อเกิน {formatTHB(FREE_SHIPPING_THRESHOLD)} ส่งฟรีทั่วประเทศ</div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs text-ink-2/70 pt-2">
              <div className="border border-hairline p-3">
                <Shield className="w-4 h-4 mx-auto mb-2" /> ชำระเงินปลอดภัย
              </div>
              <div className="border border-hairline p-3">
                <Truck className="w-4 h-4 mx-auto mb-2" /> จัดส่งรวดเร็ว
              </div>
              <div className="border border-hairline p-3">
                <RefreshCw className="w-4 h-4 mx-auto mb-2" /> เปลี่ยนคืนง่าย
              </div>
            </div>

            {/* FAQ สั้น */}
            <div className="pt-4">
              <h3 className="text-sm font-medium text-ink mb-2">คำถามที่พบบ่อย</h3>
              <details className="mb-2 border border-hairline p-3 text-sm text-ink-2/80">
                <summary className="cursor-pointer text-ink">มีการรับประกันอย่างไร?</summary>
                สินค้ารับประกัน 1 ปี ความเสียหายจากการผลิต บริการทำความสะอาดพื้นฐานฟรี
              </details>
              <details className="mb-2 border border-hairline p-3 text-sm text-ink-2/80">
                <summary className="cursor-pointer text-ink">ใช้เวลาจัดส่งกี่วัน?</summary>
                กรุงเทพฯ 1-2 วันทำการ ต่างจังหวัด 2-4 วันทำการ
              </details>
              <details className="border border-hairline p-3 text-sm text-ink-2/80">
                <summary className="cursor-pointer text-ink">คืนสินค้าได้หรือไม่?</summary>
                เปลี่ยนหรือคืนสินค้าได้ภายใน 7 วัน (เงื่อนไขเป็นไปตามที่ร้านกำหนด)
              </details>
            </div>

            {/* Reviews (read-only) */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-ink">รีวิวจากลูกค้า</h3>
                {reviewSummary.ratingCount > 0 && (
                  <div className="text-xs text-ink-2/70">⭐ {reviewSummary.ratingAvg.toFixed(1)} / 5 จาก {reviewSummary.ratingCount} รีวิว</div>
                )}
              </div>
              {reviews.length === 0 ? (
                <div className="text-sm text-ink-2/70">ยังไม่มีรีวิว — เป็นคนแรกที่รีวิว</div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((r) => (
                    <div key={r.id} className="border border-hairline p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-ink">{r.authorName}</div>
                        <div className="text-xs text-ink-2/70">{new Date(r.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-xs text-champagne mb-1">{'⭐'.repeat(r.rating)}</div>
                      {r.title && <div className="text-sm text-ink mb-1">{r.title}</div>}
                      <div className="text-sm text-ink-2/80">{r.body}</div>
                      {r.verifiedPurchase && <div className="mt-2 text-[11px] text-ink-2/60">ยืนยันการสั่งซื้อ</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isFullscreen && (
        <FullscreenViewer
          images={images.map(getHiResUrl)}
          startIndex={fullscreenIndex}
          onClose={closeFullscreen}
        />
      )}

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

      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-hairline ${showStickyCta && !isFullscreen ? '' : 'hidden'}`}>
        <div className="max-w-[1700px] mx-auto px-5 py-3 flex items-center gap-3">
          <div className="text-ink font-semibold">{formatTHB(product.price)}</div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex-1 h-11 px-5 text-[0.8rem] uppercase tracking-[0.12em] font-medium rounded-full transition-colors ${
              product.stock > 0 ? 'bg-ink text-white' : 'bg-platinum/70 text-ink-2/40 cursor-not-allowed'
            }`}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
          <button
            onClick={() =>
              toggleItem({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: primaryImage,
              })
            }
            className={`w-11 h-11 flex items-center justify-center rounded-full border ${
              inWishlist ? 'bg-champagne border-champagne' : 'bg-white border-hairline'
            }`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-ink text-ink' : 'text-ink-2/70'}`} />
          </button>
        </div>
        <div style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
      </div>
    </>
  )
}



