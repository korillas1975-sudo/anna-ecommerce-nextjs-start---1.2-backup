import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import type { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from')?.trim() || ''
  const to = searchParams.get('to')?.trim() || ''

  const where: Prisma.OrderWhereInput = {}
  if (from || to) {
    where.createdAt = {}
    if (from) where.createdAt.gte = new Date(from)
    if (to) {
      const end = new Date(to)
      end.setHours(23, 59, 59, 999)
      where.createdAt.lte = end
    }
  }

  const [ordersCount, productsCount, customersCount, revenueAgg] = await Promise.all([
    db.order.count({ where }),
    db.product.count({}),
    db.user.count({ where: { role: 'customer' } }),
    db.order.aggregate({ _sum: { total: true }, where }),
  ])

  return NextResponse.json({
    orders: ordersCount,
    products: productsCount,
    customers: customersCount,
    revenue: Math.round(revenueAgg._sum.total || 0),
  })
}

