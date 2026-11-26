"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Navigation,
  MapPin,
  Plus,
  ChevronUp,
  Check,
  Filter,
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
 * Desktop/Tablet: Floating multi-pill GIS command dock.
 * Mobile (< 640px): Compact single-row dock with top-opening (drop-up) Status & Category
 * dropdowns and an icon-only `+` Report Incident button.
 */
export function MapLayerFilterBar({
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  visibleCount = 0,
  onRecenter,
}) {
  // Mobile drop-up state: null | "status" | "category"
  const [openMenu, setOpenMenu] = useState(null);
  const dockRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dockRef.current && !dockRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const activeStatusObj = STATUSES.find((s) => s.id === selectedStatus) || STATUSES[0];
  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

  return (
    <motion.div
      ref={dockRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute bottom-3 sm:bottom-6 left-0 right-0 mx-auto z-[1000] w-[calc(100%-1rem)] sm:w-[95%] max-w-5xl pointer-events-auto"
    >
      {/* MOBILE COMPACT DOCK (< 640px): Drop-Up Status + Drop-Up Category + Recenter + '+' Button */}
      <div className="sm:hidden relative p-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-2xl flex items-center gap-1.5">
        {/* Status Drop-Up Trigger */}
        <div className="relative flex-1 min-w-0">
          <button
            type="button"
            onClick={() => setOpenMenu((prev) => (prev === "status" ? null : "status"))}
            aria-haspopup="listbox"
            aria-expanded={openMenu === "status"}
            className="w-full min-h-[40px] px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between gap-1 cursor-pointer"
          >
            <span className="inline-flex items-center gap-1 truncate">
              <Filter className="size-3 text-[#0D9488] shrink-0" aria-hidden="true" />
              <span className="truncate">{activeStatusObj.label}</span>
            </span>
            <ChevronUp
              className={`size-3.5 text-muted shrink-0 transition-transform ${
                openMenu === "status" ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          <AnimatePresence>
            {openMenu === "status" && (
              <motion.ul
                role="listbox"
                aria-label="Filter by Status"
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-0 mb-2 w-44 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 space-y-0.5"
              >
                {STATUSES.map((st) => {
                  const active = selectedStatus === st.id;
                  return (
                    <li key={st.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => {
                          onStatusChange(st.id);
                          setOpenMenu(null);
                        }}
                        className={`w-full min-h-[38px] px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          active
                            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span>{st.label}</span>
                        {active && <Check className="size-3.5 shrink-0" aria-hidden="true" />}
                      </button>
                    </li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Category Drop-Up Trigger */}
        <div className="relative flex-1 min-w-0">
          <button
            type="button"
            onClick={() => setOpenMenu((prev) => (prev === "category" ? null : "category"))}
            aria-haspopup="listbox"
            aria-expanded={openMenu === "category"}
            className="w-full min-h-[40px] px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between gap-1 cursor-pointer"
          >
            <span className="inline-flex items-center gap-1.5 truncate">
              <span
                className="size-2 rounded-full shrink-0"
                style={{ backgroundColor: activeCategoryObj.color }}
                aria-hidden="true"
              />
              <span className="truncate">{activeCategoryObj.label}</span>
            </span>
            <ChevronUp
              className={`size-3.5 text-muted shrink-0 transition-transform ${
                openMenu === "category" ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          <AnimatePresence>
            {openMenu === "category" && (
              <motion.ul
                role="listbox"
                aria-label="Filter by Category"
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full right-0 mb-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 space-y-0.5 max-h-[55dvh] overflow-y-auto"
              >
                {CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat.id;
                  return (
                    <li key={cat.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => {
                          onCategoryChange(cat.id);
                          setOpenMenu(null);
                        }}
                        className={`w-full min-h-[38px] px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                          active
                            ? "bg-[#0D9488] text-white"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span className="inline-flex items-center gap-2 truncate">
                          <span
                            className="size-2 rounded-full shrink-0"
                            style={{ backgroundColor: active ? "#FFFFFF" : cat.color }}
                            aria-hidden="true"
                          />
                          <span className="truncate">{cat.label}</span>
                        </span>
                        {active && <Check className="size-3.5 shrink-0" aria-hidden="true" />}
                      </button>
                    </li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Compact Recenter Button */}
        <button
          type="button"
          onClick={onRecenter}
          aria-label="Recenter to Chattogram City Center"
          title="Recenter map"
          className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-50 hover:text-[#0D9488] transition-colors cursor-pointer shrink-0"
        >
          <Navigation className="size-4" aria-hidden="true" />
        </button>

        {/* Icon-Only '+' Report Incident CTA */}
        <MagneticButton
          variant="primary"
          size="sm"
          href="/issues/new"
          aria-label="Report Incident"
          title="Report Incident"
          className="min-h-[40px] min-w-[40px] w-10 h-10 p-0 flex items-center justify-center rounded-xl shadow-md shadow-teal-500/25 shrink-0"
        >
          <Plus className="size-4" aria-hidden="true" />
        </MagneticButton>
      </div>

      {/* TABLET & DESKTOP DOCK (>= 640px) */}
      <div className="hidden sm:block p-3 sm:p-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-2xl space-y-2.5">
        {/* Top Control Bar: GIS Branding + Status Filter + Pins Counter + Recenter + Report Action */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-0.5">
            {/* Municipal GIS Brand Badge */}
            <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r border-slate-200 dark:border-slate-800">
              <div className="size-6 rounded-lg bg-teal-50 dark:bg-teal-950 text-[#0D9488] flex items-center justify-center font-bold">
                <MapPin className="size-3.5" />
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight hidden lg:inline">
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950 text-[#0D9488] border border-teal-200 dark:border-teal-800 whitespace-nowrap">
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

        {/* Category Pills Bar (wraps cleanly on tablets, single row on desktop) */}
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-1.5 py-0.5">
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
