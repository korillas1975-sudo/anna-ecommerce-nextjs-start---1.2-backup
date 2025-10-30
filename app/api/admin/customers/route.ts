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

  // Avoid hard dependency on generated Prisma types during cloud builds
  // Use a narrow structural type instead of `any` to satisfy lint rules
  type UserWhereSubset = {
    role?: string
    OR?: Array<{ email?: { contains: string } } | { name?: { contains: string } }>
  }
  const where: UserWhereSubset = { role: 'customer' }
  if (q) {
    where.OR = [
      { email: { contains: q } },
      { name: { contains: q } },
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
