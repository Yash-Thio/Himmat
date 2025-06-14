import type { AuthorizedContext } from "@backend/lib/auth/context";
import { Arg, Authorized, Ctx, Query, Resolver } from "type-graphql";

import { handleGetChat } from "./resolvers/get-chat";
import { handleGetChats } from "./resolvers/get-chats";
import { ConversationGQL } from "./type";

@Resolver()
export class ChatQueryResolvers {
  @Query(() => [ConversationGQL])
  @Authorized()
  async getChats(@Ctx() ctx: AuthorizedContext) {
    return handleGetChats(ctx);
  }
  @Authorized()
  @Query(() => ConversationGQL, { nullable: true })
  getChat(@Ctx() ctx: AuthorizedContext, @Arg("username") username: string) {
    return handleGetChat(ctx, username);
  }
}
