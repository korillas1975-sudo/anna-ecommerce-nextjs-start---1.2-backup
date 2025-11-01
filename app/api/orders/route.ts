import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

const FREE_SHIPPING_THRESHOLD = 3000
const FLAT_SHIPPING_FEE = 50

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1),
    variant: z.string().nullable().optional(),
  })).min(1),
  shippingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    company: z.string().optional(),
    address1: z.string().min(1),
    address2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().optional(),
    postalCode: z.string().min(1),
    country: z.string().min(1),
    phone: z.string().optional(),
  }).optional(),
  paymentMethod: z.string().optional(),
})

async function ensureGuestUser() {
  const email = 'guest@annaparis.com'
  const existing = await db.user.findUnique({ where: { email } })
  if (existing) return existing.id

  const guest = await db.user.create({
    data: {
      email,
      name: 'Guest Customer',
      role: 'customer',
    },
  })

  return guest.id
}

function generateOrderNumber() {
  const now = new Date()
  const random = Math.floor(Math.random() * 100000)
  return `ORD-${now.getFullYear()}-${String(random).padStart(5, '0')}`
}

function parseJSON<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try {
    const parsed = JSON.parse(value)
    return parsed as T
  } catch {
    return fallback
  }
}

export async function POST(request: Request) {
  try {
    const limited = rateLimit(request, 'orders:create', 10, 60 * 1000)
    if (!limited.ok) return limited.response
    const session = await auth()
    const body = await request.json()

    // Validate request body
    const validation = createOrderSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { items, shippingAddress, paymentMethod } = validation.data

    const cartItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      variant: item.variant ?? null,
    }))

    const userId = session?.user?.id ?? (await ensureGuestUser())
    const orderResult = await db.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: {
          id: { in: cartItems.map((item) => item.productId) },
          published: true,
        },
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          images: true,
        },
      })

      if (products.length !== cartItems.length) {
        throw new Error('PRODUCTS_UNAVAILABLE')
      }

      const itemsById = Object.fromEntries(cartItems.map((item) => [item.productId, item]))

      let subtotal = 0
      for (const product of products) {
        const cartItem = itemsById[product.id]
        if (!cartItem) {
          throw new Error('CART_ITEM_MISSING')
        }

        if (product.stock < cartItem.quantity) {
          throw new Error(`OUT_OF_STOCK:${product.id}`)
        }

        subtotal += product.price * cartItem.quantity
      }

      const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE
      const tax = 0
      const total = subtotal + shipping + tax
      const orderNumber = generateOrderNumber()

      for (const product of products) {
        const cartItem = itemsById[product.id]
        if (!cartItem) {
          throw new Error('CART_ITEM_MISSING')
        }
        const updated = await tx.product.updateMany({
          where: {
            id: product.id,
            stock: { gte: cartItem.quantity },
          },
          data: {
            stock: {
              decrement: cartItem.quantity,
            },
          },
        })

        if (updated.count === 0) {
          throw new Error(`OUT_OF_STOCK:${product.id}`)
        }
      }

      // Create shipping address record (basic mapping from checkout form)
      let shippingAddressId: string | null = null
      if (shippingAddress && typeof shippingAddress === 'object') {
        const createdAddress = await tx.address.create({
          data: {
            userId,
            type: 'shipping',
            firstName: String(shippingAddress.firstName ?? ''),
            lastName: String(shippingAddress.lastName ?? ''),
            company: shippingAddress.company ? String(shippingAddress.company) : null,
            address1: String(shippingAddress.address1 ?? ''),
            address2: shippingAddress.address2 ? String(shippingAddress.address2) : null,
            city: String(shippingAddress.city ?? ''),
            state: shippingAddress.state ? String(shippingAddress.state) : null,
            postalCode: String(shippingAddress.postalCode ?? ''),
            country: String(shippingAddress.country ?? ''),
            phone: shippingAddress.phone ? String(shippingAddress.phone) : null,
            isDefault: false,
          },
        })
        shippingAddressId = createdAddress.id
      }
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: paymentMethod === 'credit_card' ? 'pending_payment' : 'pending',
          subtotal,
          shipping,
          tax,
          total,
          paymentMethod,
          shippingAddressId: shippingAddressId ?? undefined,
          items: {
            create: products.map((product) => {
              const cartItem = itemsById[product.id]
              if (!cartItem) {
                throw new Error('CART_ITEM_MISSING')
              }
              let productImage: string | null = null
              try {
                const parsed = JSON.parse(product.images ?? '[]')
                if (Array.isArray(parsed) && parsed.length > 0) {
                  productImage = parsed[0] ?? null
                }
              } catch {
                productImage = null
              }

              return {
                productId: product.id,
                quantity: cartItem.quantity,
                price: product.price,
                productName: product.name,
                productImage,
                variant: cartItem.variant,
              }
            }),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      return { order: createdOrder, total, orderNumber }
    })

    return NextResponse.json({
      orderNumber: orderResult.order.orderNumber,
      orderId: orderResult.order.id,
      total: orderResult.total,
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'PRODUCTS_UNAVAILABLE') {
        return NextResponse.json(
          { error: 'Some products are unavailable' },
          { status: 400 }
        )
      }
      if (error.message === 'CART_ITEM_MISSING') {
        return NextResponse.json(
          { error: 'Invalid cart items' },
          { status: 400 }
        )
      }
      if (error.message.startsWith('OUT_OF_STOCK:')) {
        return NextResponse.json(
          { error: 'Insufficient stock for one or more items' },
          { status: 409 }
        )
      }
    }
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || session.user.id

    const orders = await db.order.findMany({
      where: { userId },
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

    const serialized = orders.map((order) => ({
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
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error('Fetch orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
