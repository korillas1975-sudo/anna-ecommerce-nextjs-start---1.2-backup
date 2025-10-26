import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import type { Order, OrderItem, Product, Address, Prisma } from '@prisma/client'

function parseJSON<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try {
    const parsed = JSON.parse(value)
    return parsed as T
  } catch {
    return fallback
  }
}

type OrderEntity = Order & {
  items: (OrderItem & { product: Product | null })[]
  shippingAddress: Address | null
}

export async function GET(request: Request) {
  try {
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
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const serialized = orders.map((order: OrderEntity) => ({
      ...order,
      shippingAddress: order.shippingAddress
        ? {
            firstName: order.shippingAddress.firstName,
            lastName: order.shippingAddress.lastName,
            address1: order.shippingAddress.address1,
            address2: order.shippingAddress.address2,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            postalCode: order.shippingAddress.postalCode,
            country: order.shippingAddress.country,
            phone: order.shippingAddress.phone,
          }
        : null,
      items: order.items.map((item) => ({
        ...item,
        product: item.product
          ? {
              ...item.product,
              images: parseJSON<string[]>(item.product.images, []),
              tags: parseJSON<string[]>(item.product.tags, []),
            }
          : null,
      })),
      notes: (() => {
        try {
          return order.notes ? JSON.parse(order.notes) : []
        } catch { return [] }
      })(),
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error('Fetch admin orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
