import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Read‑only categories endpoint for production safety.
// Seeding/creation must happen in migrations/seed, not here.
export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: true } } },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    // Fail safe: never crash the app — return empty list
    return NextResponse.json([], { status: 200 })
  }
}
