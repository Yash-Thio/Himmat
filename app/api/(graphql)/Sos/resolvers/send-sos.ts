import type { AuthorizedContext } from "@backend/lib/auth/context";
import { db } from "@backend/lib/db";
import { eq, inArray } from "drizzle-orm";
import { TrustedTable } from "../../Trusted/db";
import { UserTable } from "../../User/db";
import { sendBatchTemplateEmail } from "@/app/api/lib/email/send-template";
import { SosTable } from "../db";

export async function handleSendSos(ctx: AuthorizedContext) {
  if (!ctx.userId) {
    return false;
  }

  await db.insert(SosTable).values({
    by: ctx.userId,
  });

  const [trustedRecord] = await db
    .select({ trustedUserIds: TrustedTable.trustedUserIds })
    .from(TrustedTable)
    .where(eq(TrustedTable.userId, ctx.userId))
    .limit(1);

  if (!trustedRecord || !trustedRecord.trustedUserIds?.length) {
    return false;
  }

  const trusties = await db
    .select({
      userId: UserTable.id,
      username: UserTable.username,
      name: UserTable.name,
      email: UserTable.email,
      emailVerified: UserTable.emailVerified,
    })
    .from(UserTable)
    .where(inArray(UserTable.id, trustedRecord.trustedUserIds));

  const verifiedTrusties = trusties.filter((trustie) => trustie.emailVerified);
  if (!verifiedTrusties.length) return false;

  await sendBatchTemplateEmail(
    "SosAlert",
    verifiedTrusties.map((user) => ({
      to: user.email,
      meta: {
        firstName: user.name?.split(" ")[0] || "",
        link: `${process.env.NEXT_PUBLIC_BASE_URL}/sos/${ctx.userId}`,
      },
    }))
  );

  return true;
}
