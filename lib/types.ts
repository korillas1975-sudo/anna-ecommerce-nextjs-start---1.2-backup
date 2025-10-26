// Product Types
export interface Product {
  id: string | number
  name: string
  price: number
  image: string
  slug?: string
  description?: string
  category?: string
  stock?: number
  rating?: number
  reviews?: number
}

// Cart Types
export interface CartItem extends Product {
  quantity: number
  variant?: string
}

// Wishlist Types
export interface WishlistItem extends Product {
  addedAt?: Date
}

// User Types
export interface User {
  id: string | number
  email: string
  name?: string
  avatar?: string
}

// Order Types
export interface Order {
  id: string | number
  items: CartItem[]
  subtotal: number
  shipping: number
  tax?: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
  user?: User
}
