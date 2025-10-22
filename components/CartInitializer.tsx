'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/lib/stores/cart-store'

export function CartInitializer() {
  const initCart = useCartStore((state) => state.initCart)

  useEffect(() => {
    initCart()
  }, [initCart])

  return null
}
