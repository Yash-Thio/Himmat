// Geocode an address to coordinates
export const geocodeAddress = async (address: string) => {
  try {
    const params = new URLSearchParams({
      q: address,
      format: "json",
      limit: "1",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent": "SafePath-App",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Geocoding response:", data);
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      return {
        coordinates: { latitude: parseFloat(lat), longitude: parseFloat(lon) },
        displayName: data[0].display_name,
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    throw new Error("Failed to convert address to coordinates");
  }
};

// Reverse geocode coordinates to an address
export const reverseGeocode = async (latitude: number, longitude: number) => {
  try {
    const params = new URLSearchParams({
      lat: latitude.toString(),
      lon: longitude.toString(),
      format: "json",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "User-Agent": "SafePath-App",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.display_name) {
      return data.display_name;
    }
    return null;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    throw new Error("Failed to convert coordinates to address");
  }
};

// Get the user's current location
export const getCurrentPosition = (): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        reject(new Error(`Unable to retrieve your location: ${error.message}`));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};