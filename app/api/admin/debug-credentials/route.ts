import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = process.env.SEED_TOKEN?.trim()
  const provided = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    || url.searchParams.get('token')
  if (!token || !provided || provided !== token) return unauthorized()

  const email = (url.searchParams.get('email') || '').trim().toLowerCase()
  const password = (url.searchParams.get('password') || '').trim()
  if (!email || !password) return NextResponse.json({ error: 'email and password required' }, { status: 400 })

  const user = await db.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ ok: false, found: false, match: false })
  if (!user.password) return NextResponse.json({ ok: false, found: true, match: false, note: 'no password set' })
  const match = await bcrypt.compare(password, user.password)
  return NextResponse.json({ ok: true, found: true, match })
}

