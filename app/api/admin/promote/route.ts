import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hash } from 'bcryptjs'

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
  const password = (url.searchParams.get('password') || 'admin123').trim()
  const name = (url.searchParams.get('name') || 'Admin User').trim()

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Password too short (min 6)' }, { status: 400 })
  }

  try {
    const pwHash = await hash(password, 12)
    await db.user.upsert({
      where: { email },
      update: { password: pwHash, role: 'admin', name },
      create: { email, name, password: pwHash, role: 'admin' },
    })
    return NextResponse.json({ ok: true, email })
  } catch (e) {
    console.error('Promote admin error:', e)
    return NextResponse.json({ ok: false, error: 'promote failed' }, { status: 500 })
  }
}

