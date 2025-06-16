import type { Context } from "@backend/lib/auth/context";
import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";

import { handleResetPassword } from "./resolvers/reset-password";
import { handleSendResetPasswordEmail } from "./resolvers/send-reset-password-email";
import { handleSendVerificationEmail } from "./resolvers/send-verification-email";

@Resolver()
export class RequestMutationResolver {
  @Mutation(() => Boolean, { nullable: true })
  sendResetPasswordEmail(@Arg("email") email: string) {
    return handleSendResetPasswordEmail(email);
  }
  @Authorized()
  @Mutation(() => Boolean)
  sendVerificationEmail(@Ctx() ctx: Context) {
    if (!ctx.userId) return false;
    return handleSendVerificationEmail(ctx.userId);
  }
  @Mutation(() => Boolean)
  resetPassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
  ) {
    return handleResetPassword(token, newPassword);
  }
}
