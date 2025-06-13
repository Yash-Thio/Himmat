import type { AuthorizedContext } from "@backend/lib/auth/context";

import { getCurrentUser } from "../utils";

export async function handleGetCurrentUser(ctx: AuthorizedContext) {
  return getCurrentUser(ctx);
}
