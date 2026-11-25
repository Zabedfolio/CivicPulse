"use client";

import React from "react";
import { AlertTriangle, Lightbulb, Droplets, Footprints, Trash2, Landmark, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const CATEGORIES = [
  {
    id: "Road Damage",
    title: "Road Damage",
    subtitle: "Potholes, cracked asphalt, craters",
    icon: AlertTriangle,
    accent: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    border: "border-rose-200 dark:border-rose-900/60",
    activeRing: "ring-2 ring-rose-500",
  },
  {
    id: "Streetlight",
    title: "Streetlight",
    subtitle: "Dark lamppost, flickering, exposed wire",
    icon: Lightbulb,
    accent: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-900/60",
    activeRing: "ring-2 ring-amber-500",
  },
  {
    id: "Drainage",
    title: "Drainage",
    subtitle: "Water logging, open manhole, sewage",
    icon: Droplets,
    accent: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    border: "border-cyan-200 dark:border-cyan-900/60",
    activeRing: "ring-2 ring-cyan-500",
  },
  {
    id: "Footpath",
    title: "Footpath",
    subtitle: "Broken pavers, blocked sidewalk, hazards",
    icon: Footprints,
    accent: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-900/60",
    activeRing: "ring-2 ring-emerald-500",
  },
  {
    id: "Waste Management",
    title: "Waste Management",
    subtitle: "Illegal dumping, garbage overflow, bins",
    icon: Trash2,
    accent: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    border: "border-orange-200 dark:border-orange-900/60",
    activeRing: "ring-2 ring-orange-500",
  },
  {
    id: "Public Infrastructure",
    title: "Public Infrastructure",
    subtitle: "Broken railing, parks, traffic signage",
    icon: Landmark,
    accent: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/40",
    border: "border-purple-200 dark:border-purple-900/60",
    activeRing: "ring-2 ring-purple-500",
  },
];

export function CategorySelector({ selected, onSelect, error }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          1. Select Hazard Category <span className="text-rose-500">*</span>
        </label>
        <span className="text-[11px] text-muted font-medium">Automatic Municipal Routing</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selected === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              className={cn(
                "relative flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all duration-200",
                cat.bg,
                isSelected
                  ? `${cat.border} ${cat.activeRing} shadow-md`
                  : "border-border hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs",
                  cat.accent,
                  "bg-white dark:bg-slate-900"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0 pr-6">
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {cat.title}
                </div>
                <div className="text-[11px] text-muted line-clamp-1 mt-0.5">
                  {cat.subtitle}
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {error && <p className="mt-2 text-xs text-rose-500 font-semibold">{error}</p>}
    </div>
  );
}

export default CategorySelector;
