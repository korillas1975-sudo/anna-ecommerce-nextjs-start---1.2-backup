import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../app/api/products/[slug]/route', async (orig) => {
  const actual = await (orig as any)()
  return actual
})

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
    ;(auth as any).mockResolvedValue({ user: { id: 'u1', role: 'customer' } })
    const req = new Request('http://localhost', { method: 'PATCH', body: JSON.stringify({ name: 'X' }) })
    const res = await PATCH(req, { params: Promise.resolve({ slug: 'p1' }) } as any)
    expect(res.status).toBe(403)
  })

  it('validates payload and returns 400 on invalid body', async () => {
    ;(auth as any).mockResolvedValue({ user: { id: 'admin', role: 'admin' } })
    const req = new Request('http://localhost', { method: 'PATCH', body: JSON.stringify({ price: -10 }) })
    const res = await PATCH(req, { params: Promise.resolve({ slug: 'p1' }) } as any)
    expect(res.status).toBe(400)
  })

  it('updates product for admin', async () => {
    ;(auth as any).mockResolvedValue({ user: { id: 'admin', role: 'admin' } })
    ;(db.product.update as any).mockResolvedValue({ id: 'p1', name: 'New' })
    const req = new Request('http://localhost', { method: 'PATCH', body: JSON.stringify({ name: 'New' }) })
    const res = await PATCH(req, { params: Promise.resolve({ slug: 'p1' }) } as any)
    expect(res.status).toBe(200)
  })
})

