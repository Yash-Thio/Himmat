import type { AuthorizedContext } from "@backend/lib/auth/context";
import { Arg, Authorized, Ctx, Query, Resolver } from "type-graphql";

import { handleGetCurrentUser } from "./resolvers/get-current-user";
import { handleIsUsernameAvailable } from "./resolvers/is-username-available";
import { UserGQL } from "./type";

@Resolver()
export class UserQueryResolver {
  @Query(() => UserGQL, { nullable: true })
  async getCurrentUser(@Ctx() ctx: AuthorizedContext) {
    return handleGetCurrentUser(ctx);
  }
  @Authorized()
  @Query(() => Boolean)
  async isUsernameAvailable(
    @Ctx() ctx: AuthorizedContext,
    @Arg("username") username: string,
  ) {
    return handleIsUsernameAvailable(ctx, username);
  }
}
