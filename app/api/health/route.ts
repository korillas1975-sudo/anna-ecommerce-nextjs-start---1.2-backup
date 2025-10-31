import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
try {
await db.$queryRawSELECT 1
return NextResponse.json({ ok: true })
} catch (e: any) {
const msg = e instanceof Error ? e.message : String(e)
const raw = process.env.DATABASE_URL || ''
let host = null
try {
const masked = raw.replace(/:\S+@/, '://***@')
host = new URL(raw).host
return NextResponse.json({ ok: false, error: msg, dbHost: host, dbUrlMasked: masked }, { status: 503 })
} catch {
return NextResponse.json({ ok: false, error: msg, dbHost: host, dbUrlMasked: raw ? 'set (masked)' : 'EMPTY' }, { status: 503 })
}
}
}

