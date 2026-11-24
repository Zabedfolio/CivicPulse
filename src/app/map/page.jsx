"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  MapPin,
  Plus,
  Layers,
  Sparkles,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Building2,
} from "lucide-react";
import { MapLayerFilterBar } from "@/components/map/MapLayerFilterBar";
import { MagneticButton } from "@/components/ui/MagneticButton";

// Dynamic import with SSR disabled for Leaflet window compatibility
const CityIssueMap = dynamic(
  () => import("@/components/map/CityIssueMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 text-muted">
        <Loader2 className="size-8 animate-spin text-[#0D9488] mb-3" />
        <span className="text-xs font-bold uppercase tracking-wider">
          Initializing Chattogram Municipal GIS Map...
        </span>
      </div>
    ),
  }
);

export default function PublicCityMapPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [pins, setPins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  // Fetch lightweight pins from backend
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const queryParams = new URLSearchParams();
    if (selectedCategory !== "all") queryParams.set("category", selectedCategory);
    if (selectedStatus !== "all") queryParams.set("status", selectedStatus);

    fetch(`http://localhost:5000/api/v1/issues/map/pins?${queryParams.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch map pins");
        return res.json();
      })
      .then((json) => {
        if (isMounted) {
          setPins(json.data?.pins || []);
        }
      })
      .catch((err) => {
        console.warn("Map pins notice:", err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedStatus]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900">
      {/* Main Interactive Leaflet Map (100% Unobstructed Full-Bleed Viewport) */}
      <div className="w-full h-full">
        <CityIssueMap
          issues={pins}
          center={[22.3569, 91.7832]}
          zoom={13}
          recenterTrigger={recenterTrigger}
        />
      </div>

      {/* Floating Layer Filter & Command Dock */}
      <MapLayerFilterBar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        visibleCount={pins.length}
        onRecenter={() => setRecenterTrigger((prev) => prev + 1)}
      />
    </div>
  );
}
