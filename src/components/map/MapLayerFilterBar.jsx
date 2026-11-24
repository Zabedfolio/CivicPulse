"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Layers,
  Filter,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Droplets,
  Footprints,
  Trash2,
  Building2,
  Sparkles,
  MapPin,
  Plus,
} from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const CATEGORIES = [
  { id: "all", label: "All Categories", color: "#0D9488" },
  { id: "Road Damage", label: "Road Damage", color: "#EF4444" },
  { id: "Streetlight", label: "Streetlight", color: "#EAB308" },
  { id: "Drainage", label: "Drainage", color: "#3B82F6" },
  { id: "Footpath", label: "Footpath", color: "#A855F7" },
  { id: "Waste Management", label: "Waste", color: "#10B981" },
  { id: "Public Infrastructure", label: "Civil Works", color: "#64748B" },
];

const STATUSES = [
  { id: "all", label: "All Status" },
  { id: "Submitted", label: "Submitted" },
  { id: "Under Review", label: "Review" },
  { id: "In Progress", label: "In Progress" },
  { id: "Resolved", label: "Resolved" },
];

/**
 * MapLayerFilterBar (Motion Brew Dock)
 * Floating control dock for category layer toggling, status filters, and recenter navigation
 */
export function MapLayerFilterBar({
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  visibleCount = 0,
  onRecenter,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute bottom-6 left-0 right-0 mx-auto z-[1000] w-[95%] max-w-4xl pointer-events-auto"
    >
      <div className="p-3 sm:p-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-2xl space-y-2.5">
        {/* Top Control Bar: GIS Branding + Status Filter + Pins Counter + Recenter + Report Action */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-0.5">
            {/* Municipal GIS Brand Badge */}
            <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r border-slate-200 dark:border-slate-800">
              <div className="size-6 rounded-lg bg-teal-50 dark:bg-teal-950 text-[#0D9488] flex items-center justify-center font-bold">
                <MapPin className="size-3.5" />
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight hidden sm:inline">
                Chattogram GIS
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] font-extrabold uppercase text-muted tracking-wider mr-1">
                Status:
              </span>
              {STATUSES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onStatusChange(st.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                    selectedStatus === st.id
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                      : "text-muted hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Action: Visible Counter + Recenter + Report Action */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950 text-[#0D9488] border border-teal-200 dark:border-teal-800">
              <span className="size-2 rounded-full bg-[#0D9488] animate-pulse" />
              <span>{visibleCount} Pins</span>
            </div>

            <button
              type="button"
              onClick={onRecenter}
              title="Recenter to Chattogram City Center"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-50 hover:text-[#0D9488] dark:hover:bg-teal-950 dark:hover:text-teal-300 transition-colors cursor-pointer"
            >
              <Navigation className="size-3" />
              <span className="hidden lg:inline">Recenter</span>
            </button>

            <MagneticButton
              variant="primary"
              size="sm"
              href="/issues/new"
              className="text-xs font-bold shadow-md shadow-teal-500/20 py-1 px-3 shrink-0"
            >
              <Plus className="size-3.5 mr-1" />
              <span>Report Incident</span>
            </MagneticButton>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border cursor-pointer ${
                  isSelected
                    ? "bg-[#0D9488] text-white border-teal-600 shadow-sm shadow-teal-500/20"
                    : "bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:border-teal-400"
                }`}
              >
                {cat.id !== "all" && (
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: isSelected ? "#FFFFFF" : cat.color }}
                  />
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default MapLayerFilterBar;
