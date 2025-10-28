# ANNA PARIS E‑Commerce — Project Status (Updated 2025‑10‑27)

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
- Wishlist
  - Wishlist APIs (GET/POST/DELETE) and client sync on login (local ↔ server)
- SEO
  - OpenGraph/Twitter metadata, sitemap.xml, robots.txt; fixed metadata encoding in layout
- DB & CI
  - Prepared Postgres schema (`prisma/schema.postgres.prisma`) and CI workflow; prod can use `PRISMA_SCHEMA=prisma/schema.postgres.prisma`
  - Catalog
    - Align categories to six: necklaces, earrings, bracelets, rings, sets, others
    - Home category cards prefilter to `/products?category=<slug>`
    - ProductFilters reads `/api/categories` (slugs restricted to the six)
    - Admin Add/Edit dropdown uses the same six categories
    - Seed includes an “others” sample product so `/products?category=others` has results

## What’s Ready To Test
- Customer: catalog, filters/search, product detail (gallery/variants), persistent cart, checkout (multi‑step), order history
- Admin: dashboard metrics, products (list/edit/delete), orders (list/detail/update), customers/content lists
- Payments: Stripe test checkout end‑to‑end, webhook status update, email confirmation
- Wishlist: local usage and sync after login
- SEO: OpenGraph/Twitter preview, sitemap/robots

## Next Up
- Product images: upload pipeline (S3/CDN) + “Add Product” admin page
- Content: replace placeholder images/copy (TH/EN), finalize homepage content
- Tests: expand coverage (orders create/Stripe/webhook), component smoke tests
- Analytics & monitoring: page analytics, error logging target
- Production DB: finalize Postgres and migrations in deployment (see DEPLOYMENT.md)

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
- Prisma (prod Postgres): set `PRISMA_SCHEMA=prisma/schema.postgres.prisma`; run `npx prisma migrate deploy`
