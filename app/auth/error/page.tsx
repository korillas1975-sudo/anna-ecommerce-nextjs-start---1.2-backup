"use client"

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: { [key: string]: string } = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification: 'The verification token has expired or has already been used.',
    Default: 'An error occurred during authentication.',
  }

  const message = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-5 py-14">
      <div className="w-full max-w-[480px] bg-white border border-hairline p-8 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h1 className="font-serif text-2xl font-medium text-ink mb-2">Authentication Error</h1>
        <p className="text-ink-2 mb-6">{message}</p>
        
        <Link
          href="/auth/login"
          className="inline-block bg-ink text-white px-8 py-3 uppercase tracking-wider text-sm hover:bg-ink-2 transition-colors"
        >
          Back to Sign In
        </Link>
      </div>
    </main>
  )
}
