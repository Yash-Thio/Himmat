// import { getVerificationLink } from "@graphql/Request/resolvers/send-verification-email";
import { UserTable } from "@graphql/User/db";
import { createUser, getUser } from "@graphql/User/utils";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

import { ErrorResponses } from "../../lib/auth/error-responses";
import {
  generateAccessToken,
  generateRefreshToken,
  getTokenizedResponse,
} from "../../lib/auth/token";
// import { sendTemplateEmail } from "../../lib/email/send-template";
import { verifyUser } from "./put";

export const POST = async (req: Request) => {
  const body = (await req.json()) as {
    email: string;
    password?: string;
  };

  if (!body.email || !body.password) return ErrorResponses.missingBodyFields;
  const existingUser = await getUser(eq(UserTable.email, body.email));
  if (existingUser) {
    if (await verifyUser(existingUser, body.password)) {
      return getTokenizedResponse(
        generateAccessToken(existingUser.id),
        generateRefreshToken(existingUser.id),
      );
    }
    return ErrorResponses.alreadyExists;
  }

  const encryptedPassword = await hash(body.password, 10);
  const newUser = await createUser({
    ...body,
    password: encryptedPassword,
  });

  if (newUser) {
    // waitUntil(
    //   (async () => {
    //     const link = await getVerificationLink(newUser.id);
    //     if (link && body.email)
    //       await sendTemplateEmail(body.email, "WelcomeUser", {
    //         verifyLink: link,
    //       });
    //   })(),
    // );

    return getTokenizedResponse(
      generateAccessToken(newUser.id),
      generateRefreshToken(newUser.id),
    );
  }
  return getTokenizedResponse();
};
