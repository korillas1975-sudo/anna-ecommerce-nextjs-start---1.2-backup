import { create } from 'zustand'
import type { CartItem, Product } from '@/lib/types'

interface CartState {
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  addItem: (product: Product) => void
  removeItem: (id: string | number) => void
  updateQuantity: (id: string | number, change: number) => void
  calculateTotals: () => void
  initCart: () => void
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,
  shipping: 0,
  total: 0,

  addItem: (product) => {
    const { items } = get()
    const existingItem = items.find((i) => i.id === product.id)

    if (existingItem) {
      set({
        items: items.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      })
    } else {
      set({ items: [...items, { ...product, quantity: 1 }] })
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

  calculateTotals: () => {
    const { items } = get()
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal >= 3000 ? 0 : 50
    const total = subtotal + shipping

    set({ subtotal, shipping, total })
  },

  initCart: () => {
    // Demo items (same as original)
    set({
      items: [
        {
          id: 1,
          name: 'Diamond Solitaire Ring',
          price: 2850.0,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
          variant: '18K White Gold, Size 6',
        },
        {
          id: 2,
          name: 'Pearl Drop Earrings',
          price: 1250.0,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400',
          variant: '14K Yellow Gold',
        },
      ],
    })
    get().calculateTotals()
  },
}))
