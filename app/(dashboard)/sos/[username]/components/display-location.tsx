"use client";
import React from "react";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { useToken } from "@/lib/auth-client";
import { GetIsUserTrustedQuery } from "@/__generated__/graphql";
import { getSosChannelName } from "@/app/api/(rest)/sos/utils";
import { SOS_LOCATION_UPDATE } from "@/app/api/(rest)/sos/utils";
import type { locationUpdate } from "@/app/api/(rest)/sos/types";
import { useUser } from "@/lib/auth-client";

interface DisplayLocationProps {
  isTrusted: GetIsUserTrustedQuery;
  username: string;
}

export default function DisplayLocation({
  isTrusted,
  username,
}: DisplayLocationProps) {
  const token = useToken();
  const user = useUser();
  const [location, setLocation] = useState<locationUpdate | null>(null);
  const [sosEnded, setSosEnded] = useState(false);
  useEffect(() => {
    if (!isTrusted.getIsUserTrusted) {
      return;
    }
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "", {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
      channelAuthorization: {
        endpoint: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/pusher/sos`,
        transport: "ajax",
        headers: { Authorization: `Bearer ${token}`, username: username },
      },
    });

    pusher.subscribe(getSosChannelName(username));
    pusher.bind(SOS_LOCATION_UPDATE, (update: NonNullable<locationUpdate>) => {
      if (!user) return;
      setLocation(update);
    });
    pusher.bind("sos-stopped", () => {
      setSosEnded(true);
    });
    return () => {
      pusher.unbind();
      pusher.unsubscribe(getSosChannelName(username));
    };
  }, [username, token, user, isTrusted.getIsUserTrusted]);
  return (
  <div>
    display-location
    {location && (
      <div>
        <p>Latitude: {location.latitude}</p>
        <p>Longitude: {location.longitude}</p>
        <p>Accuracy: {location.accuracy}</p>
        <p>Timestamp: {location.timestamp}</p>
      </div>
    )}
    {sosEnded && <p>SOS has ended.</p>}
  </div>
  );
}
