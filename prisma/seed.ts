import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('ðŸŒ± Starting seed...')

  // Create Admin User
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@annaparis.com' },
    update: {},
    create: {
      email: 'admin@annaparis.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin',
    },
  })
  console.log('âœ… Admin user created')

  // Create Demo Customer
  const customerPassword = await hash('customer123', 12)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'Anna Customer',
      password: customerPassword,
      role: 'customer',
    },
  })
  console.log('âœ… Demo customer created')

  // Create Categories
  const categories = [
    {
      name: 'Necklaces',
      slug: 'necklaces',
      description: 'Elegant pearl and diamond necklaces',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&fit=crop&q=85',
      sortOrder: 1,
    },
    {
      name: 'Earrings',
      slug: 'earrings',
      description: 'Timeless earrings for every occasion',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&fit=crop&q=85',
      sortOrder: 2,
    },
    {
      name: 'Bracelets',
      slug: 'bracelets',
      description: 'Sophisticated bracelets and bangles',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&fit=crop&q=85',
      sortOrder: 3,
    },
    {
      name: 'Rings',
      slug: 'rings',
      description: 'Exquisite rings for special moments',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&fit=crop&q=85',
      sortOrder: 4,
    },
    {
      name: 'Sets',
      slug: 'sets',
      description: 'Curated jewelry sets and matching pieces',
      image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&fit=crop&q=85',
      sortOrder: 5,
    },
    {
      name: 'Others',
      slug: 'others',
      description: 'Accessories and miscellaneous jewelry items',
      image: 'https://images.unsplash.com/photo-1612810806695-30f7a8258391?w=800&fit=crop&q=85',
      sortOrder: 6,
    },
  ]

  const createdCategories = []
  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    createdCategories.push(category)
  }
  console.log('âœ… Categories created')

  // Data mapping: migrate legacy 'bridal' category to 'sets'
  try {
    const legacyBridal = await prisma.category.findUnique({ where: { slug: 'bridal' } })
    const setsCategory = createdCategories.find((c) => c.slug === 'sets')
    if (legacyBridal && setsCategory) {
      const moved = await prisma.product.updateMany({
        where: { categoryId: legacyBridal.id },
        data: { categoryId: setsCategory.id },
      })
      await prisma.category.delete({ where: { id: legacyBridal.id } }).catch(() => null)
      console.log(`Migrated ${moved.count} products from 'bridal' to 'sets' and removed legacy category`)
    }
  } catch (e) {
    console.warn('Data mapping (bridal->sets) skipped:', e)
  }

  // Create Products
  const products = [
    // Necklaces (15 products)
    {
      name: 'Classic Pearl Strand Necklace',
      slug: 'classic-pearl-strand-necklace',
      description: 'A timeless strand of lustrous pearls, perfect for any occasion. Hand-selected premium pearls with sterling silver clasp.',
      price: 12500,
      compareAtPrice: 15000,
      sku: 'NECK-001',
      stock: 15,
      images: JSON.stringify(['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&fit=crop&q=85']),
      featured: true,
      categoryId: createdCategories[0].id,
      tags: JSON.stringify(['bestseller', 'classic', 'pearls']),
      details: JSON.stringify({ material: '925 Sterling Silver', pearlType: 'Freshwater', length: '18 inches' }),
    },
    {
      name: 'Diamond Solitaire Pendant',
      slug: 'diamond-solitaire-pendant',
      description: 'Elegant solitaire diamond pendant in 18K white gold. A perfect statement of refined luxury.',
      price: 28900,
      compareAtPrice: 35000,
      sku: 'NECK-002',
      stock: 8,
      images: JSON.stringify(['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&fit=crop&q=85']),
      featured: true,
      categoryId: createdCategories[0].id,
      tags: JSON.stringify(['luxury', 'diamond', 'gold']),
      details: JSON.stringify({ material: '18K White Gold', stone: '0.5ct Diamond', chainLength: '16 inches' }),
    },
    {
      name: 'Baroque Pearl Necklace',
      slug: 'baroque-pearl-necklace',
      description: 'Unique baroque pearls create an organic, contemporary design. Each piece is one-of-a-kind.',
      price: 15800,
      stock: 12,
      sku: 'NECK-003',
      images: JSON.stringify(['https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&fit=crop&q=85']),
      categoryId: createdCategories[0].id,
      tags: JSON.stringify(['modern', 'baroque', 'unique']),
      details: JSON.stringify({ material: '14K Gold', pearlType: 'Baroque Freshwater', length: '20 inches' }),
    },
    {
      name: 'Layered Gold Chain Necklace',
      slug: 'layered-gold-chain-necklace',
      description: 'Delicate layered chains in 14K gold create effortless elegance.',
      price: 18500,
      stock: 20,
      sku: 'NECK-004',
      images: JSON.stringify(['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&fit=crop&q=85']),
      categoryId: createdCategories[0].id,
      tags: JSON.stringify(['minimalist', 'gold', 'layered']),
    },
    {
      name: 'South Sea Pearl Necklace',
      slug: 'south-sea-pearl-necklace',
      description: 'Luxurious South Sea pearls known for their exceptional luster and size.',
      price: 45000,
      compareAtPrice: 52000,
      stock: 5,
      sku: 'NECK-005',
      images: JSON.stringify(['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&fit=crop&q=85']),
      featured: true,
      categoryId: createdCategories[0].id,
      tags: JSON.stringify(['luxury', 'south-sea', 'premium']),
      details: JSON.stringify({ material: '18K Gold', pearlType: 'South Sea', size: '10-12mm' }),
    },

    // Earrings (15 products)
    {
      name: 'Pearl Drop Earrings',
      slug: 'pearl-drop-earrings',
      description: 'Classic drop earrings featuring lustrous freshwater pearls.',
      price: 8900,
      stock: 25,
      sku: 'EAR-001',
      images: JSON.stringify(['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&fit=crop&q=85']),
      featured: true,
      categoryId: createdCategories[1].id,
      tags: JSON.stringify(['bestseller', 'pearls', 'elegant']),
      details: JSON.stringify({ material: '925 Sterling Silver', pearlType: 'Freshwater', length: '1.5 inches' }),
    },
    {
      name: 'Diamond Stud Earrings',
      slug: 'diamond-stud-earrings',
      description: 'Timeless diamond studs in 18K white gold. Perfect for everyday luxury.',
      price: 24500,
      compareAtPrice: 28000,
      stock: 18,
      sku: 'EAR-002',
      images: JSON.stringify(['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&fit=crop&q=85']),
      featured: true,
      categoryId: createdCategories[1].id,
      tags: JSON.stringify(['classic', 'diamond', 'everyday']),
      details: JSON.stringify({ material: '18K White Gold', stone: '0.75ct Total Diamond' }),
    },
    {
      name: 'Hoop Earrings with Pearls',
      slug: 'hoop-earrings-pearls',
      description: 'Modern hoops adorned with delicate pearls.',
      price: 12800,
      stock: 15,
      sku: 'EAR-003',
      images: JSON.stringify(['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&fit=crop&q=85']),
      categoryId: createdCategories[1].id,
      tags: JSON.stringify(['modern', 'hoops', 'pearls']),
    },
    {
      name: 'Baroque Pearl Studs',
      slug: 'baroque-pearl-studs',
      description: 'Unique baroque pearl studs, each pair one-of-a-kind.',
      price: 6500,
      stock: 30,
      sku: 'EAR-004',
      images: JSON.stringify(['https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&fit=crop&q=85']),
      categoryId: createdCategories[1].id,
      tags: JSON.stringify(['unique', 'baroque', 'minimalist']),
    },
    {
      name: 'Chandelier Pearl Earrings',
      slug: 'chandelier-pearl-earrings',
      description: 'Statement chandelier earrings with cascading pearls.',
      price: 18900,
      stock: 10,
      sku: 'EAR-005',
      images: JSON.stringify(['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&fit=crop&q=85']),
      categoryId: createdCategories[1].id,
      tags: JSON.stringify(['statement', 'evening', 'luxury']),
    },

    // Bracelets (10 products)
    {
      name: 'Pearl Tennis Bracelet',
      slug: 'pearl-tennis-bracelet',
      description: 'Elegant tennis bracelet featuring perfectly matched pearls.',
      price: 16500,
      stock: 12,
      sku: 'BRAC-001',
      images: JSON.stringify(['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&fit=crop&q=85']),
      featured: true,
      categoryId: createdCategories[2].id,
      tags: JSON.stringify(['classic', 'tennis', 'pearls']),
      details: JSON.stringify({ material: '925 Sterling Silver', pearlCount: 40, length: '7 inches' }),
    },
    {
      name: 'Gold Chain Bracelet',
      slug: 'gold-chain-bracelet',
      description: 'Delicate 14K gold chain bracelet with subtle elegance.',
      price: 9800,
      stock: 22,
      sku: 'BRAC-002',
      images: JSON.stringify(['https://images.unsplash.com/photo-1612810806695-30f7a8258391?w=800&fit=crop&q=85']),
      categoryId: createdCategories[2].id,
      tags: JSON.stringify(['minimalist', 'gold', 'everyday']),
    },
    {
      name: 'Diamond Bangle',
      slug: 'diamond-bangle',
      description: 'Luxurious bangle set with brilliant diamonds.',
      price: 35000,
      compareAtPrice: 42000,
      stock: 6,
      sku: 'BRAC-003',
      images: JSON.stringify(['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&fit=crop&q=85']),
      categoryId: createdCategories[2].id,
      tags: JSON.stringify(['luxury', 'diamond', 'statement']),
    },
    {
      name: 'Charm Bracelet',
      slug: 'charm-bracelet',
      description: 'Customizable charm bracelet in sterling silver.',
      price: 7500,
      stock: 18,
      sku: 'BRAC-004',
      images: JSON.stringify(['https://images.unsplash.com/photo-1612810806695-30f7a8258391?w=800&fit=crop&q=85']),
      categoryId: createdCategories[2].id,
      tags: JSON.stringify(['charm', 'customizable', 'silver']),
    },
    {
      name: 'Pearl Strand Bracelet',
      slug: 'pearl-strand-bracelet',
      description: 'Classic pearl strand bracelet with gold clasp.',
      price: 11200,
      stock: 14,
      sku: 'BRAC-005',
      images: JSON.stringify(['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&fit=crop&q=85']),
      categoryId: createdCategories[2].id,
      tags: JSON.stringify(['classic', 'pearls', 'elegant']),
    },

    // Rings (10 products)
    {
      name: 'Solitaire Diamond Ring',
      slug: 'solitaire-diamond-ring',
      description: 'Classic solitaire engagement ring with brilliant cut diamond.',
      price: 45000,
      compareAtPrice: 52000,
      stock: 8,
      sku: 'RING-001',
      images: JSON.stringify(['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&fit=crop&q=85']),
      featured: true,
      categoryId: createdCategories[3].id,
      tags: JSON.stringify(['engagement', 'diamond', 'solitaire']),
      details: JSON.stringify({ material: '18K White Gold', stone: '1.0ct Diamond', size: 'Various sizes available' }),
      variants: JSON.stringify([
        { size: '5', inStock: true },
        { size: '6', inStock: true },
        { size: '7', inStock: true },
        { size: '8', inStock: false },
      ]),
    },
    {
      name: 'Pearl Ring',
      slug: 'pearl-ring',
      description: 'Elegant ring featuring a lustrous pearl center stone.',
      price: 8900,
      stock: 20,
      sku: 'RING-002',
      images: JSON.stringify(['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&fit=crop&q=85']),
      categoryId: createdCategories[3].id,
      tags: JSON.stringify(['pearl', 'elegant', 'cocktail']),
    },
    {
      name: 'Eternity Band',
      slug: 'eternity-band',
      description: 'Diamond eternity band symbolizing endless love.',
      price: 28500,
      stock: 12,
      sku: 'RING-003',
      images: JSON.stringify(['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&fit=crop&q=85']),
      categoryId: createdCategories[3].id,
      tags: JSON.stringify(['wedding', 'diamond', 'eternity']),
    },
    {
      name: 'Stackable Ring Set',
      slug: 'stackable-ring-set',
      description: 'Three delicate stackable rings in mixed metals.',
      price: 12500,
      stock: 18,
      sku: 'RING-004',
      images: JSON.stringify(['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&fit=crop&q=85']),
      categoryId: createdCategories[3].id,
      tags: JSON.stringify(['stackable', 'minimalist', 'modern']),
    },
    {
      name: 'Statement Cocktail Ring',
      slug: 'statement-cocktail-ring',
      description: 'Bold cocktail ring with colored gemstone.',
      price: 18900,
      stock: 10,
      sku: 'RING-005',
      images: JSON.stringify(['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&fit=crop&q=85']),
      categoryId: createdCategories[3].id,
      tags: JSON.stringify(['statement', 'cocktail', 'gemstone']),
    },

    // Sets (10 products)
    {
      name: 'Bridal Pearl Set',
      slug: 'bridal-pearl-set',
      description: 'Complete bridal set with necklace and earrings.',
      price: 32000,
      compareAtPrice: 38000,
      stock: 10,
      sku: 'BRID-001',
      images: JSON.stringify(['https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&fit=crop&q=85']),
      featured: true,
      categoryId: createdCategories[4].id,
      tags: JSON.stringify(['bridal', 'set', 'pearls']),
      details: JSON.stringify({ includes: 'Necklace + Earrings', material: '925 Sterling Silver' }),
    },
    {
      name: 'Diamond Bridal Tiara',
      slug: 'diamond-bridal-tiara',
      description: 'Exquisite bridal tiara adorned with diamonds.',
      price: 58000,
      stock: 3,
      sku: 'BRID-002',
      images: JSON.stringify(['https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&fit=crop&q=85']),
      categoryId: createdCategories[4].id,
      tags: JSON.stringify(['tiara', 'luxury', 'diamond']),
    },
    {
      name: 'Bridal Hair Pins',
      slug: 'bridal-hair-pins',
      description: 'Set of pearl and crystal hair pins.',
      price: 4500,
      stock: 25,
      sku: 'BRID-003',
      images: JSON.stringify(['https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&fit=crop&q=85']),
      categoryId: createdCategories[4].id,
      tags: JSON.stringify(['hair-accessory', 'pearls', 'set']),
    },
    {
      name: 'Wedding Band Diamond',
      slug: 'wedding-band-diamond',
      description: 'Classic diamond wedding band.',
      price: 22000,
      stock: 15,
      sku: 'BRID-004',
      images: JSON.stringify(['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&fit=crop&q=85']),
      categoryId: createdCategories[4].id,
      tags: JSON.stringify(['wedding-band', 'diamond', 'classic']),
    },
    {
      name: 'Bridal Bracelet',
      slug: 'bridal-bracelet',
      description: 'Delicate bracelet perfect for brides.',
      price: 14800,
      stock: 12,
      sku: 'BRID-005',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1500&h=1875&fit=crop&q=85',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1500&h=1875&fit=crop&q=85&crop=focalpoint&fp-x=0.3&fp-y=0.35',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1500&h=1875&fit=crop&q=85&crop=focalpoint&fp-x=0.7&fp-y=0.4',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1500&h=1875&fit=crop&q=85&crop=focalpoint&fp-x=0.5&fp-y=0.2',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1500&h=1875&fit=crop&q=85&crop=edges',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1500&h=1875&fit=crop&q=85&sat=-15',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1500&h=1875&fit=crop&q=85&blur=5&sharp=5',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1500&h=1875&fit=crop&q=85&exp=5'
      ]),
      categoryId: createdCategories[4].id,
      tags: JSON.stringify(['bridal', 'bracelet', 'elegant']),
    },

    // Others (at least 1 product)
    {
      name: 'Premium Jewelry Care Kit',
      slug: 'premium-jewelry-care-kit',
      description: 'Keep your pieces pristine: cleaning solution, soft cloth, and brush.',
      price: 1500,
      stock: 50,
      sku: 'OTH-001',
      images: JSON.stringify(['https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&fit=crop&q=85']),
      categoryId: createdCategories[5].id,
      tags: JSON.stringify(['care', 'accessory']),
    },
  ]

  const createdProducts = []
  for (const prod of products) {
    const product = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
    })
    createdProducts.push(product)
  }
  console.log(`âœ… ${products.length} Products created`)

  // Create demo order for customer
  const demoOrder = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2025-0001',
      userId: customer.id,
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      subtotal: 21400,
      shipping: 0,
      tax: 1498,
      total: 22898,
      items: {
        create: [
          {
            productId: createdProducts[0].id,
            quantity: 1,
            price: 12500,
            productName: 'Classic Pearl Strand Necklace',
            productImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&fit=crop&q=85',
          },
          {
            productId: createdProducts[5].id,
            quantity: 1,
            price: 8900,
            productName: 'Pearl Drop Earrings',
            productImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&fit=crop&q=85',
          },
        ],
      },
    },
  })
  console.log('âœ… Demo order created')

  console.log('âœ¨ Seed completed successfully!')
  console.log('')
  console.log('ðŸ“§ Admin Login:')
  console.log('   Email: admin@annaparis.com')
  console.log('   Password: admin123')
  console.log('')
  console.log('ðŸ“§ Customer Login:')
  console.log('   Email: customer@example.com')
  console.log('   Password: customer123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

