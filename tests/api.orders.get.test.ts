import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../lib/auth', () => ({ auth: vi.fn() }))
vi.mock('../lib/db', () => ({
  db: {
    order: { findUnique: vi.fn() },
  },
}))

import { GET } from '../app/api/orders/[id]/route'
import { auth } from '../lib/auth'
import { db } from '../lib/db'

describe('GET /api/orders/[id]', () => {
  beforeEach(() => vi.resetAllMocks())

  it('denies access if not owner or admin', async () => {
    ;(auth as any).mockResolvedValue({ user: { id: 'u2', role: 'customer' } })
    ;(db.order.findUnique as any).mockResolvedValue({ id: 'o1', userId: 'u1', items: [], shippingAddress: null })
    const res = await GET(new Request('http://localhost'), { params: Promise.resolve({ id: 'o1' }) } as any)
    expect(res.status).toBe(403)
  })
})

