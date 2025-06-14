import type { AuthorizedContext } from "@backend/lib/auth/context";
import GQLError from "@backend/lib/constants/errors";
import { db } from "@backend/lib/db";
import { arrayContains, eq, getTableColumns } from "drizzle-orm";

import { UserTable } from "../../User/db";
import type { ConversationDB } from "../db";
import { ConversationTable } from "../db";

export async function handleGetChat(
  ctx: AuthorizedContext,
  username: string,
): Promise<ConversationDB> {
  const [user] = await db
    .select({
      id: UserTable.id,
    })
    .from(UserTable)
    .where(eq(UserTable.username, username));
  if (!user?.id) throw GQLError(404, "Username does not exist");
  const [conversation] = await db
    .select(getTableColumns(ConversationTable))
    .from(ConversationTable)
    .where(arrayContains(ConversationTable.users, [user.id, ctx.userId]));
  return (
    conversation || {
      users: [user.id, ctx.userId],
      id: -1,
      hasRead: false,
      createdAt: new Date(),
    }
  );
}
