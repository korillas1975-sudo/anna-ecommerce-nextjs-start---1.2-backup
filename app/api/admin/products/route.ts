import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { ProductCreateSchema, zodErrorToFields } from '@/lib/validation'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user || (session.user as { role?: string | null }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const parsed = ProductCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', errors: zodErrorToFields(parsed.error) }, { status: 400 })
  }

  const { images, ...rest } = parsed.data
  const product = await db.product.create({
    data: {
      ...rest,
      images: JSON.stringify(images),
    },
  })

  return NextResponse.json({ id: product.id, slug: product.slug })
}

