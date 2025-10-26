import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')
    const sortParam = searchParams.get('sort') || 'createdAt'
    const orderParam = searchParams.get('order') || 'desc'

    const allowedSortFields = ['createdAt', 'price', 'name'] as const
    const sortField = allowedSortFields.includes(sortParam as typeof allowedSortFields[number])
      ? (sortParam as typeof allowedSortFields[number])
      : 'createdAt'

    const sortOrder = orderParam === 'asc' ? 'asc' : 'desc'

    const where: Prisma.ProductWhereInput = { published: true }

    if (category) {
      where.category = { slug: category }
    }

    if (featured === 'true') {
      where.featured = true
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const products = await db.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { [sortField]: sortOrder } as Prisma.ProductOrderByWithRelationInput,
      take: limit ? Number.parseInt(limit, 10) : undefined,
    })

    // Parse JSON fields
    const parsedProducts = products.map((p) => {
      let images: string[] = []
      let tags: string[] = []
      let variants: unknown = null
      let details: Record<string, unknown> | null = null

      try {
        const parsedImages = JSON.parse(p.images)
        images = Array.isArray(parsedImages) ? parsedImages : []
      } catch {
        images = []
      }

      try {
        tags = p.tags ? JSON.parse(p.tags) : []
      } catch {
        tags = []
      }

      try {
        variants = p.variants ? JSON.parse(p.variants) : null
      } catch {
        variants = null
      }

      try {
        details = p.details ? JSON.parse(p.details) : null
      } catch {
        details = null
      }

      return {
        ...p,
        images,
        tags,
        variants,
        details,
      }
    })

    return NextResponse.json(parsedProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
