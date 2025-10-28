# Changelog

All notable changes to this repository will be documented in this file.

## 2025-10-26
- Add `AGENTS.md` as the master agent guide (code map, security invariants, canonical docs).
- Standardize `SETUP.md` to be setup-only and point status to `PROJECT_STATUS.md`.
- Add `.env.example` with correct local defaults (`DATABASE_URL="file:./prisma/dev.db"`, NextAuth keys, optional Google/Stripe).
- Establish `PROJECT_STATUS.md` as the single source of truth for project status; move progress out of setup docs.

## 2025-10-27
- Secure `app/api/products/[slug]/route.ts` by requiring authenticated admins for PATCH/DELETE.
- Secure `app/api/orders/[id]/route.ts` by requiring the order owner (same `userId`) or an admin for GET, and admin-only for PATCH; include shipping address in PATCH response.
 - Add API input validation and rate limiting:
   - Add `lib/validation.ts` (zod schemas) and `lib/rate-limit.ts` (in-memory limiter).
   - `POST /api/auth/register` — rate limit (5/10min per IP).
   - `POST /api/orders` — rate limit (10/min per IP).
   - `PATCH /api/orders/[id]` — validate `status` via schema.
   - `PATCH /api/products/[slug]` — validate payload via schema.
   - `POST /api/admin/orders/[id]/notes` — validate `message` + rate limit (60/hour per IP).

### Stripe Test Mode (initial integration)
- Add POST /api/payments/stripe/create-session to create Stripe Checkout Sessions using order data (THB).
- Add POST /api/webhooks/stripe to update order payment status on checkout.session.completed.
- Update pp/checkout/page.tsx to start Stripe flow for credit card method and keep local flow for others.
- Update .env.example with STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET placeholders.

- Admin tables: wrap in overflow-x-auto with min-w to ensure mobile usability (products, orders).

- Admin: add /admin/customers and /admin/content pages with read-only lists and corresponding API routes (admin-guarded).

- Wishlist: add API (GET/POST/DELETE) + client sync on login; store now syncs local items to server and pulls remote list.

- SEO: add metadata (OG/Twitter), sitemap and robots; fix root layout title/description encodings.

- Emails: add nodemailer mailer + order confirmation template; send on Stripe checkout.session.completed (best-effort).
Update .env.example with SMTP settings.

- Security: add global security headers (CSP/referrer-policy/etc.) via next.config; add request-id middleware; add error.tsx and global-error.tsx for user-friendly errors.

- Tests: add Vitest with tests for auth guards (orders), admin-only product patch validation, and security headers.

- Emails: send 'Order Shipped' email when admin sets status=shipped (best-effort).

- Tests: add email.orderShipped test (mocks sendMail) to verify email sent only when status=shipped.

- Admin: add Add Product page with S3 presigned uploads; add admin products POST API; add S3 presign API; next.config supports S3 domain via env.

## 2025-10-28
- Align categories to six: `necklaces`, `earrings`, `bracelets`, `rings`, `sets`, `others` across Home/Products/Admin.
- Home category cards now prefilter to `/products?category=<slug>` (already wired via `CategoriesV2GSAP`).
- ProductFilters continues to use `/api/categories`; API now restricts slugs to the six and orders by `sortOrder`.
- Admin Add/Edit forms fetch categories from `/api/categories`, ensuring the same six options.
- Seed updated: categories set to the six with `sortOrder` 1–6; added an example product under `others` so `/products?category=others` has results.
- Product detail page: modern image UX improvements
  - Main image responsive `sizes` and desktop hover zoom (1.75x) with transform-origin.
  - Lightbox now requests hi‑res via `getHiResUrl` (≥2000px when available).
  - Thumbnail alt/size improvements; fix THB currency rendering and quantity controls.
  - Preload neighbor images via `window.Image` to avoid `next/image` name clash.
- Build/runtime: move `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` to dependencies; add Vitest alias via `vite.config.ts`.
