import { NextResponse } from "next/server";

export const ErrorResponses = {
  noRefreshKey: new NextResponse("REFRESH_KEY not in server", {
    status: 500,
  }),
  alreadyExists: new NextResponse(
    "User with the provided email already exists!",
    {
      status: 400,
    },
  ),
  mergeError: new NextResponse(
    "Can't merge account, as it's already being used",
    {
      status: 400,
    },
  ),
  missingBodyFields: new NextResponse(
    "Missing required fields for the API call",
    {
      status: 400,
    },
  ),
  wrongCredentials: new NextResponse("Wrong email or password", {
    status: 403,
  }),
  invalidCaptcha: new NextResponse("Please solve the captcha", {
    status: 403,
  }),
  wrongScope: new NextResponse("Wrong signin method", {
    status: 403,
  }),
  expired: new NextResponse("Token Expired", {
    status: 401,
  }),
  internalServerError: new NextResponse("Internal server error", {
    status: 500,
  }),
};
