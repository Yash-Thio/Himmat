import { Arg, Query, Resolver } from "type-graphql";

import { handleVerifyEmail } from "./resolvers/verify-email";

@Resolver()
export class RequestQueryResolver {
  @Query(() => Boolean)
  verifyEmail(@Arg("token") token: string) {
    return handleVerifyEmail(token);
  }
}
