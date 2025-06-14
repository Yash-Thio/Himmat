import { context } from "@backend/lib/auth/context";
import { ConversationTable } from "@graphql/Chat/db";
import { arrayContains } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "../../lib/db";
import { pusher } from "../../lib/socket/send-event";

export const POST = async (req: NextRequest) => {
  const params = new URLSearchParams(await req.text());
  const socketId = params.get("socket_id");
  const channel = params.get("channel_name");
  const { userId } = await context(req);
  if (userId && channel && socketId) {
    const [conversation] = await db
      .select()
      .from(ConversationTable)
      .where(arrayContains(ConversationTable.users, [userId]));
    if (conversation?.id)
      return new NextResponse(
        JSON.stringify(pusher.authorizeChannel(socketId, channel)),
      );
  }
  return new NextResponse(null, {
    status: 403,
  });
};
