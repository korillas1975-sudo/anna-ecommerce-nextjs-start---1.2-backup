import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Ensure canonical categories exist (Single Source of Truth)
    const canonical = [
      { slug: 'necklaces', name: 'Necklaces', sortOrder: 1 },
      { slug: 'earrings', name: 'Earrings', sortOrder: 2 },
      { slug: 'bracelets', name: 'Bracelets', sortOrder: 3 },
      { slug: 'rings', name: 'Rings', sortOrder: 4 },
      { slug: 'sets', name: 'Sets', sortOrder: 5 },
      { slug: 'others', name: 'Others', sortOrder: 6 },
    ] as const

    // Upsert missing categories so that UI/Admin filters are consistent without manual seeding
    await Promise.all(
      canonical.map((c) =>
        db.category.upsert({
          where: { slug: c.slug },
          update: { name: c.name, sortOrder: c.sortOrder },
          create: { slug: c.slug, name: c.name, sortOrder: c.sortOrder },
        })
      )
    )

    const categories = await db.category.findMany({
      where: { slug: { in: canonical.map((c) => c.slug) } },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
