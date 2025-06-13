import { eq } from 'drizzle-orm';
import { UserTable, UserDBInsert } from '@graphql/User/db';
import type { Context } from '@/app/api/lib/auth/context';
import type { SQL } from 'drizzle-orm';
import { db } from '@/app/api/lib/db';
import { USERNAME_REGEX } from '@/constants/regex';
import { DBTransaction } from '@/app/api/lib/db';
export async function getUser(filter: SQL) {
  const [user] = await db.select().from(UserTable).where(filter);
  return user;
}

export async function createUser(data: UserDBInsert, tx?: DBTransaction) {
  const [user] = await (tx || db)
    .insert(UserTable)
    .values(data)
    .returning({ id: UserTable.id });
  return user;
}

export const getCurrentUser = (ctx: Context) => {
  if (!ctx.userId) return null;
  return getUser(eq(UserTable.id, ctx.userId));
};

export function usernameAllowed(username: string) {
  return USERNAME_REGEX.test(username);
}