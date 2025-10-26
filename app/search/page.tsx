import { Suspense } from 'react'
import ProductGrid from '@/components/products/ProductGrid'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  return (
    <main className="min-h-screen bg-bg">
      <div className="border-b border-hairline bg-white">
        <div className="max-w-[1700px] mx-auto px-5 md:px-10 py-12">
          <h1 className="font-serif text-[2rem] md:text-[3rem] font-medium text-ink mb-4">
            Search Results
          </h1>
          {params.q && (
            <p className="text-ink-2/70">
              Showing results for <span className="font-medium text-ink">&quot;{params.q}&quot;</span>
            </p>
          )}
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto px-5 md:px-10 py-10">
        <Suspense fallback={<div>Loading...</div>}>
          <ProductGrid searchParams={{ search: params.q }} />
        </Suspense>
      </div>
    </main>
  )
}
