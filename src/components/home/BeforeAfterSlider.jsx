"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { CheckCircle2, AlertTriangle, Clock, ShieldCheck, Star, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SHOWCASES = [
  {
    id: "road",
    title: "Chittagong Port Access Road",
    category: "Road Damage",
    department: "Road Maintenance Engineering Division",
    resolvedIn: "32 Hours",
    rating: 5.0,
    beforeTag: "Deep Asphalt Pothole & Road Hazard",
    afterTag: "Civil Works Maintenance & Pothole Patching (Complete)",
    beforeImage: "/images/showcases/pothole-before.jpg",
    afterImage: "/images/showcases/pothole-after.jpg",
  },
  {
    id: "streetlight",
    title: "GEC Circle - O.R. Nizam Avenue",
    category: "Streetlight",
    department: "Municipal Electrical Works Unit",
    resolvedIn: "18 Hours",
    rating: 4.9,
    beforeTag: "Damaged Cable & Complete Blackout",
    afterTag: "Smart LED Luminaire Installed (Online)",
    beforeImage: "/images/showcases/streetlight-before.jpg",
    afterImage: "/images/showcases/streetlight-after.jpg",
  },
  {
    id: "drainage",
    title: "Agrabad Commercial Area Canal",
    category: "Drainage Failures",
    department: "Stormwater & Drainage Division",
    resolvedIn: "44 Hours",
    rating: 4.8,
    beforeTag: "Main Road Flood Waterlogging & Poor Drainage",
    afterTag: "Cleared Stormwater Drain & Resurfaced Roadway",
    beforeImage: "/images/showcases/drainage-before.jpg",
    afterImage: "/images/showcases/drainage-after.jpg",
  },
];

export function BeforeAfterSlider() {
  const [activeCase, setActiveCase] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 - 100)
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const current = SHOWCASES[activeCase];

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 border border-teal-200 text-[#0D9488] dark:bg-teal-950/60 dark:border-teal-800 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tangible Proof of Work</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Real Issues. Verified Physical Repairs.
        </h2>
        <p className="mt-3 text-sm text-muted">
          Drag the interactive slider to inspect photo evidence before municipal intervention and verified completion proofs.
        </p>

        {/* Showcase Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {SHOWCASES.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveCase(idx);
                setSliderPosition(50);
              }}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none",
                activeCase === idx
                  ? "bg-[#0D9488] text-white shadow-sm shadow-teal-500/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              )}
            >
              {item.category}: {item.title.split("-")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Dual Frame Container */}
      <div className="max-w-4xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-xl overflow-hidden p-4 sm:p-6">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          className="relative h-80 sm:h-96 rounded-2xl overflow-hidden select-none cursor-ew-resize border border-border"
        >
          {/* "AFTER" Layer (Full width underneath) */}
          <div className="absolute inset-0 select-none overflow-hidden">
            <Image
              src={current.afterImage}
              alt={current.afterTag}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
              priority
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/60 flex flex-col justify-between p-6 sm:p-8 text-white">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/80 text-white border border-emerald-400/50 backdrop-blur-md shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  AFTER (VERIFIED REPAIRED)
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-md">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  {current.rating} Citizen Rating
                </div>
              </div>

              <div className="max-w-md">
                <div className="text-xl sm:text-2xl font-extrabold text-white drop-shadow-md">
                  {current.afterTag}
                </div>
                <p className="text-xs text-teal-200 mt-1 font-medium drop-shadow">
                  Completed by {current.department} in {current.resolvedIn}
                </p>
              </div>
            </div>
          </div>

          {/* "BEFORE" Layer (Clipped dynamically by slider position) */}
          <div
            className="absolute inset-0 select-none overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <Image
              src={current.beforeImage}
              alt={current.beforeTag}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
              priority
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/60 flex flex-col justify-between p-6 sm:p-8 text-white">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-600/85 text-white border border-red-400/50 backdrop-blur-md shadow-md">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  BEFORE (CITIZEN REPORT)
                </span>
              </div>

              <div className="max-w-md">
                <div className="text-xl sm:text-2xl font-extrabold text-white drop-shadow-md">
                  {current.beforeTag}
                </div>
                <p className="text-xs text-amber-200 mt-1 font-medium drop-shadow">
                  Reported by citizen with GPS coordinates in {current.title}
                </p>
              </div>
            </div>
          </div>

          {/* Draggable Divider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_15px_rgba(0,0,0,0.5)] z-30"
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-[#0D9488] shadow-lg flex items-center justify-center font-bold text-xs ring-4 ring-black/20">
              <div className="flex items-center gap-0.5">
                <ChevronLeft className="w-3 h-3 -mr-1" />
                <ChevronRight className="w-3 h-3 -ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Meta Details */}
        <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
            <span>
              Official municipal work order verified on {current.title}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="inline-flex items-center gap-1 text-[#0D9488]">
              <Clock className="w-3.5 h-3.5" />
              Fixed in {current.resolvedIn}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600 dark:text-slate-300">
              Audited by Municipal Supervisor
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BeforeAfterSlider;
