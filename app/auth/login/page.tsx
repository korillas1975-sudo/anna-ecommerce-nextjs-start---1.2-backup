"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession, signOut } from 'next-auth/react'

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
        const dest = params?.get('from') || '/admin'
        router.push(dest)
        router.refresh()
      } else {
        setError('Invalid email or password')
      }
    } catch {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  const urlError = params?.get('error')

  useEffect(() => {
    // If already logged in as admin, go to /admin directly
    if (session?.user && (session.user as { role?: string }).role === 'admin') {
      const dest = params?.get('from') || '/admin'
      router.replace(dest)
    }
  }, [session, params, router])

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-5 py-14">
      <div className="w-full max-w-[420px] bg-white border border-hairline p-6 md:p-8">
        <h1 className="font-serif text-[1.75rem] font-medium text-ink mb-6">Admin Login</h1>
        {urlError && (
          <p className="mb-4 text-sm text-red-600">{urlError}</p>
        )}
        {error && (
          <p className="mb-4 text-sm text-red-600">{error}</p>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-ink mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink"
              placeholder="admin@annaparis.com"
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-white py-3 uppercase tracking-wider text-sm hover:bg-ink-2 transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-xs text-ink-2/60">Use admin@annaparis.com / admin123 (from seed)</p>
        {session?.user && (
          <div className="mt-4 text-xs text-ink-2/70">
            <p>Signed in as: {(session.user as { email?: string; role?: string }).email} (role: {(session.user as { role?: string }).role || 'n/a'})</p>
            <button onClick={() => signOut({ callbackUrl: '/auth/login' })} className="mt-2 underline">
              Sign out
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
