import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock both alias and relative paths to be safe
vi.mock('../lib/auth', () => ({ auth: vi.fn() }))
vi.mock('@/lib/auth', () => ({ auth: vi.fn() }))

vi.mock('../lib/db', () => ({
  db: { order: { update: vi.fn() } },
}))
vi.mock('@/lib/db', () => ({
  db: { order: { update: vi.fn() } },
}))

vi.mock('../lib/email/mailer', () => ({ sendMail: vi.fn() }))
vi.mock('@/lib/email/mailer', () => ({ sendMail: vi.fn() }))

// Import after mocks
import { PATCH } from '../app/api/orders/[id]/route'
import { auth as authAlias } from '@/lib/auth'
import { db as dbAlias } from '@/lib/db'
import { sendMail as sendMailAlias } from '@/lib/email/mailer'

describe('Order shipped email (PATCH /api/orders/[id])', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('sends email when status changes to shipped', async () => {
    ;(authAlias as any).mockResolvedValue({ user: { id: 'admin', role: 'admin' } })
    ;(dbAlias.order.update as any).mockResolvedValue({
      id: 'o1',
      orderNumber: 'ORD-2025-00001',
      status: 'shipped',
      total: 1000,
      trackingNumber: 'TRK123',
      items: [],
      shippingAddress: null,
      user: { email: 'customer@example.com' },
    })

    const req = new Request('http://localhost', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'shipped' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'o1' }) } as any)
    expect(res.status).toBe(200)
    expect((sendMailAlias as any).mock.calls.length).toBe(1)
    const args = (sendMailAlias as any).mock.calls[0][0]
    expect(args.to).toBe('customer@example.com')
  })

  it('does not send email for non-shipped status', async () => {
    ;(authAlias as any).mockResolvedValue({ user: { id: 'admin', role: 'admin' } })
    ;(dbAlias.order.update as any).mockResolvedValue({
      id: 'o2',
      orderNumber: 'ORD-2025-00002',
      status: 'processing',
      total: 2000,
      items: [],
      shippingAddress: null,
      user: { email: 'customer@example.com' },
    })

    const req = new Request('http://localhost', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'processing' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'o2' }) } as any)
    expect(res.status).toBe(200)
    expect((sendMailAlias as any).mock.calls.length).toBe(0)
  })
})

