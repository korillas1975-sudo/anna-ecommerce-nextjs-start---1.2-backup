import { Suspense } from 'react'
import ProductGrid from '@/components/products/ProductGrid'
import ProductFilters from '@/components/products/ProductFilters'

export const metadata = {
  title: 'All Products | ANNA PARIS',
  description: 'Explore our complete collection of luxury jewelry',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; search?: string }>
}) {
  const params = await searchParams
  return (
    <main className="min-h-screen bg-bg">
      {/* Header */}
      <div className="border-b border-hairline bg-white">
        <div className="max-w-[1700px] mx-auto px-5 md:px-10 lg:px-[54px] py-12 md:py-16">
          <h1 className="font-serif text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] font-medium text-ink mb-4 -tracking-[0.02em]">
            All Products
          </h1>
          <p className="font-serif text-[1rem] md:text-[1.1rem] text-ink-2/70 max-w-[60ch]">
            Discover our complete collection of handcrafted luxury jewelry
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1700px] mx-auto px-5 md:px-10 lg:px-[54px] py-10 md:py-14">
        <div className="grid lg:grid-cols-[240px_1fr] gap-8 lg:gap-12">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block">
            <Suspense fallback={<div>Loading filters...</div>}>
              <ProductFilters />
            </Suspense>
          </aside>

          {/* Products Grid */}
          <div>
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid searchParams={params} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] bg-platinum/40 mb-3" />
          <div className="h-4 bg-platinum/40 mb-2 w-3/4" />
          <div className="h-3 bg-platinum/40 w-1/2" />
        </div>
      ))}
    </div>
  )
}
