import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const UserTable = pgTable(
  "user",
  {
    id: serial("id").primaryKey(),
    name: text("name"),
    username: text("username").unique(),
    email: text("email").unique().notNull(),
    emailVerified: boolean("email_verified").default(false),
    
    password: text("password"),
    phone: text("phone"),
    dob: date("dob"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userSearchNameIndex: index("user_search_name_index").using(
      "gin",
      sql`${table.name} gin_trgm_ops`,
    ),
    userSearchUserNameIndex: index("user_search_username_index").using(
      "gin",
      sql`${table.username} gin_trgm_ops`,
    ),
    dobIdx: index("dob_idx").on(table.dob),
    emailIdx: index("email_idx").on(table.email),
    usernameIdx: index("username_idx").on(table.username),
  }),
);
export type UserDBInsert = typeof UserTable.$inferInsert;
export type UserDB = typeof UserTable.$inferSelect;
