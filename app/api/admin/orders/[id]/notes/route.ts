import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()
  if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { message } = await request.json()
  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Message required' }, { status: 400 })
  }

  const order = await db.order.findUnique({ where: { id } })
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let notes: Array<{ id: string; author: string; message: string; at: string }>
  try { notes = order.notes ? JSON.parse(order.notes) : [] } catch { notes = [] }

  const entry = {
    id: crypto.randomUUID(),
    author: session.user.email || session.user.id || 'admin',
    message,
    at: new Date().toISOString(),
  }
  notes.unshift(entry)

  await db.order.update({ where: { id }, data: { notes: JSON.stringify(notes) } })
  return NextResponse.json({ ok: true, entry })
}

