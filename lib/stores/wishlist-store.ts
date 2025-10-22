import { create } from 'zustand'

interface WishlistState {
  count: number
  setCount: (count: number) => void
}

export const useWishlistStore = create<WishlistState>((set) => ({
  count: 3, // Demo count
  setCount: (count) => set({ count }),
}))
