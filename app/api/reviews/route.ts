import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

const REVIEWS_ENABLED = process.env.REVIEWS_ENABLED !== 'false'

export async function GET(request: Request) {
  try {
    if (!REVIEWS_ENABLED) return NextResponse.json({ items: [], total: 0, ratingAvg: 0, ratingCount: 0 })
    const { searchParams } = new URL(request.url)
    const slug = (searchParams.get('product') || '').trim()
    const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10))
    const pageSize = Math.min(20, Math.max(1, Number.parseInt(searchParams.get('pageSize') || '5', 10)))
    if (!slug) return NextResponse.json({ error: 'product slug required' }, { status: 400 })

    const product = await db.product.findUnique({ where: { slug } })
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    const [total, items] = await Promise.all([
      db.review.count({ where: { productId: product.id, status: 'approved' } }),
      db.review.findMany({
        where: { productId: product.id, status: 'approved' },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ])

    return NextResponse.json({
      items,
      total,
      ratingAvg: product.ratingAvg,
      ratingCount: product.ratingCount,
      page,
      pageSize,
    })
  } catch (e) {
    console.error('GET /api/reviews error', e)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

const reviewSchema = z.object({
  product: z.string().min(1), // slug
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  body: z.string().min(5).max(2000),
})

export async function POST(request: Request) {
  try {
    if (!REVIEWS_ENABLED) return NextResponse.json({ error: 'Reviews disabled' }, { status: 403 })
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const json = await request.json()
    const parsed = reviewSchema.safeParse(json)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

    const { product: slug, rating, title, body } = parsed.data
    const product = await db.product.findUnique({ where: { slug } })
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    // verify purchase
    const owned = await db.order.findFirst({
      where: {
        userId: session.user.id,
        paymentStatus: { in: ['paid', 'processing'] },
        items: { some: { productId: product.id } },
      },
      select: { id: true },
    })

    const review = await db.review.create({
      data: {
        productId: product.id,
        userId: session.user.id,
        authorName: (session.user.name || 'Customer').slice(0, 60),
        rating,
        title,
        body,
        status: 'pending',
        verifiedPurchase: Boolean(owned),
      },
    })

    return NextResponse.json({ ok: true, status: review.status })
  } catch (e) {
    console.error('POST /api/reviews error', e)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}

