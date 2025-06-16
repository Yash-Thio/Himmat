import GQLError from "@backend/lib/constants/errors";
import { db } from "@backend/lib/db";
import { sendTemplateEmail } from "@backend/lib/email/send-template";
import { DAY } from "@backend/lib/utils/time";
import { and, eq } from "drizzle-orm";
import { sign } from "jsonwebtoken";

import { UserTable } from "../../User/db";
import { RequestTable, RequestType } from "../db";

function getForgetLink(id: number) {
  const token = sign({ id }, process.env.SIGNING_KEY || "", {
    expiresIn: "1h",
  });
  return `${process.env.NEXT_PUBLIC_BASE_URL}/reset/${token}`;
}

export async function handleSendResetPasswordEmail(userEmail: string) {
  const [user] = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.email, userEmail));
  if (!user) return null;
  const [res] = await db
    .select()
    .from(RequestTable)
    .where(
      and(
        eq(RequestTable.user, user.id),
        eq(RequestTable.type, RequestType.ResetPassword),
      ),
    );
  if (res) {
    if (new Date().getTime() - res.createdAt.getTime() < DAY) {
      if (res.attempts >= 2)
        throw GQLError(
          403,
          "You can only send password reset email twice a day",
        );
      await sendTemplateEmail(userEmail, "ResetPassword", {
        firstName: user.name?.split(" ")[0] || "",
        link: getForgetLink(res.id),
      });
      await db.update(RequestTable).set({ attempts: res.attempts + 1 });
      return null;
    }
    await db.delete(RequestTable).where(eq(RequestTable.id, res.id));
  }
  const [inserted] = await db
    .insert(RequestTable)
    .values({ user: user.id, type: RequestType.ResetPassword })
    .returning();
  if (!inserted) return null;
  await sendTemplateEmail(userEmail, "ResetPassword", {
    firstName: user.name?.split(" ")[0] || "",
    link: getForgetLink(inserted.id),
  });
  return null;
}
