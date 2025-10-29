import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest'

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
    const mockedAuth = authAlias as unknown as MockedFunction<typeof authAlias>
    const mockedUpdate = dbAlias.order.update as unknown as MockedFunction<typeof dbAlias.order.update>
    mockedAuth.mockResolvedValue({ user: { id: 'admin', role: 'admin' } } as Awaited<ReturnType<typeof authAlias>>)
    mockedUpdate.mockResolvedValue({
      id: 'o1',
      orderNumber: 'ORD-2025-00001',
      status: 'shipped',
      total: 1000,
      trackingNumber: 'TRK123',
      items: [],
      shippingAddress: null,
      user: { email: 'customer@example.com' },
    } as Awaited<ReturnType<typeof dbAlias.order.update>>)

    const req = new Request('http://localhost', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'shipped' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'o1' }) })
    expect(res.status).toBe(200)
    const mockedSend = sendMailAlias as unknown as MockedFunction<typeof sendMailAlias>
    expect(mockedSend.mock.calls.length).toBe(1)
    const args = mockedSend.mock.calls[0][0]
    expect(args.to).toBe('customer@example.com')
  })

  it('does not send email for non-shipped status', async () => {
    mockedAuth.mockResolvedValue({ user: { id: 'admin', role: 'admin' } } as Awaited<ReturnType<typeof authAlias>>)
    mockedUpdate.mockResolvedValue({
      id: 'o2',
      orderNumber: 'ORD-2025-00002',
      status: 'processing',
      total: 2000,
      items: [],
      shippingAddress: null,
      user: { email: 'customer@example.com' },
    } as Awaited<ReturnType<typeof dbAlias.order.update>>)

    const req = new Request('http://localhost', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'processing' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'o2' }) })
    expect(res.status).toBe(200)
    const mockedSend = sendMailAlias as unknown as MockedFunction<typeof sendMailAlias>
    expect(mockedSend.mock.calls.length).toBe(0)
  })
})
