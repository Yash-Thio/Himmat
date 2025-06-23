import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

import { UserTable } from "../User/db";

export const SosTable = pgTable("sos", {
  id: serial("id").primaryKey(),
  by: integer("by")
    .references(() => UserTable.id)
    .notNull(),
  usedAt: timestamp("used_at").defaultNow().notNull(),
});

export type SosDBInsert = typeof SosTable.$inferInsert;
export type SosDB = typeof SosTable.$inferSelect;
