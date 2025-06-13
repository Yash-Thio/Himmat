import type { TablesRelationalConfig } from "drizzle-orm";
import type { PgQueryResultHKT, PgTransaction } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const db = drizzle(
  postgres(process.env.POSTGRES_URL || "", {
    idle_timeout: 10,
  }),
);

export type DBTransaction = PgTransaction<
  PgQueryResultHKT,
  Record<string, never>,
  TablesRelationalConfig
>;
