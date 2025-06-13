import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";

import type { UserDB } from "./db";
import { getIsOnboarded } from "./resolvers/onboarding-data";
import { UserGQL } from "./type";

@Resolver(() => UserGQL)
export class UserFieldResolver {

  @FieldResolver(() => Boolean)
  isOnboarded(@Root() user: UserDB): Promise<boolean> {
    return getIsOnboarded(user);
  }
}
