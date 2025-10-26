'use client'

import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { Moon, Sun, LogOut } from 'lucide-react'

export default function AdminTopBar() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('adminDark') === '1'
  })

  useEffect(() => {
    document.body.classList.toggle('admin-dark', dark)
    try { localStorage.setItem('adminDark', dark ? '1' : '0') } catch {}
  }, [dark])

  return (
    <div className="fixed right-3 top-[calc(var(--header-height,70px)+8px)] z-[95] flex gap-2">
      <button
        onClick={() => setDark((d) => !d)}
        className="border border-ink/20 bg-white/80 backdrop-blur px-3 py-2 text-xs text-ink hover:bg-white"
        title={dark ? 'Switch to light' : 'Switch to dark'}
      >
        {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
      <button
        onClick={() => signOut({ callbackUrl: '/auth/login' })}
        className="border border-ink/20 bg-white/80 backdrop-blur px-3 py-2 text-xs text-ink hover:bg-white flex items-center gap-1"
        title="Sign out"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </button>
    </div>
  )
}

