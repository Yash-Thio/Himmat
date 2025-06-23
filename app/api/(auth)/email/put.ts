import { UserDB, UserTable } from "@graphql/User/db";
import { getUser } from "@graphql/User/utils";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";

import { ErrorResponses } from "../../lib/auth/error-responses";
import {
  generateAccessToken,
  generateRefreshToken,
  getTokenizedResponse,
} from "../../lib/auth/token";

export function verifyUser(user: UserDB, password: string) {
  if (!user.password) return false;
  const x = password === user.password;
  return x;
}

export const PUT = async (req: Request) => {
  const body = (await req.json()) as {
    email?: string;
    password?: string;
  };

  if (!body.email || !body.password) return ErrorResponses.missingBodyFields;
  const user = await getUser(eq(UserTable.email, body.email));
  if (!user) return ErrorResponses.wrongCredentials;
  if (verifyUser(user, body.password)) {
    return getTokenizedResponse(
      generateAccessToken(user.id),
      generateRefreshToken(user.id),
    );
  }
  return ErrorResponses.wrongCredentials;
};
