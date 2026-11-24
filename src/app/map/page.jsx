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
    <div className="relative w-full h-[calc(100vh-4rem)] sm:h-screen pt-16 sm:pt-0 overflow-hidden bg-slate-900">
      {/* Top Header Floating Overlay */}
      <div className="absolute top-20 sm:top-6 left-4 sm:left-6 z-[1000] flex flex-col sm:flex-row sm:items-center gap-2 pointer-events-auto">
        <div className="px-4 py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-xl flex items-center gap-3">
          <div className="size-8 rounded-xl bg-teal-50 dark:bg-teal-950 text-[#0D9488] flex items-center justify-center font-bold">
            <MapPin className="size-4" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                Chattogram GIS Municipal Incident Map
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Feed
              </span>
            </div>
            <p className="text-[10px] text-muted">
              Spatial density across 41 CCC municipal wards
            </p>
          </div>
        </div>

        <MagneticButton
          variant="primary"
          size="sm"
          href="/issues/new"
          className="text-xs font-bold shadow-lg shadow-teal-500/20 shrink-0 self-start sm:self-auto"
        >
          <Plus className="size-3.5 mr-1.5" />
          Report Incident
        </MagneticButton>
      </div>

      {/* Main Interactive Leaflet Map */}
      <div className="w-full h-full">
        <CityIssueMap
          issues={pins}
          center={[22.3569, 91.7832]}
          zoom={13}
          recenterTrigger={recenterTrigger}
        />
      </div>

      {/* Floating Layer Filter Dock */}
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
