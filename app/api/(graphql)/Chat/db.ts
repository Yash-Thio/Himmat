import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { UserTable } from "../User/db";

export const ConversationTable = pgTable("conversation", {
  id: serial("id").primaryKey(),
  users: integer("users")
    .references(() => UserTable.id)
    .array(),
  hasRead: boolean("has_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ConversationMessageTable = pgTable("conversation_message", {
  id: serial("id").primaryKey(),
  by: integer("by")
    .references(() => UserTable.id)
    .notNull(),
  conversation: integer("conversation")
    .references(() => ConversationTable.id)
    .notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type ConversationDB = typeof ConversationTable.$inferSelect;
