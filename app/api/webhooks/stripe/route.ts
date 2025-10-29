import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { sendMail } from '@/lib/email/mailer'
import { renderOrderConfirmation } from '@/lib/email/templates'

export async function POST(request: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripeSecret || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: '2025-09-30.clover' })

  const sig = request.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event: Stripe.Event
  const payload = await request.text()
  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret)
  } catch (err) {
    console.error('Stripe webhook signature error:', err)
    return new NextResponse('Invalid signature', { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = (session.metadata?.orderId as string) || session.client_reference_id || ''
        const paymentIntentId = (session.payment_intent as string) || ''
        if (orderId) {
          const updated = await db.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: 'paid',
              status: 'processing',
              paymentIntent: paymentIntentId || undefined,
            },
            include: {
              items: true,
              shippingAddress: true,
              user: { select: { email: true } },
            },
          })
          // Send confirmation email (best-effort)
          const to = updated.user?.email || 'customer@example.com'
          try {
            const typed = updated as Parameters<typeof renderOrderConfirmation>[0]
            const { subject, html, text } = renderOrderConfirmation(typed)
            await sendMail({ to, subject, html, text })
          } catch (e) {
            console.error('Email send error:', e)
          }
        }
        break
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        const orderId = (pi.metadata?.orderId as string) || ''
        if (orderId) {
          await db.order.update({ where: { id: orderId }, data: { paymentStatus: 'failed' } })
        }
        break
      }
      default:
        // ignore other events
        break
    }
  } catch (err) {
    console.error('Stripe webhook handler error:', err)
    return NextResponse.json({ received: true }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

export const dynamic = 'force-dynamic'
