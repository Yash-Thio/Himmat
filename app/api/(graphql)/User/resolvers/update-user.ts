import type { AuthorizedContext } from "@backend/lib/auth/context";
import GQLError from "@backend/lib/constants/errors";
import { db } from "@backend/lib/db";
import { UserTable } from "../db";
import { usernameAllowed } from "@graphql/User/utils";
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsNumberString,
  IsUrl,
  Matches,
  MaxLength,
} from "class-validator";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { Field, InputType } from "type-graphql";
import {
  NAME_MAX_LENGTH,
  USERNAME_MAX_LENGTH,
} from "@/constants/constraints";
import { USERNAME_REGEX } from "@/constants/regex";

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
  if (user?.username) {
    revalidateTag(`profile-${user.username}`);
  }
  return true;
}
