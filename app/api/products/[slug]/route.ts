import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const product = await db.product.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Parse JSON fields
    const parsedProduct = {
      ...product,
      images: (() => {
        try {
          const parsed = JSON.parse(product.images)
          return Array.isArray(parsed) ? parsed : []
        } catch {
          return []
        }
      })(),
      tags: (() => {
        try {
          return product.tags ? JSON.parse(product.tags) : []
        } catch {
          return []
        }
      })(),
      variants: (() => {
        try {
          return product.variants ? JSON.parse(product.variants) : null
        } catch {
          return null
        }
      })(),
      details: (() => {
        try {
          return product.details ? JSON.parse(product.details) : null
        } catch {
          return null
        }
      })(),
    }

    // Get related products from same category
    const relatedProducts = await db.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        published: true,
      },
      include: {
        category: true,
      },
      take: 4,
    })

    const parsedRelated = relatedProducts.map(p => ({
      ...p,
      images: (() => {
        try {
          const parsed = JSON.parse(p.images)
          return Array.isArray(parsed) ? parsed : []
        } catch {
          return []
        }
      })(),
      tags: (() => {
        try {
          return p.tags ? JSON.parse(p.tags) : []
        } catch {
          return []
        }
      })(),
    }))

    return NextResponse.json({
      product: parsedProduct,
      relatedProducts: parsedRelated,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: slugParam } = await params
    const session = await auth()
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      slug,
      description,
      price,
      compareAtPrice,
      stock,
      categoryId,
      published,
      featured,
    } = body

    const product = await db.product.update({
      where: { slug: slugParam },
      data: {
        name,
        slug,
        description,
        price,
        compareAtPrice,
        stock,
        categoryId,
        published,
        featured,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const session = await auth()
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await db.product.delete({
      where: { slug },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Product delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
