import type { AuthorizedContext } from "@backend/lib/auth/context";
import { db } from "@backend/lib/db";
import { arrayContains, getTableColumns } from "drizzle-orm";

import { ConversationTable } from "../db";
import type { ConversationGQL } from "../type";

export async function handleGetChats(
  ctx: AuthorizedContext,
): Promise<ConversationGQL[]> {
  return db
    .select(getTableColumns(ConversationTable))
    .from(ConversationTable)
    .where(arrayContains(ConversationTable.users, [ctx.userId]));
}
