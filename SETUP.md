# ANNA PARIS E‑Commerce — Setup Guide (Setup Only)

This document is only for installation and local run instructions. For project status/roadmap, see `PROJECT_STATUS.md`. For design choices, see `DESIGN_DECISIONS.md`. For content/asset swaps, see `docs/content-placeholders.md`.

## Technology Stack (Reference)
- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS v4, Framer Motion, GSAP
- Prisma ORM with SQLite for development
- Zustand (localStorage persistence)
- NextAuth.js v5 (JWT + Prisma adapter)

## Quick Start

### 1) Install Dependencies
```bash
npm install
```

### 2) Environment Variables
Copy the example and edit values:
```bash
cp .env.example .env.local
```
Recommended local values:
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-with: openssl rand -base64 32>"
# Optional: Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 3) Database (Dev)
```bash
npx prisma generate
npx prisma db push
```

### 4) Seed Database (Dev Data)
Option A (no extra install):
```bash
npx ts-node prisma/seed.ts
```
Option B (install dev dependency):
```bash
npm i -D ts-node
npm run seed
```

### 5) Run Dev Server
```bash
npm run dev
```
Open http://localhost:3000

## Notes
- Local dev uses SQLite at `prisma/dev.db`. For production, switch `DATABASE_URL` to Postgres/MySQL and run proper migrations.
- Do not store secrets in code. Use env files.
- Progress updates are not tracked here. Use `PROJECT_STATUS.md` and `CHANGELOG.md`.

