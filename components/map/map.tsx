"use client";

import {
  DirectionsRenderer,
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import React, { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MapProps {
  center?: LatLng;
  zoom?: number;

  userLocation?: LatLng;
  destination?: LatLng;

  className?: string;
  mapOptions?: any;

  showUserMarker?: boolean;
  showDestinationMarker?: boolean;

  showDirections?: boolean;
  travelMode?: google.maps.TravelMode;

  onMapClick?: (event: any) => void;
  onUserMarkerClick?: () => void;
  onDestinationMarkerClick?: () => void;
  onDirectionsLoad?: (directions: any) => void;

  userInfoWindow?: string | React.ReactNode;
  destinationInfoWindow?: string | React.ReactNode;

  loadingElement?: React.ReactNode;
}

const defaultCenter: LatLng = {
  lat: 37.7749,
  lng: -122.4194, // San Francisco
};

export const Map: React.FC<MapProps> = ({
  center = defaultCenter,
  zoom = 10,
  userLocation,
  destination,
  className,
  mapOptions = {},
  showUserMarker = true,
  showDestinationMarker = true,
  showDirections = false,
  travelMode = "WALKING",
  onMapClick,
  onUserMarkerClick,
  onDestinationMarkerClick,
  onDirectionsLoad,
  userInfoWindow,
  destinationInfoWindow,
  loadingElement = (
    <div className="flex items-center justify-center">Loading map...</div>
  ),
}) => {
  const mapRef = useRef<any>(null);
  const [directions, setDirections] = useState<any>(null);
  const [userInfoOpen, setUserInfoOpen] = useState(false);
  const [destinationInfoOpen, setDestinationInfoOpen] = useState(false);
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
  };

  const defaultMapOptions: any = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    ...mapOptions,
  };

  const onMapLoad = useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  const getTravelMode = useCallback((mode: string) => {
    if (typeof window === "undefined" || !window.google) {
      return undefined;
    }

    switch (mode) {
      case "DRIVING":
        return window.google.maps.TravelMode.DRIVING;
      case "WALKING":
        return window.google.maps.TravelMode.WALKING;
      case "BICYCLING":
        return window.google.maps.TravelMode.BICYCLING;
      case "TRANSIT":
        return window.google.maps.TravelMode.TRANSIT;
      default:
        return window.google.maps.TravelMode.WALKING;
    }
  }, []);

  const calculateDirections = useCallback(() => {
    console.log("calculateDirections called", {
      userLocation,
      destination,
      showDirections,
    });

    if (
      !userLocation ||
      !destination ||
      typeof window === "undefined" ||
      !window.google
    ) {
      console.log("Early return - missing requirements");
      return;
    }

    try {
      const directionsService = new window.google.maps.DirectionsService();
      const googleTravelMode = getTravelMode(travelMode);
      const request = {
        origin: new window.google.maps.LatLng(
          userLocation.lat,
          userLocation.lng,
        ),
        destination: new window.google.maps.LatLng(
          destination.lat,
          destination.lng,
        ),
        travelMode: googleTravelMode || google.maps.TravelMode.WALKING,
      };

      console.log("Making directions request:", request);

      directionsService.route(request, (result: any, status: string) => {
        console.log("Directions result:", { result, status });
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          console.log("✅ Setting directions");
          setDirections(result);
          if (onDirectionsLoad) {
            onDirectionsLoad(result);
          }
        } else {
          console.error("❌ Directions request failed:", status);
        }
      });
    } catch (error) {
      console.error("Error in calculateDirections:", error);
    }
  }, [userLocation, destination, travelMode, onDirectionsLoad]);

  React.useEffect(() => {
    console.log("Directions useEffect triggered", {
      showDirections,
      userLocation: !!userLocation,
      destination: !!destination,
    });

    if (showDirections && userLocation && destination) {
      const timer = setTimeout(() => {
        calculateDirections();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [showDirections, userLocation, destination, calculateDirections]);

  const mapCenter = React.useMemo(() => {
    if (userLocation) return userLocation;
    if (destination) return destination;
    return center;
  }, [center, userLocation, destination]);

  console.log("Render state:", {
    showDirections,
    hasDirections: !!directions,
    userLocation: !!userLocation,
    destination: !!destination,
  });

  return (
    <div className={cn("w-full h-full overflow-hidden", className)}>
      <LoadScript
        googleMapsApiKey={googleMapsApiKey}
        loadingElement={loadingElement}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={zoom}
          onLoad={onMapLoad}
          options={defaultMapOptions}
          onClick={onMapClick}
        >
          {userLocation && showUserMarker && (
            <Marker
              position={userLocation}
              icon={
                typeof window !== "undefined" && window.google
                  ? {
                      url:
                        "data:image/svg+xml;charset=UTF-8," +
                        encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4285F4" width="24" height="24">
                    <circle cx="12" cy="12" r="8"/>
                    <circle cx="12" cy="12" r="3" fill="white"/>
                  </svg>
                `),
                      scaledSize: new window.google.maps.Size(24, 24),
                    }
                  : undefined
              }
              onClick={() => {
                if (onUserMarkerClick) onUserMarkerClick();
                if (userInfoWindow) setUserInfoOpen(true);
              }}
            >
              {userInfoWindow && userInfoOpen && (
                <InfoWindow onCloseClick={() => setUserInfoOpen(false)}>
                  <div className="p-2">
                    {typeof userInfoWindow === "string" ? (
                      <p className="text-sm">{userInfoWindow}</p>
                    ) : (
                      userInfoWindow
                    )}
                  </div>
                </InfoWindow>
              )}
            </Marker>
          )}

          {destination && showDestinationMarker && (
            <Marker
              position={destination}
              icon={
                typeof window !== "undefined" && window.google
                  ? {
                      url:
                        "data:image/svg+xml;charset=UTF-8," +
                        encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#EA4335" width="24" height="24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                `),
                      scaledSize: new window.google.maps.Size(24, 24),
                    }
                  : undefined
              }
              onClick={() => {
                if (onDestinationMarkerClick) onDestinationMarkerClick();
                if (destinationInfoWindow) setDestinationInfoOpen(true);
              }}
            >
              {destinationInfoWindow && destinationInfoOpen && (
                <InfoWindow onCloseClick={() => setDestinationInfoOpen(false)}>
                  <div className="p-2">
                    {typeof destinationInfoWindow === "string" ? (
                      <p className="text-sm">{destinationInfoWindow}</p>
                    ) : (
                      destinationInfoWindow
                    )}
                  </div>
                </InfoWindow>
              )}
            </Marker>
          )}

          {showDirections && directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: showUserMarker || showDestinationMarker,
                polylineOptions: {
                  strokeColor: "#4285F4",
                  strokeWeight: 4,
                  strokeOpacity: 0.8,
                },
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};
