import { describe, it, expect } from 'vitest'
import nextConfig from '../next.config'

describe('Security headers', () => {
  it('exposes CSP and other headers', async () => {
    type HeaderEntry = { source: string; headers: { key: string; value: string }[] }
    const headers = (await nextConfig.headers?.()) as HeaderEntry[]
    const entry = headers.find((h) => h.source === '/:path*')
    expect(entry).toBeTruthy()
    const keys = (entry?.headers ?? []).map((h) => h.key)
    expect(keys).toContain('Content-Security-Policy')
    expect(keys).toContain('Referrer-Policy')
    expect(keys).toContain('X-Content-Type-Options')
  })
})
