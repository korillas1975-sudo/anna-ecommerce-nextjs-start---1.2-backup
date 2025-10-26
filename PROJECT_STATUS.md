# ANNA PARIS E-Commerce — Project Status

## Overview
This is the continuation of the Anna Paris e-commerce migration to Next.js. The core shopping experience is fully functional (browse → cart → checkout → order creation → admin management). Remaining work focuses on content, authentication UI, payments, and email.

## Completed Features

### Database & Backend
- Prisma schema with user, product, order, category and related models
- SQLite database for development
- Seed script with 50+ products across 5 categories
- CRUD API routes for products, categories, and orders

### Homepage
- Hero video section with luxury styling
- Featured Collections grid (database-driven)
- New Arrivals section (featured products)
- Categories showcase with scroll animations
- Craftsmanship section with image reveals
- Framer Motion animations throughout

### Product System
- Product listing connected to database
- Filters: category, price range, search
- Product detail pages with full information
- Image gallery with multiple photos
- Variant selection (size, color, material)
- Quantity picker and add to cart
- Related products by category
- Stock management

### Shopping Cart
- Persistent cart using Zustand (localStorage)
- Add/remove/update quantities
- Automatic subtotal calculation
- Free shipping threshold (configurable)
- Empty state with CTA
- Cart badge in header
- Cart clears after successful order

### Checkout Flow
- Multi-step (Shipping → Payment → Review)
- Form validation
- Order summary with all details
- Order creation via API (writes database records)
- Stock reduction on order
- Success page with order number and redirect

### User Account
- Account dashboard
- Order history with real data
- Order detail view
- Empty states for new users
- NextAuth configured (handlers in place)

### Admin Panel
- Dashboard with basic stats
- Product management: list, edit, delete, toggle published/featured
- Order management: list, detail view, update order status

### API Routes
- GET /api/products — list with filters
- GET /api/products/[slug] — single product with related
- PATCH /api/products/[id] — update product
- DELETE /api/products/[id] — delete product
- GET /api/categories — list categories
- POST /api/orders — create order
- GET /api/orders — get user orders
- GET /api/orders/[id] — get single order
- PATCH /api/orders/[id] — update order status
- GET /api/admin/orders — admin list of all orders
- POST /api/auth/register — create account
- NextAuth handlers for authentication

### Additional Pages
- About Us
- Contact
- Search
- Wishlist (local, with empty states)

### Design System
- "Quiet Luxury" aesthetic
- Custom color palette (Ink, Champagne, Platinum)
- Playfair Display (serif) + Lato (sans-serif)
- Mobile-first responsive design
- Tailwind CSS v4
- Consistent spacing and motion

## System Integration Status

### Fully Functional Flow
1. Browse database-driven catalog
2. View product details (variants, gallery)
3. Add to cart (persists across sessions)
4. Checkout (validated, multi-step)
5. Place order (DB record + stock reduction)
6. View order history
7. Admin manages products and orders

### Data Flow (Concept)
```
User → Frontend Component → API Route → Prisma → SQLite
Order Success → Success Page ← API Response ← Database
```

## What’s Ready To Test

### Customer Experience
1. Homepage shows real products from DB
2. Category filtering and search
3. Product detail with variants and gallery
4. Cart persists on reload/close
5. Checkout creates real orders in DB
6. Order history displays previous orders

### Admin Experience
1. /admin dashboard
2. Manage products: edit, delete, toggle flags
3. View all orders
4. Update order status
5. Inspect order details (customer, items, shipping)

## Technical Status

### Working
- Database seeded with 50+ products
- All API routes functional
- Frontend ↔ backend integration
- State persistence and form validation
- Error, loading, and empty states
- Responsive design and image optimization

### Needs Attention
- TypeScript: replace any with proper interfaces (non-blocking)
- ESLint: clear minor warnings (unused vars)
- Authentication: login/register pages not built yet (NextAuth ready)
- Email: order confirmation emails not implemented
- Payments: Stripe wiring/UI not connected

## Production Readiness

### Ready Now
- End-to-end shopping flow
- Admin panel for products and orders
- Persistent cart
- Database-driven content
- Inventory tracking and order management

### Optional Enhancements
- Authentication UI pages (NextAuth configured)
- Stripe payment integration
- Email notifications (templates + provider)
- Product image uploads (replace placeholders)
- User reviews/ratings
- Advanced search (Algolia)
- Analytics

## Database Contents (after `npm run seed`)
- 5 categories: Necklaces, Earrings, Rings, Bracelets, Brooches
- 50+ products with realistic data
  - Price range and stock levels per item
  - Multiple images per product
  - Descriptions and tags (bestseller, new-arrival, limited-edition)
