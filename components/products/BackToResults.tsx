'use client'

import { useRouter } from 'next/navigation'

export default function BackToResults({ fallbackCategory }: { fallbackCategory?: string }) {
  const router = useRouter()

  const handleBack = () => {
    try {
      // If we have history, try going back first
      if (window.history.length > 1) {
        router.back()
        return
      }
    } catch {}

    // Fallback: use stored PLP URL or category, else /products
    try {
      const stored = sessionStorage.getItem('plp:return')
      if (stored) {
        router.push(stored)
        return
      }
    } catch {}

    if (fallbackCategory) router.push(`/products?category=${fallbackCategory}`)
    else router.push('/products')
  }

  return (
    <button
      onClick={handleBack}
      aria-label="Back"
      className="lg:hidden fixed left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/80 shadow flex items-center justify-center"
    >
      <span className="inline-block w-2.5 h-2.5 border-l-2 border-b-2 border-ink rotate-45" />
    </button>
  )
}
