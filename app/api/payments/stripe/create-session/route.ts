import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json()
    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 })
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    // Basic ownership check: owner or guest user
    const session = await auth()
    if (session?.user?.id && order.userId !== session.user.id) {
      // If logged in and not owner, forbid
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY
    if (!stripeSecret) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' })

    const origin = new URL(request.url).origin
    const successUrl = `${origin}/checkout/success?orderId=${order.id}&orderNumber=${encodeURIComponent(order.orderNumber)}&session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${origin}/cart?canceled=1`

    const line_items = order.items.map((it) => ({
      quantity: it.quantity,
      price_data: {
        currency: 'thb',
        product_data: {
          name: it.productName,
          images: it.productImage ? [it.productImage] : undefined,
        },
        unit_amount: Math.round(it.price * 100),
      },
    }))

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: order.id,
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Stripe create-session error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
