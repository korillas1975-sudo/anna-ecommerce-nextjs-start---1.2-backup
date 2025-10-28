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
  setItems: (items: WishlistItem[]) => void
  syncWithServer: () => Promise<void>
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const exists = get().items.some((existing) => existing.id === item.id)
        if (exists) return
        set({ items: [...get().items, item] })
        // Fire-and-forget remote sync if logged in
        try {
          fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: String(item.id) }),
          }).catch(() => {})
        } catch {}
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) })
        // Fire-and-forget remote delete if logged in
        try { fetch(`/api/wishlist/${encodeURIComponent(String(id))}`, { method: 'DELETE' }).catch(() => {}) } catch {}
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

      setItems: (items) => set({ items }),

      syncWithServer: async () => {
        // Push local items to server (best-effort)
        const local = get().items
        try {
          // Try to add each local item remotely; ignore failures (e.g., not logged in)
          await Promise.all(
            local.map((it) =>
              fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: String(it.id) }),
              }).catch(() => {})
            )
          )
          // Then fetch remote list and set locally
          const res = await fetch('/api/wishlist')
          if (res.ok) {
            const data = (await res.json()) as WishlistItem[]
            set({ items: data })
          }
        } catch {}
      },
    }),
    {
      name: 'wishlist-storage',
      version: 1,
    }
  )
)
