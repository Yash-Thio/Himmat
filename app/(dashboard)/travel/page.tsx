"use client";
import React, { useState, useEffect } from "react";
import {Map, LatLng} from "@/components/map/map";
// import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

// function page() {
//   const containerStyle = {
//     width: "100%",
//     height: "100%",
//   };

//   const center = {
//     lat: -3.745,
//     lng: -38.523,
//   };
//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
//   })

//   const [map, setMap] = React.useState(null)

//   const onLoad = React.useCallback(function callback(map) {
//     const bounds = new window.google.maps.LatLngBounds(center)
//     map.fitBounds(bounds)

//     setMap(map)
//   }, [])

//   const onUnmount = React.useCallback(function callback(map) {
//     setMap(null)
//   }, [])

//   return isLoaded ? (
//     <GoogleMap
//       mapContainerStyle={containerStyle}
//       center={center}
//       zoom={5}
//       onLoad={onLoad}
//       onUnmount={onUnmount}
//     >
//       {/* Child components, such as markers, info windows, etc. */}
//       <></>
//     </GoogleMap>
//   ) : (
//     <></>
//   )
// }

// export default page;

export default function TravelPage() {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      setIsLoadingLocation(false);
      return;
    }

    // Options for geolocation
    const options: PositionOptions = {
      enableHighAccuracy: true, // Use GPS if available
      timeout: 10000, // Timeout after 10 seconds
      maximumAge: 60000, // Cache location for 1 minute
    };

    // Success callback
    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setUserLocation({
        lat: latitude,
        lng: longitude,
      });
      setLocationError(null);
      setIsLoadingLocation(false);
      console.log("User location obtained:", { lat: latitude, lng: longitude });
    };

    // Error callback
    const handleError = (error: GeolocationPositionError) => {
      setIsLoadingLocation(false);
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setLocationError("Location access denied by user.");
          break;
        case error.POSITION_UNAVAILABLE:
          setLocationError("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          setLocationError("Location request timed out.");
          break;
        default:
          setLocationError("An unknown error occurred while retrieving location.");
          break;
      }
      console.error("Geolocation error:", error);
    };

    // Get current position
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
  }, []);

  // Retry function for location access
  const retryLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          lat: latitude,
          lng: longitude,
        });
        setLocationError(null);
        setIsLoadingLocation(false);
      },
      (error) => {
        setIsLoadingLocation(false);
        setLocationError("Failed to get location. Please enable location access.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0, // Don't use cached location on retry
      }
    );
  };

  // Loading state
  if (isLoadingLocation) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Getting your location...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (locationError && !userLocation) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">Location Error</p>
            <p className="text-sm">{locationError}</p>
          </div>
          <button
            onClick={retryLocation}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Try Again
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Please enable location access in your browser settings to use this feature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <Map
        className="w-full h-full"
        userLocation={userLocation || undefined}
        showUserMarker={true}
        destination={{ lat: 22.565005, lng: 88.486721 }}
        showDirections={true}
        zoom={15} // Closer zoom since we have user's exact location
        userInfoWindow="You are here!"
        onUserMarkerClick={() => {
          console.log("User marker clicked!");
        }}
      />
    </div>
  );
}
