'use client'

import { useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import { useUIStore } from '@/lib/stores/ui-store'
import { cn } from '@/lib/utils/cn'

const popularSearches = [
  { href: '#', label: 'Diamond Rings' },
  { href: '#', label: 'Gold Necklaces' },
  { href: '#', label: 'Pearl Earrings' },
  { href: '#', label: 'Bracelets' },
]

export function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUIStore()
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus input when opened
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isSearchOpen])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen, closeSearch])

  // Prevent body scroll when open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.classList.add('search-open')
    } else {
      document.body.classList.remove('search-open')
    }
    return () => document.body.classList.remove('search-open')
  }, [isSearchOpen])

  return (
    <div
      className={cn(
        'fixed inset-0 bg-bg/[0.98] backdrop-blur-[10px] z-[90] transition-opacity duration-300',
        isSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}
      aria-hidden={!isSearchOpen}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSearch()
      }}
    >
      <div className="max-w-[800px] mx-auto px-5 pt-[120px] pb-[60px]">
        {/* Close Button */}
        <button
          onClick={closeSearch}
          className="absolute top-10 right-10 w-12 h-12 flex items-center justify-center bg-transparent border border-hairline text-ink text-[28px] cursor-pointer transition-all hover:bg-platinum hover:border-ink"
          aria-label="Close search"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Search Box */}
        <div className="flex items-center gap-4 py-5 px-6 border border-hairline bg-white transition-colors focus-within:border-ink">
          <Search className="w-5 h-5 text-ink" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search for jewelry..."
            className="flex-1 border-0 bg-transparent font-sans text-[1.1rem] text-ink outline-none placeholder:text-ink-2 placeholder:opacity-50"
            aria-label="Search"
          />
        </div>

        {/* Popular Searches */}
        <div className="mt-12">
          <p className="text-[0.75rem] tracking-[0.15em] text-ink-2 mb-4 uppercase">
            Popular Searches
          </p>
          <div className="flex flex-wrap gap-3">
            {popularSearches.map((search) => (
              <Link
                key={search.label}
                href={search.href}
                onClick={closeSearch}
                className="py-2.5 px-5 border border-hairline text-ink text-[0.9rem] transition-all hover:border-ink hover:bg-platinum"
              >
                {search.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
