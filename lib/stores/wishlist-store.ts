import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string
  name: string
  slug: string
  price: number
  image: string
}

interface WishlistState {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  toggleItem: (item: WishlistItem) => void
  clear: () => void
  isInWishlist: (id: string) => boolean
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const exists = get().items.some((existing) => existing.id === item.id)
        if (exists) return
        set({ items: [...get().items, item] })
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) })
      },

      toggleItem: (item) => {
        const exists = get().isInWishlist(item.id)
        if (exists) {
          get().removeItem(item.id)
        } else {
          get().addItem(item)
        }
      },

      clear: () => set({ items: [] }),

      isInWishlist: (id) => get().items.some((item) => item.id === id),
    }),
    {
      name: 'wishlist-storage',
      version: 1,
    }
  )
)
