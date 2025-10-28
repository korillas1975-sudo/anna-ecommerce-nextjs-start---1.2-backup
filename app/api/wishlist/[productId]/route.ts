import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await db.wishlistItem.delete({
    where: { userId_productId: { userId: session.user.id, productId } },
  }).catch(() => {})

  return NextResponse.json({ ok: true })
}

