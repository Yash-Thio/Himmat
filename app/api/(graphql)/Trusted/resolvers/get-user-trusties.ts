import type { AuthorizedContext } from "@backend/lib/auth/context";
import { db } from "@backend/lib/db";
import { eq, inArray } from "drizzle-orm";

import { UserTable } from "../../User/db";
import { TrustedTable } from "../db";

export async function handleGetUserTrusties(ctx: AuthorizedContext) {
  if (!ctx.userId) {
    return [];
  }
  const [trustedRecord] = await db
    .select({ trustedUserIds: TrustedTable.trustedUserIds })
    .from(TrustedTable)
    .where(eq(TrustedTable.userId, ctx.userId))
    .limit(1);

  if (!trustedRecord || !trustedRecord.trustedUserIds?.length) {
    return [];
  }

  const trusties = await db
    .select({
      userId: UserTable.id,
      username: UserTable.username,
      name: UserTable.name,
      email: UserTable.email,
    })
    .from(UserTable)
    .where(inArray(UserTable.id, trustedRecord.trustedUserIds));

  return trusties;
}
