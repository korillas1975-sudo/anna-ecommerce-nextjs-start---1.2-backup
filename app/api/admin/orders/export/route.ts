import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import type { Prisma } from '@prisma/client'

interface CsvRow {
  [key: string]: string | number
}

function toCsv(rows: CsvRow[]): string {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const lines = [headers.join(',')]
  for (const row of rows) {
    lines.push(headers.map((h) => JSON.stringify(row[h] ?? '')).join(','))
  }
  return lines.join('\n')
}

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() || ''
  const status = searchParams.get('status')?.trim() || ''
  const from = searchParams.get('from')?.trim() || ''
  const to = searchParams.get('to')?.trim() || ''

  const where: Prisma.OrderWhereInput = {}
  if (q) {
    where.OR = [
      { orderNumber: { contains: q } },
      { user: { email: { contains: q } } },
    ]
  }
  if (status) where.status = status
  if (from || to) {
    where.createdAt = {}
    if (from) where.createdAt.gte = new Date(from)
    if (to) {
      const end = new Date(to)
      end.setHours(23, 59, 59, 999)
      where.createdAt.lte = end
    }
  }

  const orders = await db.order.findMany({
    where,
    include: { items: true, shippingAddress: true },
    orderBy: { createdAt: 'desc' },
  })

  const rows = orders.map((o) => ({
    orderNumber: o.orderNumber,
    status: o.status,
    total: o.total,
    items: o.items.length,
    createdAt: o.createdAt.toISOString(),
    customer: o.userId,
    city: o.shippingAddress?.city ?? '',
    country: o.shippingAddress?.country ?? '',
  }))

  const csv = toCsv(rows)
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="orders.csv"',
    },
  })
}
