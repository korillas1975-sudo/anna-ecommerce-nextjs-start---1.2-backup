import type { Order, OrderItem, Address } from '@prisma/client'
import { formatTHB } from '../utils/currency'

type OrderWithItems = Order & { items: (OrderItem & { product?: { name: string } | null })[]; shippingAddress: Address | null }

export function renderOrderConfirmation(order: OrderWithItems) {
  const subject = `Your Order ${order.orderNumber} is Confirmed`

  const rows = order.items
    .map((it) => {
      const name = it.productName || it.product?.name || 'Product'
      const line = formatTHB(it.price * it.quantity)
      return `<tr><td style="padding:8px 0;">${name} × ${it.quantity}</td><td style="padding:8px 0; text-align:right;">THB ${line}</td></tr>`
    })
    .join('')

  const shipping = order.shippingAddress
    ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br/>${order.shippingAddress.address1}$${order.shippingAddress.address2 ? '<br/>' + order.shippingAddress.address2 : ''}<br/>${order.shippingAddress.city} ${order.shippingAddress.state || ''} ${order.shippingAddress.postalCode}<br/>${order.shippingAddress.country}`
    : ''

  const html = `
  <div style="font-family:Segoe UI,Helvetica,Arial,sans-serif; color:#0F1A24;">
    <h2 style="font-weight:600;">Thank you for your purchase</h2>
    <p>Your order <strong>${order.orderNumber}</strong> has been confirmed.</p>
    <table style="width:100%; border-collapse:collapse; margin-top:16px;">
      ${rows}
      <tr><td style="padding-top:12px; border-top:1px solid #E6EAF0;"><strong>Total</strong></td><td style="padding-top:12px; border-top:1px solid #E6EAF0; text-align:right;"><strong>THB ${order.total.toLocaleString()}</strong></td></tr>
    </table>
    ${shipping ? `<p style="margin-top:16px;"><strong>Shipping Address</strong><br/>${shipping}</p>` : ''}
    <p style="margin-top:16px; color:#26313B;">We will notify you once your order ships.</p>
  </div>`

  const text = `Thank you for your purchase.\nOrder ${order.orderNumber} confirmed. Total THB ${order.total.toLocaleString()}.`

  return { subject, html, text }
}

export function renderOrderShipped(order: OrderWithItems) {
  const subject = `Your Order ${order.orderNumber} has shipped`
  const html = `
  <div style="font-family:Segoe UI,Helvetica,Arial,sans-serif; color:#0F1A24;">
    <h2 style="font-weight:600;">Your order is on the way</h2>
    <p>Order <strong>${order.orderNumber}</strong> has been shipped${order.trackingNumber ? ` with tracking number <strong>${order.trackingNumber}</strong>` : ''}.</p>
    <p style="margin-top:16px; color:#26313B;">Thank you for shopping with ANNA PARIS.</p>
  </div>`
  const text = `Your order ${order.orderNumber} has shipped. ${order.trackingNumber ? `Tracking: ${order.trackingNumber}` : ''}`
  return { subject, html, text }
}
