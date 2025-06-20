import type { AuthorizedContext } from "@backend/lib/auth/context";
import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { handleSendSos } from "./resolvers/send-sos";


@Resolver()
export class SosMutationResolvers {
@Authorized()
  @Mutation(() => Boolean)
  async sendSos(
    @Ctx() ctx: AuthorizedContext,
  ): Promise<boolean> {
    return handleSendSos(ctx);
  }
}