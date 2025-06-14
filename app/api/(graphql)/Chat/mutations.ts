import type { AuthorizedContext } from "@backend/lib/auth/context";
import { Arg, Authorized, Ctx, Int, Mutation, Resolver } from "type-graphql";

import { handleReadMessage } from "./resolvers/read-message";
import { handleSendMessage } from "./resolvers/send-message";

@Resolver()
export class ChatMutationResolvers {
  @Authorized()
  @Mutation(() => Boolean)
  sendMessage(
    @Ctx() ctx: AuthorizedContext,
    @Arg("userID", () => Int) userID: number,
    @Arg("body") body: string,
  ) {
    return handleSendMessage(ctx, body, userID);
  }
  @Authorized()
  @Mutation(() => Boolean)
  readMessage(
    @Ctx() ctx: AuthorizedContext,
    @Arg("conversationID", () => Int) conversationID: number,
  ) {
    return handleReadMessage(ctx, conversationID);
  }
}
