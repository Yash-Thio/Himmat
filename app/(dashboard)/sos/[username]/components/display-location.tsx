"use client";
import Pusher from "pusher-js";
import React from "react";
import { useEffect, useState } from "react";

import { GetIsUserTrustedQuery } from "@/__generated__/graphql";
import type { locationUpdate } from "@/app/api/(rest)/sos/types";
import { getSosChannelName } from "@/app/api/(rest)/sos/utils";
import { SOS_LOCATION_UPDATE, SOS_STOPPED } from "@/app/api/(rest)/sos/utils";
import { Map } from "@/components/map/map";
import { useToken } from "@/lib/auth-client";
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
  const [user] = useUser();
  const [isConnected, setIsConnected] = useState(false);
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
      setIsConnected(true);
    });
    pusher.bind(SOS_STOPPED, () => {
      setSosEnded(true);
    });
    return () => {
      pusher.unbind();
      pusher.unsubscribe(getSosChannelName(username));
    };
  }, [username, token, user, isTrusted.getIsUserTrusted]);

  if (sosEnded) {
    return (
      <div className="text-center text-green-600 p-8">
        <h2 className="text-xl font-bold mb-4">SOS Ended</h2>
        <p>The emergency situation has been resolved.</p>
      </div>
    );
  }
  const userLocation = location
    ? { lat: location.latitude, lng: location.longitude }
    : null;
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="bg-card border-b p-4">
        <div className="flex items-center">
          <div className="text-3xl mr-4">🆘</div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-red-600">
              Emergency Tracking
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-muted-foreground">
                Tracking: <span className="font-medium">@{username}</span>
              </p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-yellow-500"}`}
                />
                <span className="text-sm text-muted-foreground">
                  {isConnected ? "Connected" : "Connecting..."}
                </span>
              </div>
              {location && (
                <span className="text-sm text-muted-foreground">
                  Updated: {new Date(location.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 relative">
        {location && (
          <Map
            center={{ lat: location.latitude, lng: location.longitude }}
            destination={{ lat: location.latitude, lng: location.longitude }}
            zoom={16}
            showUserMarker={false}
            showDestinationMarker={true}
            className="w-full h-screen"
            destinationInfoWindow={
              <div className="text-center p-2">
                <div className="font-semibold text-red-600 text-lg mb-2">
                  🆘 Emergency Location
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <strong>@{username}</strong>
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  Accuracy: ±{location.accuracy}m
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(location.timestamp).toLocaleString()}
                </div>
              </div>
            }
            mapOptions={{
              disableDefaultUI: false,
              zoomControl: true,
              streetViewControl: true,
              mapTypeControl: true,
              fullscreenControl: true,
            }}
          />
        )}
      </div>
      {location && !sosEnded && (
        <div className="bg-card border-t p-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              <span className="mr-2">🗺️</span>
              Open in Google Maps
            </a>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              <span className="mr-2">🧭</span>
              Get Directions
            </a>
            <a
              href="tel:911"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              <span className="mr-2">📞</span>
              Emergency Services
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
