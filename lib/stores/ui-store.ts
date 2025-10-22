import { create } from 'zustand'

interface UIState {
  isNavOpen: boolean
  isSearchOpen: boolean
  isCartOpen: boolean
  openNav: () => void
  closeNav: () => void
  toggleNav: () => void
  openSearch: () => void
  closeSearch: () => void
  toggleSearch: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  closeAll: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isNavOpen: false,
  isSearchOpen: false,
  isCartOpen: false,

  openNav: () => set({ isNavOpen: true }),
  closeNav: () => set({ isNavOpen: false }),
  toggleNav: () => set((state) => ({ isNavOpen: !state.isNavOpen })),

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  closeAll: () => set({ isNavOpen: false, isSearchOpen: false, isCartOpen: false }),
}))
