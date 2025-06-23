import { generateRefreshToken } from "@backend/lib/auth/token";
import { db } from "@backend/lib/db";
import { UserTable } from "@graphql/User/db";
import { createUser } from "@graphql/User/utils";
import { eq } from "drizzle-orm";
import { google } from "googleapis";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { v4 } from "uuid";

import { getRoute } from "@/constants/routes";

import { oauth2Client } from "./google-oauth";

function errorResponse(redirectURL: string | null) {
  return NextResponse.redirect(
    redirectURL || process.env.NEXT_PUBLIC_BASE_URL || "",
  );
}
export const GET = async (req: NextRequest) => {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (!code && !error) {
    const state = v4();
    const authorizationUrl = oauth2Client.generateAuthUrl({
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
      state,
      include_granted_scopes: true,
      prompt: "consent",
      redirect_uri: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/google`,
    });
    const res = NextResponse.redirect(authorizationUrl);
    res.cookies.set("state", state, {
      httpOnly: true,
      secure: true,
    });
    return res;
  }
  if (error) {
    return errorResponse(getRoute("SignUp"));
  }
  const state = req.nextUrl.searchParams.get("state") || undefined;
  if (code && state) {
    const localState = req.cookies.get("state")?.value;
    if (localState !== state) return errorResponse(getRoute("SignUp"));
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const userInfoRequest = await google
      .oauth2({
        auth: oauth2Client,
        version: "v2",
      })
      .userinfo.get();

    const user = userInfoRequest.data;
    if (user.email) {
      const [existingUser] = await db
        .update(UserTable)
        .set({ emailVerified: true })
        .where(eq(UserTable.email, user.email))
        .returning({
          id: UserTable.id,
        });
      let refreshToken;
      if (existingUser) {
        refreshToken = generateRefreshToken(existingUser.id);
      } else if (user.name) {
        const newUser = await createUser({
          email: user.email,
          name: user.name,
          emailVerified: true,
        });
        if (newUser) {
          refreshToken = generateRefreshToken(newUser.id);
        }
      }

      const res = NextResponse.redirect(getRoute("Home"));
      if (refreshToken)
        res.cookies.set("refresh", refreshToken, {
          httpOnly: true,
          secure: true,
        });
      res.cookies.set("state", "", {
        httpOnly: true,
        secure: true,
        maxAge: 0,
      });
      return res;
    }
  }
  return errorResponse(getRoute("SignUp"));
};
