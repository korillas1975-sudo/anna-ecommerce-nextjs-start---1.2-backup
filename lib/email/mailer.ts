import nodemailer from 'nodemailer'

export type MailOptions = {
  to: string
  subject: string
  html: string
  text?: string
}

function getTransport() {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) return null
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

export async function sendMail(opts: MailOptions) {
  const transporter = getTransport()
  const from = process.env.SMTP_FROM || 'ANNA PARIS <no-reply@annaparis.com>'
  if (!transporter) {
    console.warn('[email] SMTP not configured; skipping send to', opts.to)
    return { skipped: true }
  }
  await transporter.sendMail({ from, to: opts.to, subject: opts.subject, html: opts.html, text: opts.text })
  return { ok: true }
}

