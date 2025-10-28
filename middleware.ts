import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  try {
    const id = crypto.randomUUID()
    response.headers.set('x-request-id', id)
    // Basic request log (path + id). Avoid logging static assets.
    if (!request.nextUrl.pathname.startsWith('/_next') && !request.nextUrl.pathname.startsWith('/assets')) {
      console.log(`[req:${id}] ${request.method} ${request.nextUrl.pathname}`)
    }
  } catch {}
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

