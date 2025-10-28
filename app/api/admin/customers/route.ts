import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user || (session.user as { role?: string | null }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() || ''

  const where: any = { role: 'customer' }
  if (q) {
    where.OR = [
      { email: { contains: q, mode: 'insensitive' } },
      { name: { contains: q, mode: 'insensitive' } },
    ]
  }

  const customers = await db.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  })

  return NextResponse.json(customers)
}

