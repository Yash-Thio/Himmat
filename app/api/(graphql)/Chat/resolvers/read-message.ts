import type { AuthorizedContext } from "@backend/lib/auth/context";
import { db } from "@backend/lib/db";
import { and, desc, eq } from "drizzle-orm";

import { ConversationMessageTable, ConversationTable } from "../db";

export async function handleReadMessage(
  ctx: AuthorizedContext,
  conversationID: number,
): Promise<boolean> {
  const [lastMessage] = await db
    .select()
    .from(ConversationMessageTable)
    .where(eq(ConversationMessageTable.conversation, conversationID))
    .orderBy(desc(ConversationMessageTable.createdAt))
    .limit(1);

  if (lastMessage?.by !== ctx.userId)
    await db
      .update(ConversationTable)
      .set({
        hasRead: true,
      })
      .where(and(eq(ConversationTable.id, conversationID)));
  return true;
}
