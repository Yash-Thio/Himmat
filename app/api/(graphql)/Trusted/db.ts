import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

import { UserTable } from "../User/db";

export const TrustedTable = pgTable("trusted", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => UserTable.id)
    .notNull()
    .unique(),
  trustedUserIds: integer("trusted_user_ids")
    .references(() => UserTable.id)
    .array()
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type TrustedDBInsert = typeof TrustedTable.$inferInsert;
export type TrustedDB = typeof TrustedTable.$inferSelect;
