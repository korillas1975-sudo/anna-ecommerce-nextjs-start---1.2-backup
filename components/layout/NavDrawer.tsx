'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useUIStore } from '@/lib/stores/ui-store'
import { cn } from '@/lib/utils/cn'

const navLinks = [
  { href: '/#categories', label: 'Categories' },
  { href: '#', label: 'Best Sellers' },
  { href: '#', label: 'Collection' },
  { href: '#', label: 'Sets & Matching' },
  { type: 'separator' },
  { href: '#', label: 'Gallery / Lookbook' },
  { href: '#', label: 'Customize & Engraving' },
  { href: '#', label: 'Size Guide' },
  { href: '#', label: 'Contact' },
  { href: '#', label: 'About Anna Paris' },
  { href: '#', label: 'Stories' },
]

export function NavDrawer() {
  const { isNavOpen, closeNav } = useUIStore()

  // Handle body scroll lock
  useEffect(() => {
    if (isNavOpen) {
      document.body.classList.add('nav-open')
    } else {
      document.body.classList.remove('nav-open')
    }
    return () => document.body.classList.remove('nav-open')
  }, [isNavOpen])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isNavOpen) {
        closeNav()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isNavOpen, closeNav])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/55 transition-opacity duration-200 z-[70]',
          isNavOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeNav}
        aria-hidden={!isNavOpen}
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 w-[min(440px,92vw)] h-screen transform transition-transform duration-300 ease-out z-[80] bg-white/[0.14] border border-white/[0.36] backdrop-blur-[10px]',
          isNavOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-hidden={!isNavOpen}
      >
        <nav className="relative h-full px-5 pt-[calc(16px+env(safe-area-inset-top))] pb-[calc(20px+env(safe-area-inset-bottom))] flex flex-col">
          {/* Navigation Links */}
          <ul className="list-none m-0 p-0 flex flex-col gap-3.5 overflow-auto scrollbar-hide">
            {navLinks.map((link, index) => {
              if (link.type === 'separator') {
                return (
                  <li
                    key={`sep-${index}`}
                    className="h-px bg-white/[0.18] my-1.5"
                  />
                )
              }
              return (
                <li key={link.href ? link.href + index : `link-${index}`}>
                  <Link
                    href={link.href || '#'}
                    onClick={closeNav}
                    className="block py-2.5 px-0.5 text-white opacity-92 tracking-[0.04em] transition-all duration-200 ease-out hover:tracking-[0.06em] hover:opacity-100 focus-visible:tracking-[0.06em] focus-visible:opacity-100"
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Close Button */}
          <button
            onClick={closeNav}
            className="absolute top-[calc(12px+env(safe-area-inset-top))] right-3 border border-white/[0.36] bg-ink/[0.22] backdrop-blur-md text-white py-1.5 px-2.5 leading-none cursor-pointer transition-colors hover:bg-ink/[0.35]"
            type="button"
            aria-label="Close menu"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </nav>
      </aside>
    </>
  )
}
