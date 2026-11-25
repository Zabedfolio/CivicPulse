"use client";


import { API_BASE_URL } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Copy, ArrowRight, Loader2, ShieldAlert } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

/**
 * DuplicateAlertBanner (Motion Brew AlertBannerBounce)
 * Real-time proximity duplicate warning banner powered by 2dsphere geospatial search
 */
export function DuplicateAlertBanner({
  issue,
  onOpenComparison,
  className = "",
}) {
  const [nearbyDuplicates, setNearbyDuplicates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasQueried, setHasQueried] = useState(false);

  useEffect(() => {
    if (!issue) return;

    const coords = issue.location?.coordinates;
    const lng = coords ? coords[0] : issue.longitude;
    const lat = coords ? coords[1] : issue.latitude;

    if (lat === undefined || lng === undefined) return;

    let isMounted = true;
    setIsLoading(true);

    const queryParams = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      radius: "50",
      category: issue.category || "",
      excludeId: issue._id || "",
    });

    fetch(`${API_BASE_URL}/issues/nearby?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (data.success && Array.isArray(data.data?.issues)) {
            setNearbyDuplicates(data.data.issues);
          }
          setIsLoading(false);
          setHasQueried(true);
        }
      })
      .catch((err) => {
        console.warn("Proximity duplicate check error:", err);
        if (isMounted) {
          setIsLoading(false);
          setHasQueried(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [issue]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 text-amber-700 dark:text-amber-300 text-xs">
        <Loader2 className="size-3.5 animate-spin" />
        <span>Scanning 50m radius for duplicate infrastructure reports...</span>
      </div>
    );
  }

  if (!hasQueried || nearbyDuplicates.length === 0) {
    return null;
  }

  const closest = nearbyDuplicates[0];
  const count = nearbyDuplicates.length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -4 }}
        transition={{
          type: "spring",
          stiffness: 450,
          damping: 28,
        }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50 via-amber-100/70 to-orange-50 dark:from-amber-950/60 dark:via-amber-900/40 dark:to-orange-950/40 border border-amber-300/80 dark:border-amber-700/60 p-4 shadow-sm ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-xl bg-amber-200/80 dark:bg-amber-800/60 text-amber-800 dark:text-amber-200 flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="size-5 text-amber-700 dark:text-amber-300 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Proximity Duplicate Flag
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-200/90 dark:bg-amber-800/80 text-amber-900 dark:text-amber-100">
                  {count} match{count > 1 ? "es" : ""} found
                </span>
              </div>
              <p className="mt-0.5 text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed font-medium">
                {count === 1
                  ? `An active ${issue.category} report was filed just ${closest.distanceMeters ?? "a few"}m from here.`
                  : `${count} matching ${issue.category} reports found within 50m (closest is ${closest.distanceMeters ?? "few"}m away).`}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
            <MagneticButton
              variant="secondary"
              size="sm"
              onClick={() => onOpenComparison?.(nearbyDuplicates)}
              className="!bg-white dark:!bg-slate-900 !text-amber-900 dark:!text-amber-100 !border-amber-300 dark:!border-amber-700 hover:!bg-amber-50 dark:hover:!bg-slate-800 text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <Copy className="size-3.5 text-amber-600 dark:text-amber-400" />
              <span>Review Duplicates ({count})</span>
              <ArrowRight className="size-3" />
            </MagneticButton>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default DuplicateAlertBanner;
