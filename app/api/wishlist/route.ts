import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const addSchema = z.object({ productId: z.string().min(1) })

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await db.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  })

  const mapped = items.map((w) => {
    let image = ''
    try {
      const arr = JSON.parse(w.product.images ?? '[]')
      if (Array.isArray(arr) && arr.length) image = arr[0]
    } catch {}
    return {
      id: w.productId,
      name: w.product.name,
      slug: w.product.slug,
      price: w.product.price,
      image,
    }
  })

  return NextResponse.json(mapped)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = addSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  const { productId } = parsed.data

  const product = await db.product.findUnique({ where: { id: productId } })
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  await db.wishlistItem.upsert({
    where: { userId_productId: { userId: session.user.id, productId } },
    update: {},
    create: { userId: session.user.id, productId },
  })

  let image = ''
  try {
    const arr = JSON.parse(product.images ?? '[]')
    if (Array.isArray(arr) && arr.length) image = arr[0]
  } catch {}

  return NextResponse.json({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    image,
  })
}

