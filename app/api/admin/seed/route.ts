import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hash } from 'bcryptjs'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

async function handle(request: Request) {
  // Simple token guard to allow one-time seeding without UI login
  const token = process.env.SEED_TOKEN?.trim()
  const provided = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    || new URL(request.url).searchParams.get('token')
  if (!token || !provided || provided !== token) return unauthorized()

  try {
    const existing = await db.product.count()
    if (existing > 0) {
      return NextResponse.json({ ok: true, skipped: true, reason: 'already seeded' })
    }

    // Users
    const adminPassword = await hash('admin123', 12)
    await db.user.upsert({
      where: { email: 'admin@annaparis.com' },
      update: {},
      create: { email: 'admin@annaparis.com', name: 'Admin User', password: adminPassword, role: 'admin' },
    })

    const customerPassword = await hash('customer123', 12)
    await db.user.upsert({
      where: { email: 'customer@example.com' },
      update: {},
      create: { email: 'customer@example.com', name: 'Anna Customer', password: customerPassword, role: 'customer' },
    })

    // Categories (six)
    const cats = [
      { slug: 'necklaces', name: 'Necklaces', sortOrder: 1 },
      { slug: 'earrings', name: 'Earrings', sortOrder: 2 },
      { slug: 'bracelets', name: 'Bracelets', sortOrder: 3 },
      { slug: 'rings', name: 'Rings', sortOrder: 4 },
      { slug: 'sets', name: 'Sets', sortOrder: 5 },
      { slug: 'others', name: 'Others', sortOrder: 6 },
    ]
    const created = [] as Array<{ id: string; slug: string }>
    for (const c of cats) {
      const rec = await db.category.upsert({ where: { slug: c.slug }, update: { name: c.name, sortOrder: c.sortOrder }, create: c })
      created.push({ id: rec.id, slug: rec.slug })
    }

    const getCat = (slug: string) => created.find((c) => c.slug === slug)!.id

    // Minimal sample products (enough for UI test)
    const prods = [
      { name: 'Classic Pearl Strand Necklace', slug: 'classic-pearl-strand-necklace', price: 12500, stock: 15, featured: true, categoryId: getCat('necklaces'), images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=85'] },
      { name: 'Diamond Solitaire Pendant', slug: 'diamond-solitaire-pendant', price: 28900, stock: 8, featured: true, categoryId: getCat('necklaces'), images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=85'] },
      { name: 'Pearl Drop Earrings', slug: 'pearl-drop-earrings', price: 8900, stock: 25, featured: true, categoryId: getCat('earrings'), images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=85'] },
      { name: 'Diamond Stud Earrings', slug: 'diamond-stud-earrings', price: 24500, stock: 18, featured: true, categoryId: getCat('earrings'), images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=85'] },
      { name: 'Pearl Tennis Bracelet', slug: 'pearl-tennis-bracelet', price: 16500, stock: 12, featured: true, categoryId: getCat('bracelets'), images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=85'] },
      { name: 'Engagement Diamond Ring', slug: 'engagement-diamond-ring', price: 52000, stock: 5, featured: true, categoryId: getCat('rings'), images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=85'] },
      { name: 'South Sea Pearl Necklace', slug: 'south-sea-pearl-necklace', price: 78000, stock: 3, featured: true, categoryId: getCat('sets'), images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=85'] },
      { name: 'Premium Jewelry Care Kit', slug: 'premium-jewelry-care-kit', price: 1900, stock: 40, featured: false, categoryId: getCat('others'), images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=85'] },
    ]

    for (const p of prods) {
      await db.product.upsert({
        where: { slug: p.slug },
        update: {},
        create: {
          name: p.name,
          slug: p.slug,
          description: 'Sample product for system testing',
          price: p.price,
          stock: p.stock,
          images: JSON.stringify(p.images),
          featured: p.featured,
          categoryId: p.categoryId,
          tags: JSON.stringify(['sample']),
        },
      })
    }

    return NextResponse.json({ ok: true, seeded: true })
  } catch (e) {
    console.error('Seed error:', e)
    return NextResponse.json({ ok: false, error: 'seed failed' }, { status: 500 })
  }
}

export async function POST(request: Request) { return handle(request) }
export async function GET(request: Request) { return handle(request) }
