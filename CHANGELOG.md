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
