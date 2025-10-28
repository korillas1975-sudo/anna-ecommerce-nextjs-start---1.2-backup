import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const schemaPath = process.env.PRISMA_SCHEMA || "prisma/schema.prisma";

export default defineConfig({
  schema: schemaPath,
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
