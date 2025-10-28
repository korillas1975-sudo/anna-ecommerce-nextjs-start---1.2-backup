"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const { data: session } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      
      if (res?.ok) {
        // Check if user is admin or customer
        const dest = params?.get('from') || '/account'
        router.push(dest)
        router.refresh()
      } else {
        setError('Invalid email or password')
      }
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    const dest = params?.get('from') || '/account'
    signIn('google', { callbackUrl: dest })
  }

  const urlError = params?.get('error')

  useEffect(() => {
    // If already logged in, redirect
    if (session?.user) {
      const userRole = (session.user as { role?: string }).role
      const dest = params?.get('from') || (userRole === 'admin' ? '/admin' : '/account')
      router.replace(dest)
    }
  }, [session, params, router])

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-5 py-14">
      <div className="w-full max-w-[480px] bg-white border border-hairline p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-[2rem] font-medium text-ink mb-2">Welcome Back</h1>
          <p className="text-ink-2 text-sm">Sign in to your Anna Paris account</p>
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
            <span className="px-4 bg-white text-ink-2/60">Or sign in with email</span>
          </div>
        </div>

        {/* Error Messages */}
        {urlError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
            {urlError === 'CredentialsSignin' ? 'Invalid email or password' : urlError}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
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
          
          <div>
            <label className="block text-sm text-ink mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-ink-2">Remember me</span>
            </label>
            <Link href="/auth/forgot-password" className="text-ink hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-white py-3 uppercase tracking-wider text-sm hover:bg-ink-2 transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-2">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-ink font-medium hover:underline">
            Create Account
          </Link>
        </p>

        {/* Admin Login Note */}
        <div className="mt-6 pt-6 border-t border-hairline text-center">
          <p className="text-xs text-ink-2/60">
            Admin? Use admin@annaparis.com / admin123
          </p>
        </div>
      </div>
    </main>
  )
}
