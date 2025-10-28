"use client"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <main className="min-h-screen bg-bg flex items-center justify-center px-5 py-14">
          <div className="w-full max-w-[520px] bg-white border border-hairline p-8 text-center">
            <h1 className="font-serif text-[2rem] font-medium text-ink mb-2">A critical error occurred</h1>
            <p className="text-ink-2/70 mb-6">Please refresh the page or try again shortly.</p>
            <button onClick={() => reset()} className="inline-block bg-ink text-white py-3 px-8 uppercase tracking-wider text-sm hover:bg-ink-2 transition-colors">
              Reload
            </button>
            {error?.digest && (
              <p className="mt-4 text-xs text-ink-2/50">Reference: {error.digest}</p>
            )}
          </div>
        </main>
      </body>
    </html>
  )
}

