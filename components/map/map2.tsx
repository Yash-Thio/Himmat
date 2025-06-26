import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  LayerGroup,
  FeatureGroup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const defaultIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const waypointIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

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
  start: Location;
  end: Location;
  waypoints: Waypoint[];
  selectedWaypoints?: Waypoint[];
  intersectionWaypoints?: { coordinates: Coordinates; originalWaypoint: string }[];
  routeSegments?: [number, number][][];
  overall_safety_score: number;
}

interface MapComponentProps {
  routeData: RouteData;
}

function MapViewController({ center, bounds }: { center: [number, number]; bounds?: L.LatLngBounds }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      try {
        map.fitBounds(bounds, { padding: [20, 20] });
      } catch (error) {
        console.warn("Error fitting bounds:", error);
        map.setView(center, 13);
      }
    } else {
      map.setView(center, 13);
    }
  }, [center, bounds, map]);
  
  return null;
}

function RouteLayer({ 
  path, 
  safetyScore 
}: { 
  path: [number, number][]; 
  safetyScore: number; 
}) {
  const getSafetyColor = (score: number) => {
    if (score >= 8) return "#28a745";
    if (score >= 6) return "#ffc107";
    return "#dc3545";
  };

  if (path.length === 0) return null;

  return (
    <FeatureGroup>
      <Polyline
        positions={path}
        pathOptions={{
          color: getSafetyColor(safetyScore),
          weight: 4,
          opacity: 0.7,
          dashArray: safetyScore < 6 ? "10, 10" : undefined,
        }}
      />
    </FeatureGroup>
  );
}

function EndpointsLayer({ start, end }: { start: Location; end: Location }) {
  const startCoords: [number, number] = [
    start.coordinates.latitude,
    start.coordinates.longitude,
  ];
  const endCoords: [number, number] = [
    end.coordinates.latitude,
    end.coordinates.longitude,
  ];

  return (
    <FeatureGroup>
      <Marker position={startCoords} icon={defaultIcon}>
        <Popup>
          <div>
            <strong>{start.displayName || "Start"}</strong><br />
            Safety Score: {start.safety_score.toFixed(2)}
          </div>
        </Popup>
      </Marker>
      <Marker position={endCoords} icon={defaultIcon}>
        <Popup>
          <div>
            <strong>{end.displayName || "End"}</strong><br />
            Safety Score: {end.safety_score.toFixed(2)}
          </div>
        </Popup>
      </Marker>
    </FeatureGroup>
  );
}

