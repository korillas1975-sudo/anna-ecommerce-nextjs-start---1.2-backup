import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/lib/types'

interface CartState {
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (id: string | number) => void
  updateQuantity: (id: string | number, change: number) => void
  clearCart: () => void
  calculateTotals: () => void
  initCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      shipping: 0,
      total: 0,

  addItem: (product, quantity = 1) => {
    const { items } = get()
    const existingItem = items.find((i) => i.id === product.id)

    if (existingItem) {
      set({
        items: items.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        ),
      })
    } else {
      set({ items: [...items, { ...product, quantity }] })
    }
    get().calculateTotals()
  },

  removeItem: (id) => {
    set({ items: get().items.filter((i) => i.id !== id) })
    get().calculateTotals()
  },

  updateQuantity: (id, change) => {
    const { items } = get()
    const item = items.find((i) => i.id === id)
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change)
      set({
        items: items.map((i) =>
          i.id === id ? { ...i, quantity: newQuantity } : i
        ),
      })
      get().calculateTotals()
    }
  },

  clearCart: () => {
    set({ items: [], subtotal: 0, shipping: 0, total: 0 })
  },

  calculateTotals: () => {
    const { items } = get()
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal >= 3000 ? 0 : 50
    const total = subtotal + shipping

    set({ subtotal, shipping, total })
  },

  initCart: () => {
    const { items } = get()
    if (items.length === 0) {
      set({ subtotal: 0, shipping: 0, total: 0 })
      return
    }
    get().calculateTotals()
  },
    }),
    {
      name: 'cart-storage',
      skipHydration: false,
      version: 2,
      migrate: (persistedState, version) => {
        const state = (persistedState as Partial<CartState>) ?? {}

        if (version < 2) {
          return {
            ...state,
            items: [],
            subtotal: 0,
            shipping: 0,
            total: 0,
          }
        }

        return state
      },
    }
  )
)
