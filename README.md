# ANNA PARIS — Quiet Luxury E‑Commerce

**Next.js 15 • App Router • React 19 • TypeScript • Tailwind v4 • Prisma • NextAuth • Stripe (Test Mode)**

Migrated from vanilla HTML/CSS/JS to a modern Next.js stack while preserving the original UI/UX and hardening for production.

---

## Tech Stack
- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS v4, Framer Motion, GSAP
- Prisma ORM (SQLite for dev, Postgres for prod)
- NextAuth v5 (JWT + Prisma Adapter)
- Zustand (localStorage persistence)
- Stripe (Test Mode) + Webhooks

---

## Features
- Hero with video background + parallax
- Quiet Luxury design system; mobile‑first responsive
- Search overlay (Cmd/Ctrl+K), cart sidebar, wishlist
- Product listing, filters/search, detail with gallery
- Checkout (Shipping → Payment → Review), stock updates
- Admin dashboard, products, orders, customers, content
- SEO (OG/Twitter), sitemap.xml, robots.txt
- Security headers (CSP, referrer‑policy, etc.)

---

## Project Structure
```
app/                # App Router pages, API routes
components/         # UI components
lib/                # Auth, DB, state, utils, email
prisma/             # Prisma schema(s), seed
public/             # Static assets
```

---

## Getting Started
1) Install
```
npm install
```

2) Environment
```
cp .env.example .env.local
```
Fill:
- Dev DB (SQLite): `DATABASE_URL="file:./prisma/dev.db"`
- Auth: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- Stripe (test): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- SMTP (optional): `SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/SMTP_FROM`

3) Database (dev)
```
npx prisma generate
npm run db:push
npm run seed   # optional
```

4) Run
```
npm run dev
```

---

## Production Database (Postgres)
- Use `PRISMA_SCHEMA=prisma/schema.postgres.prisma`
- `npx prisma migrate deploy` during deploy/CI
- See `DEPLOYMENT.md` for details

---

## Recent Highlights
- Stripe (Test Mode) checkout + webhook status update
- Order confirmation + shipped emails (SMTP)
- Wishlist API + client sync on login
- Admin Customers/Content pages
- Security: guards, validation, rate limiting, headers
- SEO: metadata, sitemap/robots

---

## Scripts
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm start` — start production server
- `npm test` — run unit tests (Vitest)
- `npm run db:push` — push dev schema (SQLite)
- `npx prisma migrate deploy` — apply migrations (Postgres)

---

## License
MIT

