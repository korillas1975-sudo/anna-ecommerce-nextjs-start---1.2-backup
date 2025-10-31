import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
try {
await db.$queryRawSELECT 1
return NextResponse.json({ ok: true })
} catch (e: any) {
const msg = e?.message || String(e)
const url = process.env.DATABASE_URL || ''
let masked = url ? url.replace(/:\S+@/, '://***@') : 'EMPTY'
let host = ''
try { host = url ? new URL(url).host : '' } catch {}
return NextResponse.json({ ok: false, error: msg, dbHost: host, dbUrlMasked: masked }, { status: 503 })
}
}

