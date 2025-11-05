# Deployment Guide

Production is hosted on **AWS Amplify** and uses **Neon PostgreSQL**. SQLite is still used for local development.

## Overview
- **Repository schemas**
  - `prisma/schema.prisma` → SQLite (local dev / tests)
  - `prisma/schema.postgres.prisma` → Postgres (production / Amplify)
- **Datasource**: Neon “pooler” connection (psql) — we run `prisma db push` (not `migrate deploy`) during build to stay compatible with pgbouncer.
- **Runtime environment** is injected by writing `.env.production` during the Amplify preBuild step.

## Required environment variables (Amplify Secrets / Environment variables)
```
PRISMA_SCHEMA=prisma/schema.postgres.prisma
DATABASE_URL=postgresql://<user>:<password>@<neon-host>-pooler.<region>.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connection_limit=1
AUTH_SECRET=<long random string>
NEXTAUTH_SECRET=<same as AUTH_SECRET>
NEXTAUTH_URL=https://<your-domain>
SEED_TOKEN=<only if using seed/promote helpers; rotate or remove after use>
REVIEWS_ENABLED=true   # optional (defaults to true)
```

## Amplify build pipeline (preBuild commands)
The build spec (`amplify.yml`) should contain the following commands in `preBuild`:
```
npm ci
npx prisma generate
printf "DATABASE_URL=%s\n" "$DATABASE_URL" > .env.production
printf "AUTH_SECRET=%s\n" "$AUTH_SECRET" >> .env.production
printf "NEXTAUTH_SECRET=%s\n" "$AUTH_SECRET" >> .env.production
# Optional if seed/promote endpoints are in use
# printf "SEED_TOKEN=%s\n" "$SEED_TOKEN" >> .env.production
# Enable/disable reviews feature (defaults to true when omitted)
# printf "REVIEWS_ENABLED=%s\n" "$REVIEWS_ENABLED" >> .env.production
npx prisma db push
```
Amplify will then run `npm run build` / `npm run start`. Because `.env.production` is created during preBuild, Next.js sees the correct values at runtime.

## Local development
```
cp .env.example .env
npx prisma generate
npx prisma db push
npm run dev
```
This uses SQLite (`prisma/dev.db`). The new Reviews table is additive, so `db push` keeps existing data.

## Manual deploy steps summary
1. Commit + push to the tracked branch (master → Amplify auto-deploys).
2. Ensure Amplify Secrets / Environment variables contain the keys listed above.
3. Verify `/api/health` and `/auth/login` after deploy.

## Postgres specific notes
- Using Neon with pgbouncer requires `prisma db push` instead of `prisma migrate deploy` in the pipeline. For structural changes, create migrations locally (`npx prisma migrate dev`) and commit them, then Amplify’s `db push` keeps the schema in sync.
- Direct (non-pooler) connection can be stored in `DIRECT_URL` if you need `migrate deploy`. Currently not required.

## Seeding / helper endpoints
- `/api/admin/seed` (protected by `SEED_TOKEN`) refreshes admin/customer credentials and seeds demo products if empty.
- `/api/admin/promote` and `/api/admin/debug-credentials` are temporary helpers; remove them or rotate `SEED_TOKEN` after use.
