import type { AuthorizedContext } from "@backend/lib/auth/context";
import { Arg, Authorized, Ctx, Query, Resolver } from "type-graphql";
import { handleGetUserTrusties } from "./resolvers/get-user-trusties";
import { TrustedGQL } from "./type";    

@Resolver()
export class TrustedQueryResolvers {
  @Query(() => [TrustedGQL])
  @Authorized()
  async getUserTrusties(@Ctx() ctx: AuthorizedContext) {
    return handleGetUserTrusties(ctx);
  }
}