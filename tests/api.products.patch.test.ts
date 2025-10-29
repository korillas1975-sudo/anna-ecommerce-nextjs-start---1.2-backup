import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest'

vi.mock('../lib/auth', () => ({ auth: vi.fn() }))
vi.mock('../lib/db', () => ({
  db: {
    product: { update: vi.fn() },
  },
}))

import { PATCH } from '../app/api/products/[slug]/route'
import { auth } from '../lib/auth'
import { db } from '../lib/db'

describe('PATCH /api/products/[slug]', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns 403 when user is not admin', async () => {
    const mockedAuth = auth as unknown as MockedFunction<typeof auth>
    mockedAuth.mockResolvedValue({ user: { id: 'u1', role: 'customer' } } as Awaited<ReturnType<typeof auth>>)
    const req = new Request('http://localhost', { method: 'PATCH', body: JSON.stringify({ name: 'X' }) })
    const res = await PATCH(req, { params: Promise.resolve({ slug: 'p1' }) })
    expect(res.status).toBe(403)
  })

  it('validates payload and returns 400 on invalid body', async () => {
    mockedAuth.mockResolvedValue({ user: { id: 'admin', role: 'admin' } } as Awaited<ReturnType<typeof auth>>)
    const req = new Request('http://localhost', { method: 'PATCH', body: JSON.stringify({ price: -10 }) })
    const res = await PATCH(req, { params: Promise.resolve({ slug: 'p1' }) })
    expect(res.status).toBe(400)
  })

  it('updates product for admin', async () => {
    mockedAuth.mockResolvedValue({ user: { id: 'admin', role: 'admin' } } as Awaited<ReturnType<typeof auth>>)
    const mockedUpdate = db.product.update as unknown as MockedFunction<typeof db.product.update>
    mockedUpdate.mockResolvedValue({ id: 'p1', name: 'New' } as Awaited<ReturnType<typeof db.product.update>>)
    const req = new Request('http://localhost', { method: 'PATCH', body: JSON.stringify({ name: 'New' }) })
    const res = await PATCH(req, { params: Promise.resolve({ slug: 'p1' }) })
    expect(res.status).toBe(200)
  })
})
