import type { UserDB } from "../db";
import { TrustedTable } from "../../Trusted/db";
import { eq } from "drizzle-orm";
import { db } from "@/app/api/lib/db";

export async function getIsOnboarded(user: UserDB): Promise<boolean> {
  const hasBasicInfo = Boolean(
      user.dob &&
      user.name &&
      user.username &&
      user.phone
    );
    if (!hasBasicInfo) return false;

    const [trustedRecord] = await db.select()
      .from(TrustedTable)
      .where(eq(TrustedTable.userId, user.id))
      .limit(1);

    return !!trustedRecord;
}
