"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Creates an authentic GovTech pulse marker icon
 */
function createPulseIcon() {
  return L.divIcon({
    className: "civic-pulse-marker",
    iconSize: [36, 46],
    iconAnchor: [18, 44],
    popupAnchor: [0, -42],
    html: `
      <div style="position: relative; width: 36px; height: 46px; display: flex; align-items: center; justify-content: center;">
        <!-- Pulsing wave effect -->
        <div style="position: absolute; top: 12px; left: 6px; width: 24px; height: 24px; border-radius: 50%; background: rgba(13, 148, 136, 0.35); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <!-- Shadow base -->
        <div style="position: absolute; bottom: 0; left: 10px; width: 16px; height: 5px; background: rgba(0,0,0,0.25); border-radius: 50%; filter: blur(1.5px);"></div>
        <!-- Pin SVG -->
        <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: relative; z-index: 10; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));">
          <path d="M17 0C7.611 0 0 7.611 0 17C0 27.5 14.5 40.5 16.1 41.9C16.6 42.3 17.4 42.3 17.9 41.9C19.5 40.5 34 27.5 34 17C34 7.611 26.389 0 17 0Z" fill="#0D9488"/>
          <path d="M17 2C8.716 2 2 8.716 2 17C2 26 15 37.8 17 39.5C19 37.8 32 26 32 17C32 8.716 25.284 2 17 2Z" fill="#0F766E"/>
          <circle cx="17" cy="16" r="6" fill="#FFFFFF"/>
          <circle cx="17" cy="16" r="3" fill="#0D9488"/>
        </svg>
      </div>
    `,
  });
}

/**
 * Client-only Interactive Leaflet Map Picker Component
 * Uses resilient direct Leaflet lifecycle to eliminate "Map container is already initialized"
 * across React StrictMode, Fast Refresh, and Modal unmount/remount cycles.
 */
export default function MapPicker({
  latitude = 22.3384,
  longitude = 91.8317,
  onLocationSelect,
  zoom = 15,
  className = "h-[400px] w-full rounded-2xl overflow-hidden",
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onSelectRef = useRef(onLocationSelect);

  // Keep latest onLocationSelect callback ref
  useEffect(() => {
    onSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

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
      center: [latitude, longitude],
      zoom: zoom,
      scrollWheelZoom: true,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const icon = createPulseIcon();
    const marker = L.marker([latitude, longitude], {
      draggable: true,
      icon: icon,
    }).addTo(map);
    markerRef.current = marker;

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      const lat = parseFloat(pos.lat.toFixed(6));
      const lng = parseFloat(pos.lng.toFixed(6));
      if (onSelectRef.current) {
        onSelectRef.current(lat, lng);
      }
    });

    map.on("click", (e) => {
      const lat = parseFloat(e.latlng.lat.toFixed(6));
      const lng = parseFloat(e.latlng.lng.toFixed(6));
      marker.setLatLng([lat, lng]);
      if (onSelectRef.current) {
        onSelectRef.current(lat, lng);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Smooth pan and update marker position when lat/lng props change from geocoding or GPS
  useEffect(() => {
    if (markerRef.current) {
      const currentPos = markerRef.current.getLatLng();
      if (
        Math.abs(currentPos.lat - latitude) > 0.00005 ||
        Math.abs(currentPos.lng - longitude) > 0.00005
      ) {
        markerRef.current.setLatLng([latitude, longitude]);
      }
    }
    if (mapRef.current) {
      const currentCenter = mapRef.current.getCenter();
      if (
        Math.abs(currentCenter.lat - latitude) > 0.00005 ||
        Math.abs(currentCenter.lng - longitude) > 0.00005
      ) {
        mapRef.current.flyTo([latitude, longitude], Math.max(mapRef.current.getZoom(), 15), {
          duration: 0.8,
          easeLinearity: 0.25,
        });
      }
    }
  }, [latitude, longitude]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      />

      {/* Map floating instructions */}
      <div className="absolute top-3 right-3 z-[1000] pointer-events-none">
        <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium shadow-md">
          Click map or drag pin to adjust
        </span>
      </div>
    </div>
  );
}
