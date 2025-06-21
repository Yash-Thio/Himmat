"use client";
import React from "react";
import { useEffect } from "react";
import Pusher from "pusher-js";
import { useToken } from "@/lib/auth-client";

export default function DisplayLocation() {
  const token = useToken();
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "", {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
      channelAuthorization: {
        endpoint: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/pusher/sos`,
        transport: "ajax",
        headers: { Authorization: `Bearer ${token}` },
      },
    });
  }, []);
  return <div>display-location</div>;
}
