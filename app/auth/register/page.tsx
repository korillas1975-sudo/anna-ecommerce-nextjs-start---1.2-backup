"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

interface ValidationError {
  field: string
  message: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear errors when user types
    setError(null)
    setValidationErrors([])
  }

  const getFieldError = (field: string) => {
    return validationErrors.find((err) => err.field === field)?.message
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setValidationErrors([])

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.errors) {
          setValidationErrors(data.errors)
        } else {
          setError(data.error || 'Registration failed')
        }
        return
      }

      // Success - show message and auto-login
      setSuccess(true)
      
      // Auto sign in after 1.5 seconds
      setTimeout(async () => {
        const signInResult = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        })

        if (signInResult?.ok) {
          router.push('/account')
          router.refresh()
        }
      }, 1500)
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/account' })
  }

  if (success) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center px-5 py-14">
        <div className="w-full max-w-[480px] bg-white border border-hairline p-8 text-center">
          <div className="w-16 h-16 bg-champagne rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-medium text-ink mb-2">Welcome to Anna Paris</h1>
          <p className="text-ink-2 mb-4">Your account has been created successfully.</p>
          <p className="text-sm text-ink-2/60">Signing you in...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-5 py-14">
      <div className="w-full max-w-[480px] bg-white border border-hairline p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-[2rem] font-medium text-ink mb-2">Create Account</h1>
          <p className="text-ink-2 text-sm">Join Anna Paris and discover timeless elegance</p>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full border border-hairline py-3 px-4 flex items-center justify-center gap-3 hover:bg-platinum/30 transition-colors mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-sm font-medium text-ink">Continue with Google</span>
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-hairline"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-ink-2/60">Or register with email</span>
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-ink mb-2">
              Full Name <span className="text-ink-2/60">(optional)</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink"
              placeholder="Anna Smith"
            />
          </div>

          <div>
            <label className="block text-sm text-ink mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full border px-4 py-3 focus:outline-none focus:border-ink ${
                getFieldError('email') ? 'border-red-500' : 'border-hairline'
              }`}
              placeholder="you@example.com"
            />
            {getFieldError('email') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('email')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-ink mb-2">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full border px-4 py-3 focus:outline-none focus:border-ink ${
                getFieldError('password') ? 'border-red-500' : 'border-hairline'
              }`}
              placeholder="••••••••"
            />
            {getFieldError('password') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('password')}</p>
            )}
            <p className="mt-1 text-xs text-ink-2/60">
              Must be at least 8 characters with uppercase, lowercase, and number
            </p>
          </div>

          <div>
            <label className="block text-sm text-ink mb-2">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-white py-3 uppercase tracking-wider text-sm hover:bg-ink-2 transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-2">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-ink font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  )
}
