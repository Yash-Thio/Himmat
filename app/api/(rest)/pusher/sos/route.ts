import { context } from "@backend/lib/auth/context";
import { NextRequest, NextResponse } from "next/server";

import { db } from "../../../lib/db";
import { pusher } from "../../../lib/socket/send-event";

export const POST = async (req: NextRequest) => {
  const params = new URLSearchParams(await req.text());
  const socketId = params.get("socket_id");
  const channel = params.get("channel_name");
  const { userId } = await context(req);
  if (userId && channel && socketId) {
    // check if the user s part of the emergency contacts
  }
  return new NextResponse(null, {
    status: 403,
  });
};
