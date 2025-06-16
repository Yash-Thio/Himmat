import GQLError from "@backend/lib/constants/errors";
import { db } from "@backend/lib/db";
import { sendTemplateEmail } from "@backend/lib/email/send-template";
import { HOUR } from "@backend/lib/utils/time";
import { waitUntil } from "@vercel/functions";
import { and, eq } from "drizzle-orm";
import { sign } from "jsonwebtoken";

import { UserTable } from "../../User/db";
import { RequestTable, RequestType } from "../db";

function getVerifyLink(id: number) {
  const token = sign({ id }, process.env.SIGNING_KEY || "", {
    expiresIn: "2d",
  });
  return `${process.env.NEXT_PUBLIC_BASE_URL}/verify/${token}`;
}

export async function getVerificationLink(userID: number) {
  const [inserted] = await db
    .insert(RequestTable)
    .values({ user: userID, type: RequestType.VerifyEmail })
    .returning();
  if (!inserted) return null;
  return getVerifyLink(inserted.id);
}

export async function handleSendVerificationEmail(userID: number) {
  const [user] = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.id, userID));
  if (!user) return false;
  if (user.emailVerified) throw GQLError(400, "Email already verified");
  const [res] = await db
    .select()
    .from(RequestTable)
    .where(
      and(
        eq(RequestTable.user, user.id),
        eq(RequestTable.type, RequestType.VerifyEmail),
      ),
    );
  if (res) {
    if (new Date().getTime() - res.createdAt.getTime() < HOUR) {
      if (res.attempts >= 2)
        throw GQLError(
          403,
          "You can only send verification email twice an hour",
        );
      sendTemplateEmail(user.email, "VerifyEmail", {
        firstName: user.name?.split(" ")[0] || "",
        link: getVerifyLink(res.id),
      });
      waitUntil(db.update(RequestTable).set({ attempts: res.attempts + 1 }));
      return true;
    }
    await db.delete(RequestTable).where(eq(RequestTable.id, res.id));
  }
  waitUntil(
    (async () => {
      const link = await getVerificationLink(user.id);
      if (!link) return false;
      sendTemplateEmail(user.email, "VerifyEmail", {
        firstName: user.name?.split(" ")[0] || "",
        link,
      });
    })(),
  );
  return true;
}
