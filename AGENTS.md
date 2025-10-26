# AGENTS.md — Anna Paris E‑Commerce (Master Guide for Agents)

Purpose: This file is the single, canonical guide for agents and tooling to understand this repository quickly without re‑scanning the entire codebase each session.

Read this first. Treat the docs referenced here as the source of truth.

## Project Brief (อ่านก่อนทุกแชต)
- โปรเจกต์นี้มีการปรับจาก “แผนงานหลัก” บางส่วน แต่ยังคง “หัวใจ” ของแผนเดิมไว้เสมอ ดังนั้นเมื่ออ่านแผน ให้ตรวจอัปเดตจากไฟล์ใน repo ตามที่อ้างอิงในเอกสารนี้เสมอ
- หน้าโฮมเพจแตกต่างจากแผนหลักและ “ยังไม่นิ่ง” อาจมีการเปลี่ยนอีกในอนาคต (อย่า lock ดีไซน์/โครงสร้างตายตัว)
- ข้อมูลจริง (รูป/ข้อความ/สินค้า) ยังไม่พร้อม เป้าหมายคือทำระบบฝั่งลูกค้าและแอดมิน (UI/UX + API/DB) ให้พร้อมใช้งานจริง ระดับ Production ก่อน แล้วจึงสลับมาใช้ข้อมูลจริงได้ทันที
- บทบาททีม: ผู้ประสานงาน (เจ้าของ repo) ไม่ได้เขียนโค้ดเองและจะส่งความต้องการ/โจทย์; เอเจนต์ (AI) ต้อง
  - แปลงความต้องการเป็นโค้ดตามหลักวิศวกรรมที่ใช้งานจริง (production‑grade)
  - ตรวจความสมบูรณ์/ความปลอดภัย เช็ค edge cases และป้องกันการล่ม
  - อธิบายสิ่งที่ทำอย่างกระชับ ชี้ไฟล์ที่แก้ พร้อมแนวทางทดสอบสั้น ๆ

## Canonical Sources
- Project status and plan: `PROJECT_STATUS.md` (single source of truth for status/roadmap)
- Content and asset checklist: `docs/content-placeholders.md`
- Design decisions (UI/UX/system): `DESIGN_DECISIONS.md`
- Setup and local run instructions: `SETUP.md` (setup only; no status)
- Change history (this repo): `CHANGELOG.md`

If a status appears elsewhere (e.g., in `SETUP.md`), prefer `PROJECT_STATUS.md`.

## Code Map (High Level)
- `app/` Next.js App Router pages and layouts
  - `app/api/*` Route Handlers (REST‑style endpoints)
  - `app/admin/*` Admin UI (guarded by role=admin)
  - `app/products/*` Product list/detail
  - `app/checkout/*`, `app/cart/*`, `app/account/*`
- `components/` UI components (client/server as appropriate)
- `lib/` client stores (`zustand`), utilities, auth (`lib/auth.ts`), db (`lib/db.ts`)
- `prisma/` Prisma schema, seed, and local dev database
- `public/` static assets and `assets/data/content.json`

## Security Invariants (Must Enforce)
These rules apply to all API changes. Do not merge code that violates them.
- All write/delete admin operations require `auth()` and `session.user.role === 'admin'`.
- Orders API:
  - `GET /api/orders/[id]`: allow owner (session.user.id === order.userId) or admin only.
  - `PATCH /api/orders/[id]`: admin only.
- Products API:
  - `PATCH /api/products/[slug]` and `DELETE /api/products/[slug]`: admin only.
- Validate and sanitize request bodies (e.g., with Zod) before touching the database.
- Never trust client totals for payment/order amounts; recompute server‑side.
- Environment secrets must come from env vars, not hard‑coded.

Quick reminder (recurring): ทุก PR/patch ที่แตะ endpoint เขียน/ลบ ต้องมี guard ตามข้อกำหนดนี้ และควรมี validation ที่ชัดเจน

## Data & Database
- Dev: Prisma with SQLite (file: `prisma/dev.db`).
- Prod: Use Postgres/MySQL with migrations; do not deploy SQLite.
- Env: `DATABASE_URL` controls the datasource. For local dev, use:
  - `DATABASE_URL="file:./prisma/dev.db"`
- Prisma config: `prisma.config.ts` and `prisma/schema.prisma`.

## Runbook (Local)
- Install: `npm install`
- Env: copy `.env.example` to `.env.local` (or `.env`) and fill values
- Prisma: `npx prisma generate` then `npx prisma db push`
- Seed (TypeScript): `npx ts-node prisma/seed.ts` (or install `ts-node` as a devDependency, or use `tsx`)
- Dev: `npm run dev`
- Build: `npm run build` then `npm start`

## Known Gaps (Track in PROJECT_STATUS.md)
- Harden API auth/authorization on product/order endpoints per Security Invariants.
- Migrate production DB to Postgres/MySQL and set up migrations pipeline.
- Normalize encoding issues in copy (garbled characters).
- Payments (Stripe) and emails (order notifications) are stubbed/not integrated.
- Finalize content and assets; add Open Graph images.

## Conventions for Future Changes
- Update status only in `PROJECT_STATUS.md`.
- Update setup/run instructions only in `SETUP.md`.
- Log repo‑level changes in `CHANGELOG.md`.
- If you add or change security‑sensitive endpoints, restate the guarantee in this file and enforce it in code.

## Quick Pointers
- Auth: `lib/auth.ts` (NextAuth v5, JWT + PrismaAdapter)
- DB client: `lib/db.ts`
- Core APIs: `app/api/products/*`, `app/api/orders/*`, `app/api/admin/*`, `app/api/auth/*`
- State: `lib/stores/*` (cart, wishlist, ui)
