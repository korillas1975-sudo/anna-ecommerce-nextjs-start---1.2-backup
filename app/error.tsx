"use client"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-5 py-14">
      <div className="w-full max-w-[520px] bg-white border border-hairline p-8 text-center">
        <h1 className="font-serif text-[2rem] font-medium text-ink mb-2">Something went wrong</h1>
        <p className="text-ink-2/70 mb-6">An unexpected error occurred. Please try again.</p>
        <button onClick={() => reset()} className="inline-block bg-ink text-white py-3 px-8 uppercase tracking-wider text-sm hover:bg-ink-2 transition-colors">
          Try Again
        </button>
        {error?.digest && (
          <p className="mt-4 text-xs text-ink-2/50">Reference: {error.digest}</p>
        )}
      </div>
    </main>
  )
}

