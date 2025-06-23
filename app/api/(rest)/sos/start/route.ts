import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { sendEvent } from "@/app/api/lib/socket/send-event";

import { UserTable } from "../../../(graphql)/User/db";
import { db } from "../../../lib/db";
import type { locationUpdate } from "../types";
import { getSosChannelName, SOS_LOCATION_UPDATE } from "../utils";

export async function POST(request: NextRequest) {
  try {
    const userId = Number(request.headers.get("x-user-id"));
    if (!userId) {
      console.error("No x-user-id header found");
      return NextResponse.json(
        { error: "User ID header missing" },
        { status: 400 },
      );
    }
    const [user] = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.id, userId))
      .limit(1);
    if (!user) {
      console.error("User not found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 404 });
    }

    const { latitude, longitude, accuracy, timestamp } = await request.json();
    if (!user.username) {
      console.error("User username not found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 404 });
    }
    const locationData: locationUpdate = {
      latitude,
      longitude,
      accuracy,
      timestamp,
    };
    await sendEvent([
      {
        channel: getSosChannelName(user.username),
        name: SOS_LOCATION_UPDATE,
        data: locationData,
      },
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SOS broadcast error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
