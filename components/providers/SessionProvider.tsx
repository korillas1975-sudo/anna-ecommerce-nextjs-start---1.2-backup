'use client'

import { SessionProvider as NextAuthProvider, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useWishlistStore } from '@/lib/stores/wishlist-store'

function WishlistSync() {
  const { status } = useSession()
  const sync = useWishlistStore((s) => s.syncWithServer)
  useEffect(() => {
    if (status === 'authenticated') {
      sync().catch(() => {})
    }
  }, [status, sync])
  return null
}

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthProvider>
      {children}
      <WishlistSync />
    </NextAuthProvider>
  )
}

