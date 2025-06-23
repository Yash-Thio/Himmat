import type { AuthorizedContext } from "@backend/lib/auth/context";
import GQLError from "@backend/lib/constants/errors";
import { db } from "@backend/lib/db";
import { usernameAllowed } from "@graphql/User/utils";
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsNumberString,
  Matches,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { Field, InputType } from "type-graphql";

import { NAME_MAX_LENGTH, USERNAME_MAX_LENGTH } from "@/constants/constraints";
import { USERNAME_REGEX } from "@/constants/regex";

import { TrustedTable } from "../../Trusted/db";
import { UserTable } from "../db";

@InputType("TrustedContactInput")
export class TrustedContactInput {
  @Field()
  @Matches(USERNAME_REGEX)
  @MaxLength(USERNAME_MAX_LENGTH)
  username!: string;
}

@InputType("UpdateUserInput")
export class UpdateUserInput {
  @MaxLength(NAME_MAX_LENGTH)
  @Field({ nullable: true })
  name?: string;
  @MaxLength(15)
  @IsNumberString()
  @Field({ nullable: true })
  phone?: string;
  @Field({ nullable: true })
  @Matches(USERNAME_REGEX)
  @MaxLength(USERNAME_MAX_LENGTH)
  username?: string;
  @Field({ nullable: true })
  @IsDateString()
  dob?: string;
  @Field(() => [TrustedContactInput], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(5)
  trusties?: TrustedContactInput[];
}

export async function handleUpdateUser(
  ctx: AuthorizedContext,
  updatedUser: UpdateUserInput,
) {
  if (updatedUser.username && !usernameAllowed(updatedUser.username)) {
    throw GQLError(400, "Invalid username");
  }
  const [user] = await db
    .update(UserTable)
    .set({
      id: ctx.userId,
      name: updatedUser.name,
      dob: updatedUser.dob,
      username: updatedUser.username,
      phone: updatedUser.phone,
    })
    .where(eq(UserTable.id, ctx.userId))
    .returning({ username: UserTable.username });

  if (updatedUser.trusties && updatedUser.trusties.length > 0) {
    const trustedUserIds: number[] = [];

    for (const trusty of updatedUser.trusties) {
      const [existingUser] = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.username, trusty.username))
        .limit(1);

      if (existingUser) {
        trustedUserIds.push(existingUser.id);
      }
    }
    if (trustedUserIds.length > 0) {
      await db
        .insert(TrustedTable)
        .values({
          userId: ctx.userId,
          trustedUserIds: trustedUserIds,
        })
        .onConflictDoUpdate({
          target: [TrustedTable.userId],
          set: {
            trustedUserIds: trustedUserIds,
          },
        });
    }
  }

  if (user?.username) {
    revalidateTag(`profile-${user.username}`);
  }
  return true;
}
