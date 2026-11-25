"use client";

import React, { useMemo, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
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
 * CityIssueMap
 * Full-screen Leaflet GIS map with category-coded pulsing markers and rich inspection popups.
 * Built with direct Leaflet lifecycle to guarantee zero "Map container is already initialized"
 * errors across React 18 Strict Mode and Turbopack Fast Refresh.
 */
export function CityIssueMap({
  issues = [],
  center = [22.3569, 91.7832], // Default Chattogram center
  zoom = 13,
  recenterTrigger = 0,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersLayerRef = useRef(null);
  const popupRootsRef = useRef([]);

  // Pre-generate category icons cache
  const iconCache = useMemo(() => {
    const cache = {};
    Object.keys(CATEGORY_COLORS).forEach((cat) => {
      cache[cat] = createCategoryPulseMarker(cat);
    });
    cache["default"] = createCategoryPulseMarker("default");
    return cache;
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current) return;

    // Safety: ensure any previous map instance on this node is removed
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    if (containerRef.current._leaflet_id) {
      delete containerRef.current._leaflet_id;
    }

    const map = L.map(containerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: false,
      scrollWheelZoom: true,
    });
    mapRef.current = map;

    L.control.zoom({ position: "topright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    return () => {
      // Clean up popup React roots
      popupRootsRef.current.forEach((root) => {
        try {
          root.unmount();
        } catch (e) {
          // ignore unmount errors on teardown
        }
      });
      popupRootsRef.current = [];

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Smooth pan and recenter when trigger increments
  useEffect(() => {
    if (mapRef.current && recenterTrigger > 0) {
      mapRef.current.flyTo(center, 14, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [recenterTrigger, center]);

  // Update incident pins when issues array changes
  useEffect(() => {
    if (!markersLayerRef.current) return;

    // Clean up previous popup roots
    popupRootsRef.current.forEach((root) => {
      try {
        root.unmount();
      } catch (e) {
        // ignore
      }
    });
    popupRootsRef.current = [];

    // Clear previous markers
    markersLayerRef.current.clearLayers();

    issues.forEach((issue) => {
      const coords = issue.location?.coordinates;
      if (!Array.isArray(coords) || coords.length < 2) return;

      const lng = coords[0];
      const lat = coords[1];

      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return;
      }

      const icon = iconCache[issue.category] || iconCache["default"];
      const marker = L.marker([lat, lng], { icon });

      // Create container element and mount interactive IssueMarkerPopup
      const popupContainer = document.createElement("div");
      const root = createRoot(popupContainer);
      root.render(<IssueMarkerPopup issue={issue} />);
      popupRootsRef.current.push(root);

      marker.bindPopup(popupContainer, {
        className: "civic-pulse-popup",
        offset: [0, -28],
        closeButton: false,
        autoPanPaddingTopLeft: L.point(16, 88),
        autoPanPaddingBottomRight: L.point(16, 92),
      });

      markersLayerRef.current.addLayer(marker);
    });
  }, [issues, iconCache]);

  return (
    <div className="civic-map-container relative w-full h-full overflow-hidden bg-slate-100 dark:bg-slate-900">
      <div
        ref={containerRef}
        className="w-full h-full z-0"
        style={{ minHeight: "100%", width: "100%" }}
      />
    </div>
  );
}

export default CityIssueMap;
