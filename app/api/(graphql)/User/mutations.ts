import type { AuthorizedContext } from "@backend/lib/auth/context";
import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";

import { handleUpdateUser, UpdateUserInput } from "./resolvers/update-user";

@Resolver()
export class UserMutationResolver {
  @Authorized()
  @Mutation(() => Boolean)
  updateUser(
    @Ctx() ctx: AuthorizedContext,
    @Arg("updatedUser") updatedUser: UpdateUserInput,
  ): Promise<boolean> {
    return handleUpdateUser(ctx, updatedUser);
  }
}
