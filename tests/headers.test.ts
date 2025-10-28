import { describe, it, expect } from 'vitest'
import nextConfig from '../next.config'

describe('Security headers', () => {
  it('exposes CSP and other headers', async () => {
    const headers = await (nextConfig as any).headers()
    const entry = headers.find((h: any) => h.source === '/:path*')
    expect(entry).toBeTruthy()
    const keys = entry.headers.map((h: any) => h.key)
    expect(keys).toContain('Content-Security-Policy')
    expect(keys).toContain('Referrer-Policy')
    expect(keys).toContain('X-Content-Type-Options')
  })
})

