"use client";

import React, { useState } from "react";
import { PhoneCall, AlertTriangle, X, ChevronRight, Zap, Droplet, Flame } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function EmergencyHotlineBar() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="bg-gradient-to-r from-red-600 via-amber-600 to-rose-700 text-white text-xs font-medium py-2 px-4 shadow-sm relative z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300" />
            </span>
            <span className="font-bold uppercase tracking-wider text-[11px] bg-black/20 px-2 py-0.5 rounded-full">
              Urgent Hazard Hotlines
            </span>
            <span className="hidden sm:inline text-white/90">
              For immediate life-safety emergencies, do not wait for an app triage:
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto py-0.5">
            <a
              href="tel:999"
              className="inline-flex items-center gap-1 font-bold text-amber-200 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>National: 999</span>
            </a>
            <span className="text-white/40">|</span>
            <a
              href="tel:16116"
              className="inline-flex items-center gap-1 text-white hover:text-amber-200 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Electric Wire: 16116</span>
            </a>
            <span className="text-white/40 hidden md:inline">|</span>
            <a
              href="tel:16162"
              className="hidden md:inline-flex items-center gap-1 text-white hover:text-amber-200 transition-colors"
            >
              <Droplet className="w-3.5 h-3.5 text-cyan-200" />
              <span>Water Burst: 16162</span>
            </a>
            <span className="text-white/40 hidden lg:inline">|</span>
            <a
              href="tel:16496"
              className="hidden lg:inline-flex items-center gap-1 text-white hover:text-amber-200 transition-colors"
            >
              <Flame className="w-3.5 h-3.5 text-orange-300" />
              <span>Gas Leak: 16496</span>
            </a>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 rounded hover:bg-black/20 text-white/80 hover:text-white transition-colors ml-1"
              aria-label="Dismiss hotline bar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}

export default EmergencyHotlineBar;
