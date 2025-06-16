import GQLError from "@backend/lib/constants/errors";
import { db } from "@backend/lib/db";
import { DAY } from "@backend/lib/utils/time";
import { and, eq } from "drizzle-orm";
import { verify } from "jsonwebtoken";

import { UserTable } from "../../User/db";
import { RequestTable, RequestType } from "../db";

export async function handleVerifyEmail(token: string) {
  const data = verify(token, process.env.SIGNING_KEY || "") as {
    id: number;
  } | null;
  if (!data?.id) throw GQLError(400, "Invalid token, please request again");
  const [res] = await db
    .select()
    .from(RequestTable)
    .where(
      and(
        eq(RequestTable.id, data.id),
        eq(RequestTable.type, RequestType.VerifyEmail),
      ),
    )
    .innerJoin(UserTable, eq(UserTable.id, RequestTable.user));
  if (!res) throw GQLError(400, "Request expired, please request again");
  if (res.user.emailVerified) return true;
  if (new Date().getTime() - res.request.createdAt.getTime() > 2 * DAY)
    throw GQLError(400, "Link expired, please request again");
  await db
    .update(UserTable)
    .set({ emailVerified: true })
    .where(eq(UserTable.id, res.user.id));
  await db.delete(RequestTable).where(eq(RequestTable.id, data.id));
  return true;
}
