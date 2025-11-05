# Handoff — Anna Paris E-Commerce

Latest update: 2025-11-02

## 1. Context & Environment
- **Production host:** AWS Amplify → https://master.dcoyi3vhn16cz.amplifyapp.com/
- **Database:** Neon PostgreSQL (pooler connection) — use `prisma db push` during deploy
- **Runtime secrets:** managed via Amplify Secrets/Environment variables. Required keys:
  - `PRISMA_SCHEMA=prisma/schema.postgres.prisma`
  - `DATABASE_URL` (Neon pooler URL with `sslmode=require&pgbouncer=true&connection_limit=1`)
  - `AUTH_SECRET` (same value also used for `NEXTAUTH_SECRET`)
  - `NEXTAUTH_URL=https://<final-domain>`
  - Optional feature flags: `SEED_TOKEN`, `REVIEWS_ENABLED`
- **Amplify preBuild commands** (see `DEPLOYMENT.md` for exact block):
  1. `npm ci`
  2. `npx prisma generate`
  3. Write `.env.production` with DATABASE_URL/AUTH_SECRET/NEXTAUTH_SECRET (and optional tokens)
  4. `npx prisma db push`
  5. Amplify then runs `npm run build`
- **Local dev:** SQLite (`prisma/dev.db`). Run `npx prisma generate` + `npx prisma db push` + `npm run dev`.

## 2. Security / Invariants (mandatory)
- All write/delete admin API routes must require `auth()` and `session.user.role === 'admin'`
- Orders API invariants: owner or admin for GET; admin only for PATCH
- Products API invariants: admin only for PATCH/DELETE
- Trust server-side totals for checkout; never use client totals
- Secrets from env only (never hard-code)
- CSP currently allows `'unsafe-inline'` (to keep UI working). Plan to migrate to nonce/strict-dynamic later.
- Seed/promote endpoints are temporary: remove or rotate `SEED_TOKEN` after use.

## 3. Recent Work (done)
- **Auth hardening:** `AUTH_SECRET` + `trustHost` (NextAuth) and admin login now stable
- **Stock safety:** order creation runs atomic `updateMany` to prevent overselling (`app/api/orders/route.ts`)
- **Sale Boost v1 (PDP):**
  - `components/products/ProductDetailClient.tsx`: value bullets, Save %, free-shipping note, low-stock badge, trust badges, FAQ, reviews preview
  - `app/products/[slug]/page.tsx`: Product JSON-LD for SEO
- **Reviews Phase 1:**
  - Prisma schema: added `Review` model, `Product.ratingAvg`, `Product.ratingCount`
  - `app/api/reviews/route.ts`: GET (paginated) + POST (pending, verified purchase check)
  - PDP shows latest reviews (read-only) and summary (no admin moderation yet)
- **Deployment doc:** `DEPLOYMENT.md` updated with current Amplify pipeline

## 4. Work in Progress / Next up
1. **Admin review moderation**
   - Create admin UI/API to approve/reject reviews
   - Update `ratingAvg`/`ratingCount` when status transitions to approved/rejected
   - Expose only approved reviews on PDP + JSON-LD (currently always returns ratingAvg even if zero)
2. **Cleanup temporary helpers**
   - Remove `/api/admin/promote` and `/api/admin/debug-credentials`
   - Rotate `SEED_TOKEN` (or remove) after cleanup
3. **Security hardening**
   - Apply rate limiting to `/api/admin/*`
   - Move CSP from `'unsafe-inline'` to nonce/strict-dynamic once inline scripts are handled
4. **Optional enhancements**
   - Featured reviews on Home
   - Expand FAQ/benefit copy once real content arrives
   - Prepare for 2FA / IP allowlist for admin access (policy decision)

## 5. Reference Files
- `AGENTS.md` — canonical work style + security rules
- `PROJECT_STATUS.md` — single source of truth for roadmap (update after every milestone)
- `CHANGELOG.md` — append newest changes (date + bullet)
- `DEPLOYMENT.md` — Amplify/Neon deployment checklist (updated)
- `components/products/ProductDetailClient.tsx` — PDP layout & sale components
- `app/api/reviews/route.ts` — Reviews API (Phase 1)

## 6. How to Continue (for next agent)
1. Read: `AGENTS.md`, `PROJECT_STATUS.md`, `CHANGELOG.md` (latest entries), `DEPLOYMENT.md`, and this `HANDOFF.md`
2. Confirm prod env values in Amplify Secrets (`DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_SECRET`, `REVIEWS_ENABLED`, `SEED_TOKEN` if still used)
3. Tackle tasks in **Next up** list (in order). Update `PROJECT_STATUS.md` and `CHANGELOG.md` when complete.
4. After removing helper endpoints, rotate `SEED_TOKEN` (or delete) and note change in `DEPLOYMENT.md`.

## 7. Quick facts
- Prod URL: https://master.dcoyi3vhn16cz.amplifyapp.com/
- Health check: `/api/health` (returns `{ ok: true }` when DB reachable)
- Admin login default (seeded): `test.admin@annaparis.com / TestAdmin123` (rotate or replace after moderation UI is ready)
- Feature flag: set `REVIEWS_ENABLED=false` to hide reviews entirely (API returns empty list)

Keep this document up-to-date whenever major decisions or handoffs occur.
