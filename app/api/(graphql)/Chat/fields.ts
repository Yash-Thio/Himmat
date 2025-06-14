import { db } from "@backend/lib/db";
import { getUser } from "@graphql/User/utils";
import { desc, eq } from "drizzle-orm";
import { Arg, Ctx, FieldResolver, Resolver, Root } from "type-graphql";

import type { AuthorizedContext } from "../../lib/auth/context";
import { UserTable } from "../User/db";
import { UserGQL } from "../User/type";
import type { ConversationDB } from "./db";
import { ConversationMessageTable } from "./db";
import { ConversationGQL, MessageGQL, PreviewGQL } from "./type";

const CHAT_PAGE_SIZE = 20;

@Resolver(() => ConversationGQL)
export class ChatFieldResolvers {
  @FieldResolver(() => [MessageGQL])
  async messages(
    @Root() chat: ConversationGQL,
    @Arg("page", { nullable: true }) page?: number,
  ) {
    return db
      .select()
      .from(ConversationMessageTable)
      .where(eq(ConversationMessageTable.conversation, chat.id))
      .orderBy(desc(ConversationMessageTable.id))
      .offset((page || 0) * CHAT_PAGE_SIZE)
      .limit(CHAT_PAGE_SIZE);
  }
  @FieldResolver(() => PreviewGQL, { nullable: true })
  async preview(@Ctx() ctx: AuthorizedContext, @Root() chat: ConversationDB) {
    const [latestMessage] = await db
      .select()
      .from(ConversationMessageTable)
      .where(eq(ConversationMessageTable.conversation, chat.id))
      .orderBy(desc(ConversationMessageTable.createdAt))
      .limit(1);
    return {
      text: latestMessage?.body || "",
      hasRead: chat.hasRead || latestMessage?.by === ctx.userId,
      at: latestMessage?.createdAt || new Date(),
    };
  }
  @FieldResolver(() => UserGQL, { nullable: true })
  async user(@Ctx() ctx: AuthorizedContext, @Root() chat: ConversationDB) {
    const userID = chat.users?.find((u) => u !== ctx.userId);
    if (!userID) return null;
    return getUser(eq(UserTable.id, userID));
  }
}
