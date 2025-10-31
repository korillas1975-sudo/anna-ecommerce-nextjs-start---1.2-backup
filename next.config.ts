import type { NextConfig } from "next";
import type { RemotePattern } from 'next/dist/shared/lib/image-config'
import path from 'path'

const nextConfig: NextConfig = {
  // Force Next.js to treat this folder as the workspace root
  // to avoid picking up parent lockfiles and building the wrong tree.
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // S3/CloudFront images domain (optional via env)
  // Will be appended below if configured
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production'
    const s3Public = process.env.NEXT_PUBLIC_S3_PUBLIC_DOMAIN || process.env.NEXT_PUBLIC_S3_BASE_URL || ''
    const s3Host = (() => {
      try {
        if (!s3Public) return ''
        const u = new URL(s3Public.startsWith('http') ? s3Public : `https://${s3Public}`)
        return `${u.protocol}//${u.hostname}`
      } catch {
        return ''
      }
    })()

    const imgSrc = [
      "'self'",
      'data:',
      'blob:',
      'https://images.unsplash.com',
      'https://upload.wikimedia.org',
      ...(s3Host ? [s3Host] : []),
    ]

    const connectSrc = [
      "'self'",
      ...(s3Host ? [s3Host] : []),
      'https://api.stripe.com',
    ]

    const scriptSrc = [
      "'self'",
      // Allow inline scripts so Next.js runtime can bootstrap/hydrate in production.
      // We can tighten this later with nonces/strict-dynamic once stable.
      "'unsafe-inline'",
      ...(isDev ? ["'unsafe-eval'"] : []),
      'https://js.stripe.com',
    ]

    const styleSrc = ["'self'", "'unsafe-inline'"]
    const fontSrc = ["'self'", 'data:']
    const frameSrc = ['https://js.stripe.com', 'https://hooks.stripe.com']

    const directives = [
      `default-src 'self'`,
      `script-src ${scriptSrc.join(' ')}`,
      `style-src ${styleSrc.join(' ')}`,
      `img-src ${imgSrc.join(' ')}`,
      `font-src ${fontSrc.join(' ')}`,
      `connect-src ${connectSrc.join(' ')}`,
      `frame-src ${frameSrc.join(' ')}`,
      `frame-ancestors 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
    ]

    const csp = directives.join('; ')

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Permissions-Policy', value: 'geolocation=(), camera=(), microphone=(), payment=()' },
        ],
      },
    ]
  },
};

// Optionally allow S3/CloudFront domain for product images from env
const s3Domain = process.env.NEXT_PUBLIC_S3_PUBLIC_DOMAIN || process.env.NEXT_PUBLIC_S3_BASE_URL
if (s3Domain) {
  try {
    const url = new URL(s3Domain.startsWith('http') ? s3Domain : `https://${s3Domain}`)
    const proto = url.protocol === 'https:' ? 'https' : 'http'
    const newPattern: RemotePattern = {
      protocol: proto,
      hostname: url.hostname,
      pathname: '/**',
    }
    nextConfig.images = {
      ...(nextConfig.images ?? {}),
      remotePatterns: [
        ...((nextConfig.images?.remotePatterns ?? []) as RemotePattern[]),
        newPattern as RemotePattern,
      ],
    }
  } catch {}
}

export default nextConfig;
