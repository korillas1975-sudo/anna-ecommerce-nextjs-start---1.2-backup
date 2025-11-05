# ANNA PARIS E‑Commerce — Project Status (Updated 2025‑11‑02)

## Overview
Core shopping flow is fully functional end‑to‑end (browse → cart → checkout → order create → admin management). Work now focuses on content/assets polish, production database, and additional QA/security hardening.

## Completed (since initial migration)
- Security
  - Admin/owner auth guards on sensitive endpoints (products PATCH/DELETE; orders GET/PATCH)
  - API input validation (zod) + rate limiting for key routes
  - Global security headers (CSP, Referrer‑Policy, X‑Frame‑Options, etc.)
- Payments & Emails
  - Stripe (Test Mode) integrated: Checkout Session + webhook to update order status
  - Order confirmation email on successful payment; “Order Shipped” email when admin sets status=shipped
- Admin
  - New read‑only pages: Customers and Content (wired to admin APIs)
  - Tables responsive on mobile (overflow‑x auto + min‑width)
- Auth/Login
  - Hardened NextAuth (`trustHost` + `AUTH_SECRET`) and ensured Amplify runtime secrets are written via `.env.production`
  - Added temporary admin helpers (seed/promote) for credential refresh while debugging login issues
- Catalog / PDP
  - Stock decrement is atomic (prevents overselling) inside `app/api/orders/route.ts`
  - Product detail “Sale Boost” (value bullets, Save %, free shipping note, low-stock warning, trust badges, FAQ, Product JSON-LD)
- Reviews (Phase 1)
  - Prisma schema adds `Review` model + `Product.ratingAvg`/`ratingCount`
  - `/api/reviews` GET/POST (POST creates pending review, verified purchase check)
  - PDP displays summary + latest reviews (read-only)
- Wishlist
  - Wishlist APIs (GET/POST/DELETE) and client sync on login (local ↔ server)
- SEO
  - OpenGraph/Twitter metadata, sitemap.xml, robots.txt; fixed metadata encoding in layout
  - Product JSON-LD added per PDP
- DB & CI
  - Prepared Postgres schema (`prisma/schema.postgres.prisma`) and CI workflow; prod uses `PRISMA_SCHEMA=prisma/schema.postgres.prisma`
  - Amplify pipeline uses `prisma db push` (compatible with Neon pooler) with runtime `.env.production`
  - Catalog
    - Align categories to six: necklaces, earrings, bracelets, rings, sets, others
    - Home category cards prefilter to `/products?category=<slug>`
    - ProductFilters reads `/api/categories` (slugs restricted to the six)
    - Admin Add/Edit dropdown uses the same six categories
    - Seed includes an “others” sample product so `/products?category=others` has results

## What’s Ready To Test
- Customer: catalog, filters/search, product detail (gallery/variants + sale enhancements), persistent cart, checkout (multi‑step), order history
- Admin: dashboard metrics, products (list/edit/delete), orders (list/detail/update), customers/content lists
- Payments: Stripe test checkout end‑to‑end, webhook status update, email confirmation
- Wishlist: local usage and sync after login
- Reviews: GET/POST (pending) via `/api/reviews`, PDP read-only display
- SEO: OpenGraph/Twitter preview, sitemap/robots, Product JSON-LD

## Next Up
- Reviews Phase 2: Admin moderation UI/API (approve/reject), update `ratingAvg`/`ratingCount`, only approved reviews in JSON-LD/homepage featured slot
- Security cleanup: remove helper endpoints (`/api/admin/promote`, `/api/admin/debug-credentials`), rotate `SEED_TOKEN`, add rate limiting to `/api/admin/*`
- Deployment hardening: move CSP away from `'unsafe-inline'` (nonce/strict-dynamic), evaluate 2FA/IP restrictions for admin access
- Product images: upload pipeline (S3/CDN) + “Add Product” admin page
- Content polish: replace placeholder copy/assets (TH/EN), finalize homepage content
- Quality: expand automated tests (orders create/Stripe/webhook/reviews), add analytics/error logging/monitoring
- DB ops: continue using `prisma db push` in Amplify; generate migrations locally when schema changes

## Key Pages
- Homepage: /
- Products: /products
- Cart: /cart
- Checkout: /checkout
- Account Orders: /account/orders
- Admin: /admin (Products, Orders, Customers, Content)

## Commands
- Dev: `npm run dev`
- Lint: `npm run lint`
- Test: `npm test`
- Prisma (dev SQLite): `npm run db:push`
- Prisma (prod Postgres): set `PRISMA_SCHEMA=prisma/schema.postgres.prisma`; run `npx prisma db push`
