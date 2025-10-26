'use client'

import { Search, User, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/stores/cart-store'
import { useWishlistStore } from '@/lib/stores/wishlist-store'
import { useUIStore } from '@/lib/stores/ui-store'

export function Header() {
  const { items } = useCartStore()
  const wishlistCount = useWishlistStore((state) => state.items.length)
  const { openNav, openSearch, openCart } = useUIStore()

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      {/* VIP Announcement Bar - Hidden on mobile */}
      <Link
        href="/vip"
        className="hidden md:flex items-center justify-center min-h-[var(--announce-h)] px-3 text-center text-[0.67rem] tracking-[0.20em] text-ink-2 bg-transparent border-b border-hairline hover:bg-platinum transition-colors"
      >
        OFFER FOR VIP MEMBERSHIP
      </Link>

      {/* Header */}
      <header className="fixed md:sticky top-0 left-0 right-0 z-[60] bg-transparent md:bg-white/85 md:backdrop-blur-md md:border-b md:border-hairline pointer-events-none md:pointer-events-auto">
        <div className="max-w-[1700px] mx-auto px-5 md:px-10 lg:px-[54px]">
          <div className="flex items-center justify-between md:justify-start h-auto md:h-[var(--header-height)] py-5 md:py-0 relative">
            {/* Menu Toggle */}
            <button
              onClick={openNav}
              className="flex items-center gap-3.5 bg-white/25 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border border-white/30 md:border-0 text-white md:text-ink py-3 px-4 md:p-0 rounded-lg md:rounded-none pointer-events-auto z-[2] transition-colors"
              aria-label="Open menu"
              aria-expanded="false"
            >
              <span className="relative block w-6 h-0.5 bg-current rounded-sm before:content-[''] before:absolute before:left-0 before:-top-1.5 before:w-6 before:h-0.5 before:bg-current before:rounded-sm after:content-[''] after:absolute after:left-0 after:top-1.5 after:w-6 after:h-0.5 after:bg-current after:rounded-sm" />
              <span className="font-serif font-medium tracking-[0.12em] text-[0.85rem]">
                MENU
              </span>
            </button>

            {/* Logo - Hidden on mobile, shown on tablet+ */}
            <Link
              href="/"
              className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Image
                src="/assets/img/logo-anna-paris.png"
                alt="ANNA PARIS"
                width={137}
                height={44}
                style={{ width: '137px', height: 'auto' }}
                priority
              />
            </Link>

            {/* Header Actions - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-5 ml-auto">
              {/* Search */}
              <button
                onClick={openSearch}
                className="relative inline-flex items-center justify-center w-10 h-10 bg-transparent border-0 text-ink cursor-pointer transition-colors hover:text-ink-2"
                aria-label="Search"
              >
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>

              {/* Account */}
              <Link
                href="/account"
                className="relative inline-flex items-center justify-center w-10 h-10 bg-transparent border-0 text-ink cursor-pointer transition-colors hover:text-ink-2"
                aria-label="Account"
              >
                <User className="w-5 h-5" strokeWidth={1.5} />
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative inline-flex items-center justify-center w-10 h-10 bg-transparent border-0 text-ink cursor-pointer transition-colors hover:text-ink-2"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-ink text-white text-[0.65rem] font-normal rounded-full px-1.5 pointer-events-none">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative inline-flex items-center justify-center w-10 h-10 bg-transparent border-0 text-ink cursor-pointer transition-colors hover:text-ink-2"
                aria-label="Shopping Cart"
              >
                {/* Luxury Shopping Bag Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-ink text-white text-[0.65rem] font-normal rounded-full px-1.5 pointer-events-none">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
