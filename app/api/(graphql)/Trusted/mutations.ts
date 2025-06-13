// import type { AuthorizedContext } from "@backend/lib/auth/context";
// import { Arg, Authorized, Ctx, Int, Mutation, Resolver } from "type-graphql";

// @Resolver()
// export class TrustedMutationResolvers {
//   @Authorized()
//   @Mutation(() => Boolean)
//   async addTrusty(
//     @Ctx() ctx: AuthorizedContext,
//     @Arg("userID", () => Int) userID: number,
//   ) {
//     return handleAddTrusted(ctx, userID);
//   }
//   @Authorized()
//   @Mutation(() => Boolean)
//   updateTrusties(
//     @Ctx() ctx: AuthorizedContext,
//     @Arg("userID", () => Int) userID: number,
//     @Arg("trusties", () => [Int]) trusties: number[],
//   ) {
//     return handleUpdateTrusties(ctx, userID, trusties);
//   }
// }
