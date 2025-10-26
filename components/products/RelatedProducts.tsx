'use client'

import ProductCard from './ProductCard'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice: number | null
  images: string[]
  category: { name: string }
  tags: string[]
}

export default function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-16 md:py-20 border-t border-hairline">
      <div className="max-w-[1700px] mx-auto px-5 md:px-10 lg:px-[54px]">
        <h2 className="font-serif text-[1.75rem] md:text-[2.35rem] font-medium text-ink mb-8 md:mb-12">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
