"use client"

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-ink-2">Loading...</div>
      </div>
    )
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const user = session?.user as { name?: string; email?: string; role?: string } | undefined

  return (
    <main className="min-h-screen bg-bg py-14 px-5">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/account" className="text-ink-2 text-sm hover:text-ink mb-4 inline-block">
            â† Back to Account
          </Link>
          <h1 className="font-serif text-3xl text-ink">Account Settings</h1>
        </div>

        {/* Account Info */}
        <div className="bg-white border border-hairline p-6 mb-6">
          <h2 className="font-serif text-xl text-ink mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-ink-2">Name</label>
              <p className="text-ink font-medium">{user?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-ink-2">Email</label>
              <p className="text-ink font-medium">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm text-ink-2">Account Type</label>
              <p className="text-ink font-medium capitalize">{user?.role || 'Customer'}</p>
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="bg-white border border-hairline p-6">
          <h2 className="font-serif text-xl text-ink mb-4">Sign Out</h2>
          <p className="text-ink-2 mb-4">
            Sign out of your account. You&apos;ll need to sign in again to access your orders and settings.
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-3 hover:bg-red-700 transition-colors uppercase tracking-wider text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </main>
  )
}


