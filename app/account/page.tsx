'use client'

import Link from 'next/link'
import { User, Package, Heart, MapPin, Settings } from 'lucide-react'

export default function AccountPage() {
  // TODO: Get user from session
  const user = { name: 'Anna Customer', email: 'customer@example.com' }

  const menuItems = [
    { icon: Package, label: 'Orders', href: '/account/orders', count: 3 },
    { icon: Heart, label: 'Wishlist', href: '/account/wishlist', count: 5 },
    { icon: MapPin, label: 'Addresses', href: '/account/addresses', count: 2 },
    { icon: Settings, label: 'Settings', href: '/account/settings' },
  ]

  return (
    <main className="min-h-screen bg-bg">
      <div className="border-b border-hairline bg-white">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-12">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-platinum flex items-center justify-center">
              <User className="w-8 h-8 text-ink-2/60" />
            </div>
            <div>
              <h1 className="font-serif text-[2rem] font-medium text-ink">{user.name}</h1>
              <p className="text-ink-2/60">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white border border-hairline p-6 hover:border-ink transition-colors group"
            >
              <item.icon className="w-8 h-8 text-ink-2/40 mb-4 group-hover:text-ink transition-colors" />
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-ink">{item.label}</h3>
                {item.count && (
                  <span className="text-sm text-ink-2/60">{item.count}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
