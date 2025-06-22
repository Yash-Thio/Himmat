import { context } from "@backend/lib/auth/context";
import { NextRequest, NextResponse } from "next/server";
import { handleIsUserTrusted } from "@/app/api/(graphql)/Trusted/resolvers/get-is-user-trusted";

import { pusher } from "../../../lib/socket/send-event";

export const POST = async (req: NextRequest) => {
  const params = new URLSearchParams(await req.text());
  const socketId = params.get("socket_id");
  const channel = params.get("channel_name");
  const username = req.headers.get("username");
  const { userId } = await context(req);
  if (userId && channel && socketId && username) {
    if (await handleIsUserTrusted({ userId }, username)) {
      return new NextResponse(
        JSON.stringify(pusher.authorizeChannel(socketId, channel)),
      );
    }
  }
  return new NextResponse(null, {
    status: 403,
  });
};
