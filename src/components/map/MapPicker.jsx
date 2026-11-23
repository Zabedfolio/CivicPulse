"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
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
 * Recenter and pan map smoothly when parent lat/lng props change
 */
function MapRecenter({ lat, lng }) {
  const map = useMap();
  const prevCoordsRef = useRef([lat, lng]);

  useEffect(() => {
    if (
      Math.abs(prevCoordsRef.current[0] - lat) > 0.00005 ||
      Math.abs(prevCoordsRef.current[1] - lng) > 0.00005
    ) {
      prevCoordsRef.current = [lat, lng];
      map.flyTo([lat, lng], Math.max(map.getZoom(), 15), {
        duration: 0.8,
        easeLinearity: 0.25,
      });
    }
  }, [lat, lng, map]);

  return null;
}

/**
 * Handle map clicks to relocate pin
 */
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      const lat = parseFloat(e.latlng.lat.toFixed(6));
      const lng = parseFloat(e.latlng.lng.toFixed(6));
      onLocationSelect(lat, lng);
    },
  });

  return null;
}

/**
 * Client-only Interactive Leaflet Map Picker Component
 */
export default function MapPicker({
  latitude = 22.3384,
  longitude = 91.8317,
  onLocationSelect,
  zoom = 15,
  className = "h-[400px] w-full rounded-2xl overflow-hidden",
}) {
  const markerIcon = useMemo(() => createPulseIcon(), []);
  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();
          const lat = parseFloat(latLng.lat.toFixed(6));
          const lng = parseFloat(latLng.lng.toFixed(6));
          onLocationSelect(lat, lng);
        }
      },
    }),
    [onLocationSelect]
  );

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapRecenter lat={latitude} lng={longitude} />
        <MapClickHandler onLocationSelect={onLocationSelect} />

        <Marker
          draggable={true}
          eventHandlers={eventHandlers}
          position={[latitude, longitude]}
          ref={markerRef}
          icon={markerIcon}
        />
      </MapContainer>

      {/* Map floating instructions */}
      <div className="absolute top-3 right-3 z-[1000] pointer-events-none">
        <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium shadow-md">
          Click map or drag pin to adjust
        </span>
      </div>
    </div>
  );
}
