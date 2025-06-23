import type { AuthorizedContext } from "@backend/lib/auth/context";
import { db } from "@backend/lib/db";
import { eq } from "drizzle-orm";

import { UserTable } from "../../User/db";
import { TrustedTable } from "../db";

export async function handleIsUserTrusted(
  ctx: AuthorizedContext,
  username: string,
) {
  if (!ctx.userId) {
    return false;
  }
  const [trustedRecord] = await db
    .select()
    .from(TrustedTable)
    .innerJoin(UserTable, eq(TrustedTable.userId, UserTable.id))
    .where(eq(UserTable.username, username))
    .limit(1);

  if (!trustedRecord) return false;
  return trustedRecord.trusted.trustedUserIds.includes(ctx.userId);
}