function WaypointsLayer({ waypoints }: { waypoints: Waypoint[] }) {
  if (!waypoints || waypoints.length === 0) return null;
  
  const displayWaypoints = waypoints
    .sort((a, b) => b.waypoint_score - a.waypoint_score)
    .slice(0, 3);

  return (
    <FeatureGroup>
      {displayWaypoints.map((waypoint, index) => (
        <Marker
          key={`waypoint-${waypoint.id}-${index}`}
          position={[waypoint.coordinates.latitude, waypoint.coordinates.longitude]}
          icon={waypointIcon}
        >
          <Popup>
            <div>
              <strong>{waypoint.name}</strong><br />
              {waypoint.address && (
                <>
                  {waypoint.address}<br />
                </>
              )}
              Safety Score: {waypoint.safety_score.toFixed(2)}<br />
              <span style={{ color: waypoint.is_24h ? 'green' : 'orange' }}>
                {waypoint.is_24h ? "24 Hours" : "Limited Hours"}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </FeatureGroup>
  );
}

const MapComponent: React.FC<MapComponentProps> = ({ routeData }) => {
  const [walkingPath, setWalkingPath] = useState<[number, number][]>([]);
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const routeDataRef = useRef<string>("");

  const startCoords: [number, number] = [
    routeData.start.coordinates.latitude,
    routeData.start.coordinates.longitude,
  ];
  const endCoords: [number, number] = [
    routeData.end.coordinates.latitude,
    routeData.end.coordinates.longitude,
  ];
  const center: [number, number] = [
    (startCoords[0] + endCoords[0]) / 2,
    (startCoords[1] + endCoords[1]) / 2,
  ];

  const decodePolyline = useCallback((encoded: string): [number, number][] => {
    let index = 0, lat = 0, lng = 0;
    const coordinates: [number, number][] = [];
    const factor = 1e5;

    while (index < encoded.length) {
      let result = 0, shift = 0, byte;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      lat += result & 1 ? ~(result >> 1) : result >> 1;

      result = 0;
      shift = 0;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      lng += result & 1 ? ~(result >> 1) : result >> 1;

      coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
  }, []);

  const createTripWaypointSequence = useCallback(() => {
    const waypointsToUse = routeData.selectedWaypoints || routeData.waypoints;
    const sequence: [number, number][] = [startCoords];

    if (waypointsToUse && waypointsToUse.length > 0) {
      const selected = [...waypointsToUse]
        .sort((a, b) => b.waypoint_score - a.waypoint_score)
        .slice(0, 3);
      for (const wp of selected) {
        sequence.push([wp.coordinates.latitude, wp.coordinates.longitude]);
      }
    }
    sequence.push(endCoords);
    return sequence;
  }, [routeData.selectedWaypoints, routeData.waypoints, startCoords, endCoords]);

  const fetchRoute = useCallback(async (waypointSequence: [number, number][]) => {
    setIsLoading(true);
    const coords = waypointSequence.map(p => `${p[1]},${p[0]}`).join(";");
    const url = `https://router.project-osrm.org/trip/v1/walking/${coords}?overview=full&geometries=polyline&source=first&destination=last&roundtrip=false`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      if (data.trips?.length && data.trips[0].geometry) {
        const decodedPath = decodePolyline(data.trips[0].geometry);
        setWalkingPath(decodedPath);
        
        if (decodedPath.length > 0) {
          const bounds = new L.LatLngBounds(decodedPath);
          setMapBounds(bounds);
        }
      } else {
        throw new Error("No valid route geometry found");
      }
    } catch (error) {
      console.warn("Route fetching failed, using direct path:", error);
      setWalkingPath(waypointSequence);
      
      if (waypointSequence.length > 0) {
        const bounds = new L.LatLngBounds(waypointSequence);
        setMapBounds(bounds);
      }
    } finally {
      setIsLoading(false);
    }
  }, [decodePolyline]);

  useEffect(() => {
    const routeDataString = JSON.stringify(routeData);
    
    if (routeDataString !== routeDataRef.current) {
      routeDataRef.current = routeDataString;
      const sequence = createTripWaypointSequence();
      fetchRoute(sequence);
    }
  }, [routeData, createTripWaypointSequence, fetchRoute]);

  const waypointsToDisplay = routeData.selectedWaypoints || routeData.waypoints;

  return (
    <div style={{ height: "500px", width: "100%", position: "relative" }}>
      {isLoading && (
        <div style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "rgba(255, 255, 255, 0.9)",
          padding: "10px",
          borderRadius: "5px",
          zIndex: 1000,
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
        }}>
          Loading route...
        </div>
      )}
      
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="leaflet-map"
      >
        <MapViewController center={center} bounds={mapBounds || undefined} />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <LayerGroup>
          <RouteLayer 
            path={walkingPath} 
            safetyScore={routeData.overall_safety_score} 
          />
          
          <EndpointsLayer 
            start={routeData.start} 
            end={routeData.end} 
          />
          
          {waypointsToDisplay && waypointsToDisplay.length > 0 && (
            <WaypointsLayer waypoints={waypointsToDisplay} />
          )}
        </LayerGroup>
      </MapContainer>
      
      {/* <div style={{ 
        marginTop: "10px", 
        padding: "10px", 
        border: "1px solid #ccc", 
        borderRadius: "5px",
        backgroundColor: "#f9f9f9"
      }}>
        <h4 style={{ marginTop: 0, marginBottom: "10px" }}>Safety Legend</h4>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
          <div style={{ width: "20px", height: "5px", backgroundColor: "#28a745", marginRight: "10px" }}></div>
          <span>High Safety (8-10)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
          <div style={{ width: "20px", height: "5px", backgroundColor: "#ffc107", marginRight: "10px" }}></div>
          <span>Medium Safety (6-8)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "20px", height: "5px", backgroundColor: "#dc3545", marginRight: "10px" }}></div>
          <span>Low Safety (0-6)</span>
        </div>
        <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
          Overall Safety Score: <strong>{routeData.overall_safety_score.toFixed(2)}</strong>
        </div>
      </div> */}
    </div>
  );
};

export default MapComponent;