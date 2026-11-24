"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { IssueMarkerPopup } from "./IssueMarkerPopup";

const CATEGORY_COLORS = {
  "Road Damage": "#EF4444",
  Streetlight: "#EAB308",
  Drainage: "#3B82F6",
  Footpath: "#A855F7",
  "Waste Management": "#10B981",
  "Public Infrastructure": "#64748B",
};

/**
 * Creates an authentic Motion Brew pulsing category marker
 */
function createCategoryPulseMarker(category) {
  const color = CATEGORY_COLORS[category] || "#0D9488";

  return L.divIcon({
    className: "civic-pulse-category-pin",
    iconSize: [36, 46],
    iconAnchor: [18, 44],
    popupAnchor: [0, -42],
    html: `
      <div style="position: relative; width: 36px; height: 46px; display: flex; align-items: center; justify-content: center;">
        <!-- Pulsing wave -->
        <div style="position: absolute; top: 12px; left: 6px; width: 24px; height: 24px; border-radius: 50%; background: ${color}; opacity: 0.35; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <!-- Shadow base -->
        <div style="position: absolute; bottom: 0; left: 10px; width: 16px; height: 5px; background: rgba(0,0,0,0.25); border-radius: 50%; filter: blur(1.5px);"></div>
        <!-- Pin SVG -->
        <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: relative; z-index: 10; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.25));">
          <path d="M17 0C7.611 0 0 7.611 0 17C0 27.5 14.5 40.5 16.1 41.9C16.6 42.3 17.4 42.3 17.9 41.9C19.5 40.5 34 27.5 34 17C34 7.611 26.389 0 17 0Z" fill="${color}"/>
          <path d="M17 2C8.716 2 2 8.716 2 17C2 26 15 37.8 17 39.5C19 37.8 32 26 32 17C32 8.716 25.284 2 17 2Z" fill="rgba(0,0,0,0.18)"/>
          <circle cx="17" cy="16" r="6" fill="#FFFFFF"/>
          <circle cx="17" cy="16" r="3" fill="${color}"/>
        </svg>
      </div>
    `,
  });
}

/**
 * Controller to handle smooth pan and recentering
 */
function MapCenterController({ recenterTrigger, centerCoords }) {
  const map = useMap();

  useEffect(() => {
    if (recenterTrigger > 0) {
      map.flyTo(centerCoords, 14, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [recenterTrigger, centerCoords, map]);

  return null;
}

/**
 * CityIssueMap
 * Full-screen Leaflet GIS map with category-coded pulsing markers and rich inspection popups
 */
export function CityIssueMap({
  issues = [],
  center = [22.3569, 91.7832], // Default Chattogram center
  zoom = 13,
  recenterTrigger = 0,
}) {
  const [isMounted, setIsMounted] = useState(false);

  // Guard against React 18 Strict Mode and Fast Refresh double-initialization
  useEffect(() => {
    const el = document.getElementById("city-issue-map-container");
    if (el && el._leaflet_id) {
      el._leaflet_id = null;
    }
    setIsMounted(true);

    return () => {
      const container = document.getElementById("city-issue-map-container");
      if (container && container._leaflet_id) {
        container._leaflet_id = null;
      }
    };
  }, []);

  // Pre-generate category icons cache
  const iconCache = useMemo(() => {
    const cache = {};
    Object.keys(CATEGORY_COLORS).forEach((cat) => {
      cache[cat] = createCategoryPulseMarker(cat);
    });
    cache["default"] = createCategoryPulseMarker("default");
    return cache;
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 text-muted">
        <div className="size-8 rounded-full border-2 border-[#0D9488] border-t-transparent animate-spin mb-3" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Initializing Chattogram GIS Map...
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-100 dark:bg-slate-900">
      <MapContainer
        id="city-issue-map-container"
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ minHeight: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        <MapCenterController
          recenterTrigger={recenterTrigger}
          centerCoords={center}
        />

        {/* Issue Markers */}
        {issues.map((issue) => {
          const coords = issue.location?.coordinates;
          if (!Array.isArray(coords) || coords.length < 2) return null;

          const lng = coords[0];
          const lat = coords[1];

          if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            return null;
          }

          const icon = iconCache[issue.category] || iconCache["default"];

          return (
            <Marker
              key={issue._id}
              position={[lat, lng]}
              icon={icon}
            >
              <Popup
                className="civic-pulse-popup"
                offset={[0, -28]}
                closeButton={false}
              >
                <IssueMarkerPopup issue={issue} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default CityIssueMap;
