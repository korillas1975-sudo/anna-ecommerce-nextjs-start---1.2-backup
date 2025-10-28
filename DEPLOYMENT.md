# Deployment Guide (Production Database)

This guide explains how to deploy with PostgreSQL (recommended) while keeping SQLite for local development.

## Strategy
- Keep `prisma/schema.prisma` (SQLite) for local dev.
- Use `prisma/schema.postgres.prisma` (PostgreSQL) for production/CI via `PRISMA_SCHEMA` env.
- Migrations run against Postgres with `prisma migrate deploy` in CI.

## Environment Variables (production)
```
PRISMA_SCHEMA=prisma/schema.postgres.prisma
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB?schema=public
NEXTAUTH_URL=https://your-domain
NEXTAUTH_SECRET=...
```

## Commands
- Generate client: `npx prisma generate`
- Apply migrations (prod): `npx prisma migrate deploy`
- Create a new migration (dev with Postgres): `npx prisma migrate dev --name init`

## CI (GitHub Actions)
- See `.github/workflows/ci.yml`:
  - Spins up Postgres service
  - Sets `PRISMA_SCHEMA=prisma/schema.postgres.prisma`
  - Runs `prisma generate` + `prisma migrate deploy` + build

## Notes
- Remove `prisma/dev.db` from production; do not commit real DB files.
- Seed script works with any provider (uses Prisma API); ensure `DATABASE_URL` points to the right DB before running `npm run seed` (optional in prod).

