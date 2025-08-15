"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Location {
  coordinates: Coordinates;
  safety_score: number;
  displayName?: string;
}

interface Waypoint extends Location {
  id: string;
  name: string;
  address: string;
  categories: string[];
  is_24h: boolean;
  waypoint_score: number;
}

interface RouteData {
  start: Location & { displayName?: string };
  end: Location & { displayName?: string };
  waypoints: Waypoint[];
  selectedWaypoints?: Waypoint[];
  intersectionWaypoints?: {
    coordinates: Coordinates;
    originalWaypoint: string;
  }[];
  routeSegments?: [number, number][][];
  overall_safety_score: number;
  request_time: string;
}

interface GeocodingResult {
  lat: string;
  lng: string;
  displayName: string;
}

interface GeocodingStatus {
  start: "pending" | "geocoding" | "complete" | "";
  end: "pending" | "geocoding" | "complete" | "";
}

const MapComponent = dynamic(() => import("@/components/map/map2"), {
  ssr: false,
});

export default function TravelPage() {
  const [startAddress, setStartAddress] = useState<string>("");
  const [endAddress, setEndAddress] = useState<string>("");
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [geocodingStatus, setGeocodingStatus] = useState<GeocodingStatus>({
    start: "",
    end: "",
  });
  // Function to geocode an address to coordinates using Nominatim
  const geocodeAddress = async (
    address: string
  ): Promise<GeocodingResult | null> => {
    try {
      const params = new URLSearchParams({
        q: address,
        format: "json",
        limit: "1",
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`,
        {
          headers: {
            "User-Agent": "SafePathRouter/1.0",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data) && data.length > 0) {
        return {
          lat: data[0].lat,
          lng: data[0].lon,
          displayName: data[0].display_name,
        };
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      throw new Error("Failed to geocode address");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setGeocodingStatus({ start: "pending", end: "pending" });

    try {
      // Geocode both addresses
      setGeocodingStatus((prev) => ({ ...prev, start: "geocoding" }));
      const startCoords = await geocodeAddress(startAddress);
      setGeocodingStatus((prev) => ({
        ...prev,
        start: "complete",
        end: "geocoding",
      }));
      const endCoords = await geocodeAddress(endAddress);
      setGeocodingStatus((prev) => ({ ...prev, end: "complete" }));

      // Check if geocoding was successful
      if (!startCoords) {
        setError(`Could not find location: "${startAddress}"`);
        setLoading(false);
        return;
      }

      if (!endCoords) {
        setError(`Could not find location: "${endAddress}"`);
        setLoading(false);
        return;
      }

      // console.log("Geocoded coordinates:", {
      //   start: {
      //     lat: startCoords.lat,
      //     lng: startCoords.lng,
      //     displayName: startCoords.displayName,
      //   },
      //   end: {
      //     lat: endCoords.lat,
      //     lng: endCoords.lng,
      //     displayName: endCoords.displayName,
      //   },
      // });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ROUTE_API}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            start: [startCoords.lat, startCoords.lng],
            end: [endCoords.lat, endCoords.lng],
            time: "18:00",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData: RouteData = await response.json();

      // console.log("Route data received:", responseData);
      // Add display names to the response data
      if (responseData) {
        responseData.start.displayName = startCoords.displayName;
        responseData.end.displayName = endCoords.displayName;
      }

      setRouteData(responseData);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to calculate route"
      );
      setLoading(false);
      setGeocodingStatus({ start: "", end: "" });
    }
  };

  // Status message for geocoding process
  const getStatusMessage = (): string => {
    if (geocodingStatus.start === "geocoding") {
      return "Finding start location...";
    } else if (geocodingStatus.end === "geocoding") {
      return "Finding end location...";
    } else if (loading) {
      return "Calculating safe route...";
    }
    return "";
  };

  return (
    <div className="container mx-auto p-4">

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block mb-2">Start Location:</label>
          <input
            type="text"
            placeholder="Enter an address, place, or landmark"
            value={startAddress}
            onChange={(e) => setStartAddress(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">End Location:</label>
          <input
            type="text"
            placeholder="Enter an address, place, or landmark"
            value={endAddress}
            onChange={(e) => setEndAddress(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <p className="text-sm text-gray-500 mt-1">
            Example: "Empire State Building" or "350 5th Ave, New York, NY"
          </p>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading || !startAddress || !endAddress}
        >
          {loading ? "Processing..." : "Find Safe Route"}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <p>{getStatusMessage()}</p>
          <div className="mt-2 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        </div>
      )}

      {routeData && (
        <div>
          <div className="mb-4 bg-card p-4 rounded">
            <h2 className="font-semibold mb-2">Route Information</h2>
            <p>
              <strong>From:</strong> {routeData.start.displayName}
            </p>
            <p>
              <strong>To:</strong> {routeData.end.displayName}
            </p>
            <p>
              <strong>Safety Score:</strong>{" "}
              {routeData.overall_safety_score.toFixed(2)}/10
            </p>
          </div>
          <div className="w-full h-96">
            <MapComponent routeData={routeData} />
          </div>
        </div>
      )}
    </div>
  );
}
