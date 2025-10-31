import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Light check: simple query depending on provider
    await db.$queryRaw`SELECT 1` as unknown
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Health check failed:', e)
    return NextResponse.json({ ok: false, error: 'DB unreachable' }, { status: 503 })
  }
}

