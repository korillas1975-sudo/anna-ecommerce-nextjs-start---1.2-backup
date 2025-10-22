export interface Product {
  id: string | number
  name: string
  price: number
  image: string
  variant?: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface CartData {
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
}

export interface HeroContent {
  tagline: string
  headline: string
  videoUrl: string
}

export interface SiteContent {
  header: {
    menu: string
    gallery: string
  }
  hero: HeroContent
}
