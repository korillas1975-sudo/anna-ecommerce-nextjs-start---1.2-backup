'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, User, LogOut } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useUIStore } from '@/lib/stores/ui-store'
import { cn } from '@/lib/utils/cn'

const navLinks = [
  { href: '/products', label: 'All Products' },
  { href: '/#categories', label: 'Categories' },
  { href: '#', label: 'Best Sellers' },
  { href: '#', label: 'Collection' },
  { type: 'separator' },
  { href: '#', label: 'Gallery / Lookbook' },
  { href: '#', label: 'Size Guide' },
  { href: '/contact', label: 'Contact' },
  { href: '/about', label: 'About Anna Paris' },
]

export function NavDrawer() {
  const { data: session } = useSession()
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

  const handleLogout = async () => {
    closeNav()
    await signOut({ callbackUrl: '/' })
  }

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
          {/* Account Section */}
          {session?.user ? (
            <div className="mb-6 pb-6 border-b border-white/[0.18]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">
                    {(session.user as { name?: string }).name || 'Customer'}
                  </p>
                  <p className="text-white/60 text-xs">
                    {(session.user as { email?: string }).email}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/account"
                  onClick={closeNav}
                  className="flex-1 text-center py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
                >
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-red-500/20 hover:bg-red-500/30 text-white text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 pb-6 border-b border-white/[0.18]">
              <div className="flex gap-2">
                <Link
                  href="/auth/login"
                  onClick={closeNav}
                  className="flex-1 text-center py-3 px-4 bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  onClick={closeNav}
                  className="flex-1 text-center py-3 px-4 bg-white hover:bg-white/90 text-ink text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          )}

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
                    className="block w-full text-left bg-transparent border-0 text-[1.05rem] tracking-[0.025em] text-white hover:text-white/70 transition-colors py-1.5"
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
            className="mt-auto flex items-center justify-center gap-2.5 w-full min-h-[52px] bg-white/[0.11] border border-white/[0.28] text-white hover:bg-white/[0.18] transition-colors"
            aria-label="Close menu"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm tracking-[0.12em] font-medium">CLOSE</span>
          </button>
        </nav>
      </aside>
    </>
  )
}
