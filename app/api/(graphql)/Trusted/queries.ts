import type { AuthorizedContext } from "@backend/lib/auth/context";
import { Arg, Authorized, Ctx, Query, Resolver } from "type-graphql";
import { handleGetUserTrusties } from "./resolvers/get-user-trusties";
import { handleIsUserTrusted } from "./resolvers/get-is-user-trusted";
import { TrustedGQL } from "./type";

@Resolver()
export class TrustedQueryResolvers {
  @Query(() => [TrustedGQL])
  @Authorized()
  async getUserTrusties(@Ctx() ctx: AuthorizedContext) {
    return handleGetUserTrusties(ctx);
  }

  @Query(() => Boolean)
  @Authorized()
  async getIsUserTrusted(
    @Ctx() ctx: AuthorizedContext,
    @Arg("username") username: string,
  ) {
    return handleIsUserTrusted(ctx, username);
  }
}