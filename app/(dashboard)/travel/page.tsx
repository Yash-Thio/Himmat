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

      console.log("Geocoded coordinates:", {
        start: {
          lat: startCoords.lat,
          lng: startCoords.lng,
          displayName: startCoords.displayName,
        },
        end: {
          lat: endCoords.lat,
          lng: endCoords.lng,
          displayName: endCoords.displayName,
        },
      });

      // Call your backend API with the geocoded coordinates
      // const response = await fetch(
      //   "https://router-api-53al.onrender.com/route",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       start: [40.790345, -73.969384],
      //       end: [40.80494, -73.962505],
      //       time: "18:00",
      //     }),
      //   }
      // );

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      const responseData: RouteData = await {
        start: {
          coordinates: {
            latitude: 40.790345,
            longitude: -73.969384,
          },
          safety_score: 10,
        },
        end: {
          coordinates: {
            latitude: 40.80494,
            longitude: -73.962505,
          },
          safety_score: 10,
        },
        waypoints: [
          {
            id: "562510587",
            name: "Mount Sinai Morningside",
            coordinates: {
              latitude: 40.8052353,
              longitude: -73.9614667,
            },
            safety_score: 10.6,
            address: "Amsterdam Avenue 1111",
            categories: ["hospital"],
            is_24h: true,
            waypoint_score: 9.234379247317516,
          },
          {
            id: "368047667",
            name: "FDNY Engine 76/Ladder 22/Battalion 11",
            coordinates: {
              latitude: 40.7963098,
              longitude: -73.9671525,
            },
            safety_score: 10,
            address: "West 100th Street 145-151",
            categories: ["fire_station"],
            is_24h: false,
            waypoint_score: 8.488723518911872,
          },
          {
            id: "2583212039",
            name: "Ranch Deli",
            coordinates: {
              latitude: 40.8007295,
              longitude: -73.9620287,
            },
            safety_score: 9.1,
            address: "Columbus Avenue 980",
            categories: ["convenience"],
            is_24h: false,
            waypoint_score: 7.031528041372825,
          },
          {
            id: "11978018860",
            name: "Billy’s Hot Dog Cart",
            coordinates: {
              latitude: 40.7898723,
              longitude: -73.9662631,
            },
            safety_score: 8.8,
            address: "Central Park West 327",
            categories: ["fast_food"],
            is_24h: false,
            waypoint_score: 5.982772674595897,
          },
          {
            id: "1809517487",
            name: "Duane Reade",
            coordinates: {
              latitude: 40.7933581,
              longitude: -73.9723713,
            },
            safety_score: 10,
            address: "Broadway 2522",
            categories: ["pharmacy"],
            is_24h: true,
            waypoint_score: 5.893352630475366,
          },
          {
            id: "2312065740",
            name: "Six Corners Marketplace",
            coordinates: {
              latitude: 40.8012852,
              longitude: -73.9681784,
            },
            safety_score: 9.7,
            address: "Broadway 2755",
            categories: ["convenience"],
            is_24h: true,
            waypoint_score: 5.676347443476748,
          },
          {
            id: "1825853232",
            name: "Bank of America",
            coordinates: {
              latitude: 40.7889553,
              longitude: -73.9755886,
            },
            safety_score: 10,
            address: "Broadway 2380",
            categories: ["bank"],
            is_24h: true,
            waypoint_score: 3.657697839281946,
          },
          {
            id: "4707297289",
            name: "Apple Tree Supermarket",
            coordinates: {
              latitude: 40.8094157,
              longitude: -73.9589337,
            },
            safety_score: 9.7,
            address: "Amsterdam Avenue 1225",
            categories: ["supermarket"],
            is_24h: true,
            waypoint_score: 3.1502165727351517,
          },
          {
            id: "269309227",
            name: "NYPD 20 PCT",
            coordinates: {
              latitude: 40.7840782,
              longitude: -73.975083,
            },
            safety_score: 10.6,
            address: "West 82nd Street 120",
            categories: ["police"],
            is_24h: true,
            waypoint_score: 0.18240859040324717,
          },
          {
            id: "395304938",
            name: "The Mount Sinai Hospital",
            coordinates: {
              latitude: 40.7897421,
              longitude: -73.9530515,
            },
            safety_score: 10.6,
            address: "Gustave L. Levy Place 1",
            categories: ["hospital"],
            is_24h: true,
            waypoint_score: 0,
          },
          {
            id: "1667420596",
            name: "Rite Aid",
            coordinates: {
              latitude: 40.8051525,
              longitude: -73.9545347,
            },
            safety_score: 10,
            address: "Frederick Douglass Boulevard 2170",
            categories: ["pharmacy"],
            is_24h: true,
            waypoint_score: 0,
          },
          {
            id: "271284913",
            name: "FDNY Engine 58/Ladder 26",
            coordinates: {
              latitude: 40.7989243,
              longitude: -73.9473561,
            },
            safety_score: 10,
            address: "5th Avenue 1369",
            categories: ["fire_station"],
            is_24h: false,
            waypoint_score: 0,
          },
          {
            id: "278363029",
            name: "NYPD Central Park Precinct",
            coordinates: {
              latitude: 40.7831441,
              longitude: -73.9642028,
            },
            safety_score: 10,
            address: "86th Street Transverse 1",
            categories: ["police"],
            is_24h: false,
            waypoint_score: 0,
          },
          {
            id: "6270650939",
            name: "Citibank",
            coordinates: {
              latitude: 40.7841431,
              longitude: -73.9562302,
            },
            safety_score: 9.4,
            address: " ",
            categories: ["bank"],
            is_24h: false,
            waypoint_score: 0,
          },
          {
            id: "12402813221",
            name: "Alke Café",
            coordinates: {
              latitude: 40.8003369,
              longitude: -73.9549778,
            },
            safety_score: 9.4,
            address: "Adam Clayton Powell Jr. Boulevard 1838",
            categories: ["restaurant"],
            is_24h: true,
            waypoint_score: 0,
          },
        ],
        overall_safety_score: 9.876470588235295,
        request_time: "18:00",
      };
      console.log("Route data received:", responseData);
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
      <h1 className="text-2xl font-bold mb-4">Safe Path Router</h1>

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
          <div className="mb-4 bg-gray-100 p-4 rounded">
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
