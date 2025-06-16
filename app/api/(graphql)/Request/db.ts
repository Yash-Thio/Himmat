import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";

import { UserTable } from "../User/db";

export enum RequestType {
  ResetPassword = "RESET_PASSWORD",
  VerifyEmail = "VERIFY_EMAIL",
}

export const requestType = pgEnum("request_type", [
  RequestType.ResetPassword,
  RequestType.VerifyEmail,
]);
export const RequestTable = pgTable("request", {
  id: serial("id").unique(),
  user: integer("user")
    .references(() => UserTable.id)
    .notNull(),
  type: requestType("type").notNull(),
  attempts: integer("attempts").default(1).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
