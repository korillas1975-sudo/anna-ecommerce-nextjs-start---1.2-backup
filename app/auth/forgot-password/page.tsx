"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // TODO: Implement password reset API
    // For now, just show success message
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
    }, 1000)
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center px-5 py-14">
        <div className="w-full max-w-[480px] bg-white border border-hairline p-8 text-center">
          <div className="w-16 h-16 bg-champagne rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h1 className="font-serif text-2xl font-medium text-ink mb-2">Check Your Email</h1>
          <p className="text-ink-2 mb-4">
            If an account exists for <strong>{email}</strong>, you will receive password reset instructions.
          </p>
          <p className="text-sm text-ink-2/60 mb-6">
            Please check your inbox and spam folder.
          </p>
          
          <Link
            href="/auth/login"
            className="inline-block text-ink hover:underline text-sm"
          >
            Back to Sign In
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-5 py-14">
      <div className="w-full max-w-[480px] bg-white border border-hairline p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-[2rem] font-medium text-ink mb-2">Reset Password</h1>
          <p className="text-ink-2 text-sm">Enter your email to receive reset instructions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-ink mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-white py-3 uppercase tracking-wider text-sm hover:bg-ink-2 transition-colors disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-2">
          Remember your password?{' '}
          <Link href="/auth/login" className="text-ink font-medium hover:underline">
            Sign In
          </Link>
        </p>

        <div className="mt-6 p-4 bg-champagne/20 border border-champagne text-sm text-ink-2">
          <p className="font-medium mb-1">Note:</p>
          <p className="text-xs">Password reset functionality will be available once email system is configured.</p>
        </div>
      </div>
    </main>
  )
}
