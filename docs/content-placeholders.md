# Content & Placeholder Checklist

This checklist tracks all temporary copy, demo imagery, and stubbed data that must be replaced before launch. It is the continuation of the Anna Paris project work and focuses on content polish and asset swaps.

## Homepage
- [ ] Hero/brand story copy comes from `public/assets/data/content.json`. Provide final Thai and English copy for: `heroHeadline`, `heroSubhead`, `brandStory`, `craftsmanship`, `loyalty`.
- [ ] Featured Collections imagery in `components/home-v2/FeaturedCollections.tsx` uses placeholder URLs. Replace with brand product/lifestyle assets.
- [ ] Categories section currently uses gradient placeholders. Switch to final collection imagery or category-specific artwork.
- [ ] Testimonials in `components/Testimonials.tsx` are dummy. Provide approved client quotes, names, and roles.
- [ ] Instagram gallery in `components/InstagramGallery.tsx` uses seeded/public images. Provide curated brand images or connect to your social feed.

## Product Catalogue
- [ ] Product photography: `prisma/seed.ts` references stock images. Replace with studio shots (final filenames/paths) or import from your source of truth.
- [ ] Descriptions, materials, and variants are placeholders. Finalize size/material/variant data. Update via `prisma/seed.ts` or a CMS/data import.
- [ ] Pricing currency: confirm THB display (e.g., THB 3,000) and formatting across listing/detail/cart.
- [ ] SKU codes and inventory levels: add real SKUs and verify stock per variant.
- [ ] SEO: provide product `title` and `description` for search and sharing.

## Content Pages
- [ ] About page (`app/about/page.tsx`): provide bilingual copy and brand story highlights.
- [ ] Contact page (`app/contact/page.tsx`): confirm address, business hours, contact channels, and Thai/English labels.
- [ ] Newsletter CTA (`components/Newsletter.tsx`): replace generic success text with brand-approved messaging.

## Wishlist & Account
- [ ] Wishlist: currently local only. When authentication/CRM is enabled, connect wishlist to user accounts and marketing workflows.
- [ ] Account orders page: once sign-in is enabled, verify `/api/orders` returns user-specific history with correct statuses.

## Visual Assets
- [ ] Logo: current file `public/assets/img/logo-anna-paris.png`. Provide vector/SVG for scalable use and swap in header/footer.
- [ ] Icons: lucide-react is used as a placeholder set. Decide to keep or replace with a custom icon set.
- [ ] Favicon and app icons: replace `app/favicon.ico` and provide high-res app icons as needed.

## SEO & Social
- [ ] Global metadata: update `app/layout.tsx` `metadata` (title, description, Open Graph, Twitter).
- [ ] Social share image: add/update `public/og-image.png` (1200x630) and verify routes pick it up.

## Order of Operations
1. Update JSON copy in `public/assets/data/content.json` with final TH/EN text.
2. Replace imagery in components and `public/assets/...` with production assets.
3. Update product data in `prisma/seed.ts` (or switch to production database/import).
4. Re-seed and test end-to-end.

### Commands
```bash
# Install and run (common)
npm install
npm run dev

# Seed database (common)
npm run seed
```

Windows (PowerShell):
```powershell
# Reset local dev database
Remove-Item prisma/dev.db -ErrorAction SilentlyContinue
npx prisma db push
npm run seed
npx prisma studio
```

macOS/Linux (bash):
```bash
rm -f prisma/dev.db
npx prisma db push
npm run seed
npx prisma studio
```

Maintaining this list ensures no placeholder content reaches production.

---

## Progress Update (2025-10-24)

What’s been implemented (without touching the home layout):
- Admin access and security
  - Guard on all /admin/* pages (role=dmin required).
  - Login page at /auth/login (NextAuth Credentials). Session wired via a global SessionProvider.
  - Global admin top bar: Dark/Light toggle + Sign out.
- Admin Dashboard
  - Real metrics API: /api/admin/metrics (orders, products, customers, revenue) with date filters.
  - Dashboard at /admin now reads live numbers + supports date range.
- Orders
  - List filters: query, status, date range + CSV export endpoint (/api/admin/orders/export).
  - Order detail: Internal notes (timeline) + status update.
- Products
  - Price formatting unified to THB {value.toLocaleString()}.

Placeholders that still need real content/assets remain unchanged (see checklists above).

Next near-term content swaps (no structural changes):
- Replace Unsplash assets in public/assets/data/content.json with production images/CDN.
- Provide final TH/EN copy for homepage sections; update content.json in one pass.
- Confirm sitemap/meta images; add public/og-image.png.

Notes for QA:
- Use /auth/login with the seeded admin (dmin@annaparis.com / dmin123).
- For a clean session test: use a Private/Incognito window; guard should redirect /admin → /auth/login when not signed in.
