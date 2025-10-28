import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session?.user || (session.user as { role?: string | null }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const pages = await db.contentPage.findMany({
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, slug: true, published: true, updatedAt: true },
  })

  return NextResponse.json(pages)
}

