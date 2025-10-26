import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import type { Order, OrderItem, Product, Address } from '@prisma/client'

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

function serializeOrder(order: OrderEntity) {
  const shipping = order.shippingAddress
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
    : null

  return {
    ...order,
    shippingAddress: shipping,
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
      try { return order.notes ? JSON.parse(order.notes) : [] } catch { return [] }
    })(),
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const order = await db.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const isAdmin = (session.user as { role?: string | null }).role === 'admin'
    const isOwner = order.userId === session.user.id
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(serializeOrder(order))
  } catch (error) {
    console.error('Fetch order error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user || (session.user as { role?: string | null }).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { status } = body

    const order = await db.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    })

    return NextResponse.json(serializeOrder(order))
  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
