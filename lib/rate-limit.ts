import { NextResponse } from 'next/server'

type Bucket = { count: number; expiresAt: number }

const globalStore = globalThis as unknown as {
  __rateLimitStore?: Map<string, Bucket>
}

const store = (globalStore.__rateLimitStore ??= new Map<string, Bucket>())

function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for') || ''
  if (xff) return xff.split(',')[0].trim()
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp
  return '0.0.0.0'
}

export function rateLimit(
  req: Request,
  key: string,
  limit: number,
  windowMs: number
): { ok: true } | { ok: false; response: NextResponse } {
  const ip = getClientIp(req)
  const bucketKey = `${key}:${ip}`
  const now = Date.now()
  const entry = store.get(bucketKey)

  if (!entry || entry.expiresAt <= now) {
    store.set(bucketKey, { count: 1, expiresAt: now + windowMs })
    return { ok: true }
  }

  if (entry.count >= limit) {
    const retryAfter = Math.max(1, Math.ceil((entry.expiresAt - now) / 1000))
    const res = NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
    return { ok: false, response: res }
  }

  entry.count += 1
  store.set(bucketKey, entry)
  return { ok: true }
}

