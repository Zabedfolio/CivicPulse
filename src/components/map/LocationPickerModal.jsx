"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Search,
  X,
  Check,
  Loader2,
  Navigation,
  Crosshair,
  Layers,
  Sparkles,
} from "lucide-react";
import { useReverseGeocode } from "@/hooks/useReverseGeocode";
import { CurrentLocationButton } from "./CurrentLocationButton";
import { MagneticButton } from "@/components/ui/MagneticButton";

// Dynamically import MapPicker with SSR disabled to prevent Leaflet hydration errors
const DynamicMapPicker = dynamic(() => import("./MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl flex flex-col items-center justify-center gap-3 border border-slate-200 dark:border-slate-700">
      <div className="w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-semibold text-muted">
        Initializing Municipal GIS Map...
      </span>
    </div>
  ),
});

export function LocationPickerModal({
  isOpen,
  onClose,
  initialLat = 22.3384,
  initialLng = 91.8317,
  initialAddress = "",
  onConfirmLocation,
}) {
  const [currentLat, setCurrentLat] = useState(initialLat);
  const [currentLng, setCurrentLng] = useState(initialLng);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const {
    address,
    setAddress,
    isGeocoding,
    reverseGeocode,
    searchAddress,
    searchResults,
    isSearching,
    clearSearchResults,
  } = useReverseGeocode();

  // Reset coordinates and fetch address whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentLat(initialLat);
      setCurrentLng(initialLng);
      if (initialAddress) {
        setAddress(initialAddress);
      } else {
        reverseGeocode(initialLat, initialLng, true);
      }
    }
  }, [isOpen, initialLat, initialLng, initialAddress, reverseGeocode, setAddress]);

  // Handle map interaction (drag or click)
  const handleLocationSelect = (lat, lng) => {
    setCurrentLat(lat);
    setCurrentLng(lng);
    reverseGeocode(lat, lng, false);
  };

  // Handle forward search selection
  const handleSelectSearchResult = (result) => {
    setCurrentLat(result.lat);
    setCurrentLng(result.lng);
    setAddress(result.formatted || result.displayName);
    setSearchQuery("");
    clearSearchResults();
    setIsSearchFocused(false);
  };

  // Handle GPS location found
  const handleLocationFound = ({ lat, lng }) => {
    setCurrentLat(lat);
    setCurrentLng(lng);
    reverseGeocode(lat, lng, true);
  };

  // Handle Apply / Confirm
  const handleConfirm = () => {
    if (onConfirmLocation) {
      onConfirmLocation({
        latitude: currentLat,
        longitude: currentLng,
        address: address || `Coordinates: ${currentLat.toFixed(6)}, ${currentLng.toFixed(6)}`,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-[#0D9488] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-none">
                Interactive Municipal Location Picker
              </h3>
              <p className="text-[11px] text-muted mt-0.5">
                Chattogram City Corporation • Click map or search to position pin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close location picker"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-850/60 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between relative z-30">
          {/* Forward search input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
              {isSearching ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0D9488]" />
              ) : (
                <Search className="w-3.5 h-3.5" />
              )}
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                searchAddress(e.target.value);
              }}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search street, ward, or landmark (e.g. Agrabad, GEC Circle)..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  clearSearchResults();
                }}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-muted hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Live Search Autocomplete Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden z-50 max-h-56 overflow-y-auto">
                {searchResults.map((res, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSearchResult(res)}
                    className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-teal-50/70 dark:hover:bg-teal-950/50 border-b border-slate-100 dark:border-slate-800 last:border-b-0 flex items-start gap-2 text-slate-700 dark:text-slate-200"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#0D9488] shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{res.formatted || res.displayName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Current GPS button */}
          <div className="shrink-0 flex items-center justify-end">
            <CurrentLocationButton onLocationFound={handleLocationFound} />
          </div>
        </div>

        {/* Map Container */}
        <div className="relative flex-1 min-h-[350px] sm:min-h-[420px] bg-slate-100 dark:bg-slate-950">
          <DynamicMapPicker
            latitude={currentLat}
            longitude={currentLng}
            onLocationSelect={handleLocationSelect}
            className="h-[350px] sm:h-[420px] w-full"
          />
        </div>

        {/* Bottom HUD: Geocoded Address & Confirmation */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
          {/* Resolved Address Pill & Coordinates */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-teal-50 dark:bg-teal-950 text-[#0D9488] border border-teal-200 dark:border-teal-800">
                Lat: {currentLat.toFixed(6)}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-teal-50 dark:bg-teal-950 text-[#0D9488] border border-teal-200 dark:border-teal-800">
                Lng: {currentLng.toFixed(6)}
              </span>
              {isGeocoding && (
                <span className="inline-flex items-center gap-1 text-[10px] text-muted font-medium">
                  <Loader2 className="w-2.5 h-2.5 animate-spin text-[#0D9488]" />
                  Resolving address...
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              {address || "Click anywhere on the map or drag pin to resolve address"}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            <MagneticButton
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              Cancel
            </MagneticButton>
            <MagneticButton
              variant="primary"
              size="sm"
              onClick={handleConfirm}
              className="text-xs font-bold shadow-md shadow-teal-500/15"
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              Apply Pin Location
            </MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
}
