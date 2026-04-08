import postmark from 'postmark'
import type { AuthoritativeOrderItem } from '@/lib/order-pricing'
import { PAYMENT_LABEL, normalizePaymentMethod } from '@/lib/payment-methods'
import { getPublicSiteUrl } from '@/lib/site-url'
import { SHIPPING_METHOD_LABEL, type ShippingMethod } from '@/lib/shipping'

const STORE_NAME = 'Lovely Queen African Market'

export type OrderRowForEmail = {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  address_line: string
  city: string
  state: string | null
  country: string
  postal_code: string | null
  subtotal_amount: number
  shipping_fee: number
  total_amount: number
  shipping_method: string | null
  payment_method: string | null
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function money(n: number): string {
  return `$${Number(n).toFixed(2)}`
}

function itemsTableHtml(items: AuthoritativeOrderItem[]): string {
  const rows = items
    .map(
      (line) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(line.product_name)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${line.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${money(line.product_price)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${money(line.subtotal)}</td>
    </tr>`
    )
    .join('')
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px;">
    <thead>
      <tr style="background:#0f3d2e;color:#fff;">
        <th style="padding:10px 12px;text-align:left;">Item</th>
        <th style="padding:10px 12px;text-align:center;">Qty</th>
        <th style="padding:10px 12px;text-align:right;">Price</th>
        <th style="padding:10px 12px;text-align:right;">Subtotal</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`
}

function itemsPlainText(items: AuthoritativeOrderItem[]): string {
  return items
    .map(
      (line) =>
        `${line.product_name}  x${line.quantity}  @ ${money(line.product_price)}  = ${money(line.subtotal)}`
    )
    .join('\n')
}

function receiptHtml(order: OrderRowForEmail, items: AuthoritativeOrderItem[]): string {
  const pay =
    PAYMENT_LABEL[normalizePaymentMethod(order.payment_method)] ?? order.payment_method ?? '—'
  const ship = SHIPPING_METHOD_LABEL[(order.shipping_method as ShippingMethod) ?? 'standard'] ?? order.shipping_method ?? '—'
  const base = getPublicSiteUrl()
  const trackPath = `/track-order?id=${encodeURIComponent(order.id)}`
  const trackUrl = base ? `${base}${trackPath}` : trackPath

  return `
<!DOCTYPE html>
<html><body style="font-family:system-ui,-apple-system,sans-serif;line-height:1.5;color:#111;background:#f9f9f9;margin:0;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:28px;border:1px solid #e5e5e5;">
    <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#0f3d2e;font-weight:600;">${escapeHtml(STORE_NAME)}</p>
    <h1 style="margin:0 0 12px;font-size:22px;">Thanks for your order</h1>
    <p style="margin:0 0 20px;color:#444;font-size:15px;">Hi ${escapeHtml(order.customer_name)}, we received your order and will send updates to this email.</p>
    <p style="margin:0 0 16px;font-size:13px;color:#666;"><strong>Order ID:</strong> ${escapeHtml(order.id)}</p>
    ${itemsTableHtml(items)}
    <table role="presentation" style="width:100%;margin-top:16px;font-size:14px;">
      <tr><td style="padding:4px 0;">Subtotal</td><td style="text-align:right;">${money(order.subtotal_amount)}</td></tr>
      <tr><td style="padding:4px 0;">Shipping</td><td style="text-align:right;">${money(order.shipping_fee)}</td></tr>
      <tr><td style="padding:12px 0 4px;font-weight:700;border-top:1px solid #eee;">Total</td><td style="text-align:right;padding:12px 0 4px;font-weight:700;border-top:1px solid #eee;">${money(order.total_amount)}</td></tr>
    </table>
    <p style="margin:20px 0 8px;font-size:13px;color:#444;"><strong>Ship to</strong></p>
    <p style="margin:0;font-size:14px;color:#333;">
      ${escapeHtml(order.address_line)}<br/>
      ${escapeHtml(order.city)}${order.state ? `, ${escapeHtml(order.state)}` : ''} ${escapeHtml(order.postal_code ?? '')}<br/>
      ${escapeHtml(order.country)}
    </p>
    <p style="margin:16px 0 0;font-size:13px;color:#444;"><strong>Payment:</strong> ${escapeHtml(pay)} &nbsp;·&nbsp; <strong>Shipping:</strong> ${escapeHtml(ship)}</p>
    <p style="margin:24px 0 0;">
      <a href="${trackUrl}" style="display:inline-block;background:#0f3d2e;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-size:14px;font-weight:600;">Track your order</a>
    </p>
  </div>
  <p style="max-width:560px;margin:16px auto 0;text-align:center;font-size:12px;color:#888;">This message was sent because you placed an order at ${escapeHtml(STORE_NAME)}.</p>
</body></html>`
}

function receiptText(order: OrderRowForEmail, items: AuthoritativeOrderItem[]): string {
  const pay = PAYMENT_LABEL[normalizePaymentMethod(order.payment_method)] ?? String(order.payment_method)
  const ship = SHIPPING_METHOD_LABEL[(order.shipping_method as ShippingMethod) ?? 'standard'] ?? String(order.shipping_method)
  return [
    `${STORE_NAME} — Order confirmation`,
    ``,
    `Hi ${order.customer_name},`,
    ``,
    `Order ID: ${order.id}`,
    ``,
    itemsPlainText(items),
    ``,
    `Subtotal: ${money(order.subtotal_amount)}`,
    `Shipping: ${money(order.shipping_fee)}`,
    `Total: ${money(order.total_amount)}`,
    ``,
    `Ship to:`,
    `${order.address_line}`,
    `${order.city}${order.state ? `, ${order.state}` : ''} ${order.postal_code ?? ''}`,
    `${order.country}`,
    ``,
    `Payment: ${pay}`,
    `Shipping: ${ship}`,
    ``,
    `Track: ${getPublicSiteUrl()}/track-order?id=${order.id}`,
  ].join('\n')
}

function merchantHtml(order: OrderRowForEmail, items: AuthoritativeOrderItem[]): string {
  const base = getPublicSiteUrl()
  const adminPath = `/admin/orders/${order.id}`
  const adminUrl = base ? `${base}${adminPath}` : adminPath

  return `
<!DOCTYPE html>
<html><body style="font-family:system-ui,-apple-system,sans-serif;line-height:1.5;color:#111;background:#f9f9f9;margin:0;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:28px;border:1px solid #e5e5e5;">
    <h1 style="margin:0 0 8px;font-size:20px;color:#0f3d2e;">New order</h1>
    <p style="margin:0 0 16px;font-size:14px;color:#444;"><strong>${escapeHtml(order.customer_name)}</strong> placed an order for <strong>${money(order.total_amount)}</strong>.</p>
    <p style="margin:0 0 8px;font-size:13px;"><strong>Order ID:</strong> ${escapeHtml(order.id)}</p>
    <p style="margin:0 0 8px;font-size:13px;"><strong>Email:</strong> ${escapeHtml(order.customer_email)}</p>
    <p style="margin:0 0 16px;font-size:13px;"><strong>Phone:</strong> ${escapeHtml(order.customer_phone ?? '—')}</p>
    ${itemsTableHtml(items)}
    <p style="margin:20px 0 0;">
      <a href="${adminUrl.startsWith('http') ? adminUrl : '#'}" style="display:inline-block;background:#0f3d2e;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-size:14px;font-weight:600;">Open in admin</a>
    </p>
    ${!base ? `<p style="font-size:12px;color:#888;">Set NEXT_PUBLIC_SITE_URL for working links in email.</p>` : ''}
  </div>
</body></html>`
}

function merchantText(order: OrderRowForEmail, items: AuthoritativeOrderItem[]): string {
  return [
    `New order — ${STORE_NAME}`,
    `Total: ${money(order.total_amount)}`,
    `Order ID: ${order.id}`,
    `Customer: ${order.customer_name}`,
    `Email: ${order.customer_email}`,
    `Phone: ${order.customer_phone ?? '—'}`,
    ``,
    itemsPlainText(items),
    ``,
    `Admin: ${getPublicSiteUrl()}/admin/orders/${order.id}`,
  ].join('\n')
}

/**
 * Sends (1) receipt to the customer and (2) alert to the store inbox when configured.
 * Safe to call after the order is persisted; failures are logged and do not throw.
 */
export async function sendOrderEmails(order: OrderRowForEmail, items: AuthoritativeOrderItem[]): Promise<void> {
  const serverToken = process.env.POSTMARK_SERVER_TOKEN?.trim()
  if (!serverToken) {
    console.warn('[email] POSTMARK_SERVER_TOKEN is not set — skipping order emails.')
    return
  }

  const from = process.env.EMAIL_FROM?.trim()
  if (!from) {
    console.warn('[email] EMAIL_FROM is not set — skipping order emails (use a Postmark-verified sender).')
    return
  }

  const merchantTo = process.env.MERCHANT_ORDER_EMAIL?.trim()

  const client = new postmark.ServerClient(serverToken)
  const shortId = order.id.slice(0, 8)

  const stream = process.env.POSTMARK_MESSAGE_STREAM?.trim() || 'outbound'

  try {
    await client.sendEmail({
      From: from,
      To: order.customer_email,
      Subject: `Your order #${shortId} — ${STORE_NAME}`,
      HtmlBody: receiptHtml(order, items),
      TextBody: receiptText(order, items),
      MessageStream: stream,
    })
  } catch (error) {
    console.error('[email] Customer receipt failed:', error)
  }

  if (merchantTo) {
    try {
      await client.sendEmail({
        From: from,
        To: merchantTo,
        Subject: `New order #${shortId} — ${money(order.total_amount)} — ${order.customer_name}`,
        HtmlBody: merchantHtml(order, items),
        TextBody: merchantText(order, items),
        MessageStream: stream,
      })
    } catch (error) {
      console.error('[email] Merchant notification failed:', error)
    }
  } else {
    console.warn('[email] MERCHANT_ORDER_EMAIL not set — skipping store notification.')
  }
}
