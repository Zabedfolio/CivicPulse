"use client";

import React, { useState } from "react";
import { Crosshair, Loader2, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function CurrentLocationButton({ onLocationFound, className = "" }) {
  const [status, setStatus] = useState("idle"); // "idle" | "detecting" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatus("error");
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }

    setStatus("detecting");
    setErrorMessage("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        setStatus("success");
        if (onLocationFound) {
          onLocationFound({ lat, lng, accuracy: pos.coords.accuracy });
        }
        setTimeout(() => setStatus("idle"), 3000);
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setStatus("error");
        if (err.code === 1) {
          setErrorMessage("Location permission denied. Please allow GPS access.");
        } else if (err.code === 2) {
          setErrorMessage("Position unavailable. Check your network or device GPS.");
        } else {
          setErrorMessage("Location detection timed out.");
        }
        setTimeout(() => {
          setStatus("idle");
          setErrorMessage("");
        }, 5000);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleGetCurrentLocation}
        disabled={status === "detecting"}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md",
          status === "idle" &&
            "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750",
          status === "detecting" &&
            "bg-teal-50 dark:bg-teal-950 text-[#0D9488] border border-teal-300 dark:border-teal-700 cursor-wait",
          status === "success" &&
            "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-300",
          status === "error" &&
            "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-300",
          className
        )}
        title="Detect and center current GPS location"
      >
        {status === "detecting" && (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0D9488]" />
            <span>Finding GPS...</span>
          </>
        )}
        {status === "idle" && (
          <>
            <Crosshair className="w-3.5 h-3.5 text-[#0D9488]" />
            <span>My GPS Location</span>
          </>
        )}
        {status === "success" && (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span>GPS Locked</span>
          </>
        )}
        {status === "error" && (
          <>
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>GPS Failed</span>
          </>
        )}
      </button>

      {errorMessage && (
        <div className="absolute left-0 bottom-full mb-2 z-50 whitespace-nowrap px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-medium shadow-lg animate-in fade-in">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
