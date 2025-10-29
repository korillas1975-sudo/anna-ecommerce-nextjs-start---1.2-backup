import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest'

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
    const mockedAuth = auth as unknown as MockedFunction<typeof auth>
    const mockedFind = db.order.findUnique as unknown as MockedFunction<typeof db.order.findUnique>
    mockedAuth.mockResolvedValue({ user: { id: 'u2', role: 'customer' } } as Awaited<ReturnType<typeof auth>>)
    mockedFind.mockResolvedValue({ id: 'o1', userId: 'u1', items: [], shippingAddress: null } as Awaited<ReturnType<typeof db.order.findUnique>>)
    const res = await GET(new Request('http://localhost'), { params: Promise.resolve({ id: 'o1' }) })
    expect(res.status).toBe(403)
  })
})