- 1 demo order for validation

## Commands

Windows (PowerShell):
```powershell
npm install
npm run dev

# Seed database
npm run seed

# Reset local dev database (if needed)
Remove-Item prisma/dev.db -ErrorAction SilentlyContinue
npx prisma db push
npm run seed

# Inspect DB
npx prisma studio
```
 
---

## Progress Update (2025-10-24)

- Admin Access & Auth
  - Guard all `/admin/*` pages (role=`admin` required); login UI at `/auth/login` (NextAuth Credentials).
  - Global admin top bar on all admin pages: Dark/Light toggle + Sign out.
- Admin Dashboard
  - New metrics API `/api/admin/metrics` (orders, products, customers, revenue);
  - `/admin` reads live metrics and supports date range filters.
- Orders
  - List filters (query/status/date-range) + CSV export `/api/admin/orders/export`.
  - Order detail supports internal notes (timeline) and status updates.
- Products
  - Price display unified to `THB {value.toLocaleString()}` in admin list/detail.
- Data model & APIs
  - Create order now persists `shippingAddress` via relation (`shippingAddressId`) to match Prisma; reads via include on admin/user endpoints.
  - Admin APIs enforce role=admin (403 when not authorized).
- Home page
  - Content fetch switched to a relative path; Overlap collection layout left intact.

### Next Up
- Customers 360 (list/detail/CSV), product bulk actions, saved views for orders, returns/refund skeleton.
- Stripe (test) + webhooks; order emails; replace placeholder images; finalize TH/EN content.

macOS/Linux (bash):
```bash
npm install
npm run dev

# Seed database
npm run seed

# Reset local dev database (if needed)
rm -f prisma/dev.db
npx prisma db push
npm run seed

# Inspect DB
npx prisma studio
```

## Key Pages
1. Homepage: http://localhost:3000/
2. Products: http://localhost:3000/products
3. Product Detail: click any product
4. Cart: http://localhost:3000/cart
5. Checkout: add items then proceed
6. Orders: http://localhost:3000/account/orders
7. Admin: http://localhost:3000/admin
8. Admin Products: http://localhost:3000/admin/products
9. Admin Orders: http://localhost:3000/admin/orders

## Next Actions
- Finalize TH/EN copy and imagery (see `docs/content-placeholders.md`)
- Replace seed images with studio photos (or hook production DB)
- Build login/register pages and hook to NextAuth
- Connect Stripe checkout/payment UI
- Implement order confirmation emails

## Roadmap (TH)

### ระบบผู้ใช้ & สิทธิ์
- เปิดใช้ NextAuth ที่เตรียมไว้ เพิ่มหน้า Login/Admin role
- Guard หน้ากลุ่ม /admin ให้เฉพาะ role admin เข้าได้

### เชื่อมฐานข้อมูลจริง
- ตอนนี้ทุกอย่างอ่าน/เขียน SQLite demo (prisma/dev.db). เปลี่ยนเป็นฐานข้อมูลขององค์กร (เช่น Postgres/MySQL)
- ล้าง warning ใน prisma/seed.ts หรือสร้าง seed จากข้อมูลจริง
- เชื่อมต่อเอกสารขององค์กร (เช่น ERP/CRM) ผ่าน API หรือ job เพื่อ record order/customer history

### ฟีเจอร์แอดมินที่ต้องเติม
- Customers, Content, Settings ยังเป็น placeholder: สร้างหน้า + API
- เพิ่มกราฟ/รายงานจริง, export CSV, ระบบค้นหา/กรองคำสั่งซื้อ
- เพิ่ม comment / timeline ต่อ order เพื่อให้ทีมบริการลูกค้าติดตามง่าย
- รองรับการขอคืนสินค้า เปลี่ยนสถานะหลายกรณี

### สโตร์หน้าบ้าน
- Wishlist เก็บใน local state: เชื่อมกับบัญชีลูกค้า & CRM
- Checkout ยังเป็น demo; ต้องต่อ Payment gateway (เช่น Stripe) + update stock/ส่งอีเมล
- หน้า Account สนับสนุนการแก้ที่อยู่/ติดตามพัสดุ

### เอกสารการใช้งาน
- อัปเดต PROJECT_STATUS.md และ docs/content-placeholders.md เมื่อมีข้อมูลจริง
- สร้าง SOP สำหรับทีม (เช่น วิธีตรวจ order, วิธีแก้สินค้า)
