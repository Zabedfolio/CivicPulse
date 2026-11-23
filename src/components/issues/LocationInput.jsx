"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Crosshair, Check, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESET_LOCATIONS = [
  { label: "Ctg Port Access Road", address: "Chittagong Port Access Rd, Ward 36", lat: 22.3384, lng: 91.8317 },
  { label: "GEC Circle, Ctg", address: "GEC Circle, Nasirabad, Ward 15", lat: 22.3585, lng: 91.8213 },
  { label: "Agrabad C/A", address: "Agrabad Commercial Area, Ward 24", lat: 22.3245, lng: 91.8122 },
  { label: "Dhanmondi, Dhaka", address: "Road 27, Dhanmondi, Ward 15, Dhaka", lat: 23.7465, lng: 90.3760 },
];

export function LocationInput({
  address,
  onAddressChange,
  latitude,
  longitude,
  onCoordinatesChange,
  errors = {},
}) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [geoNotice, setGeoNotice] = useState("");

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoNotice("Geolocation is not supported by your browser.");
      return;
    }

    setIsDetecting(true);
    setGeoNotice("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(6));
        const lng = parseFloat(position.coords.longitude.toFixed(6));
        onCoordinatesChange(lat, lng);
        if (!address.trim()) {
          onAddressChange(`GPS Coordinates: ${lat}, ${lng} (Auto-detected)`);
        }
        setIsDetecting(false);
        setGeoNotice("GPS location accurately pinned!");
        setTimeout(() => setGeoNotice(""), 4000);
      },
      (err) => {
        setIsDetecting(false);
        setGeoNotice("Unable to detect GPS. Please pick a preset or enter manually.");
        console.warn("Geolocation warning:", err);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleApplyPreset = (preset) => {
    onAddressChange(preset.address);
    onCoordinatesChange(preset.lat, preset.lng);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label
          htmlFor="issue-address"
          className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider"
        >
          3. Incident Location &amp; Ward <span className="text-rose-500">*</span>
        </label>
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={isDetecting}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/80 text-[#0D9488] border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors shadow-xs"
        >
          {isDetecting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Detecting GPS...</span>
            </>
          ) : (
            <>
              <Crosshair className="w-3.5 h-3.5" />
              <span>1-Click GPS Detect</span>
            </>
          )}
        </button>
      </div>

      {/* Street Address Input */}
      <div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
            <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <input
            id="issue-address"
            type="text"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="e.g. In front of Ward 21 Community Center, Chittagong Port Access Road"
            className={`w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors focus:outline-none ${
              errors.address
                ? "border-rose-500 focus:border-rose-500"
                : "border-border focus:border-teal-500"
            }`}
          />
        </div>
        {errors.address && (
          <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.address}</p>
        )}
      </div>

      {/* Preset Location Chips */}
      <div>
        <div className="text-[11px] font-semibold text-muted mb-1.5">
          Quick Landmark Presets:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_LOCATIONS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950/60 hover:text-teal-700 border border-border transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lat & Long Coordinate Readouts */}
      <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-border">
        <div>
          <label className="block text-[11px] font-bold text-muted mb-1">
            Latitude (-90° to 90°)
          </label>
          <input
            type="number"
            step="0.000001"
            value={latitude ?? ""}
            onChange={(e) => onCoordinatesChange(parseFloat(e.target.value) || 0, longitude)}
            className="w-full px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-muted mb-1">
            Longitude (-180° to 180°)
          </label>
          <input
            type="number"
            step="0.000001"
            value={longitude ?? ""}
            onChange={(e) => onCoordinatesChange(latitude, parseFloat(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {geoNotice && (
        <div className="text-xs text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" />
          <span>{geoNotice}</span>
        </div>
      )}
    </div>
  );
}

export default LocationInput;
