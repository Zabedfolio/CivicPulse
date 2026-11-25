"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Search,
  ArrowRight,
  Flame,
  Lightbulb,
  Droplets,
  Footprints,
  Trash2,
  Building2,
  Navigation,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const QUICK_CATEGORIES = [
  { name: "Road Damage", icon: Flame, color: "#EF4444" },
  { name: "Streetlight", icon: Lightbulb, color: "#EAB308" },
  { name: "Drainage", icon: Droplets, color: "#3B82F6" },
  { name: "Footpath", icon: Footprints, color: "#A855F7" },
  { name: "Waste Management", icon: Trash2, color: "#22C55E" },
  { name: "Public Infrastructure", icon: Building2, color: "#64748B" },
];

export function QuickActionWidget() {
  const router = useRouter();
  const [tab, setTab] = useState("report"); // "report" | "track"

  // Report State
  const [selectedCategory, setSelectedCategory] = useState("Road Damage");
  const [locationText, setLocationText] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  // Track State
  const [ticketId, setTicketId] = useState("");
  const [searchedTicket, setSearchedTicket] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Detect GPS
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationText(
          `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (GPS Acquired)`
        );
        setIsLocating(false);
      },
      () => {
        setLocationText("Agrabad C/A, Ward 24, Chittagong");
        setIsLocating(false);
      }
    );
  };

  const handleStartReport = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      category: selectedCategory,
      ...(locationText ? { address: locationText } : {}),
    });
    router.push(`/issues/new?${query.toString()}`);
  };

  const handleSearchTicket = (e) => {
    e.preventDefault();
    if (!ticketId.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setSearchedTicket({
        id: ticketId.toUpperCase().startsWith("CP-") ? ticketId.toUpperCase() : `CP-${ticketId}`,
        title: "Deep pothole near Agrabad Circle crossway",
        category: "Road Damage",
        status: "In Progress",
        reportedAt: "Today, 09:30 AM",
        assignedTo: "Chittagong Road Maintenance Unit #4",
        estimatedCompletion: "Tomorrow by 5:00 PM",
      });
      setIsSearching(false);
    }, 600);
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-teal-200 dark:border-teal-900 shadow-[0_20px_50px_-20px_rgba(20,184,166,0.25)] p-4 sm:p-7 text-left relative z-20">
      {/* Tab Switcher */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-5 sm:mb-6">
        <button
          type="button"
          onClick={() => {
            setTab("report");
            setSearchedTicket(null);
          }}
          className={cn(
            "flex-1 min-h-[44px] py-2 px-2 rounded-xl text-[11px] sm:text-sm font-bold transition-all duration-200 text-center select-none cursor-pointer",
            tab === "report"
              ? "bg-white dark:bg-slate-700 text-[#0D9488] shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          )}
        >
          🚀 Report a Problem
        </button>
        <button
          type="button"
          onClick={() => setTab("track")}
          className={cn(
            "flex-1 min-h-[44px] py-2 px-2 rounded-xl text-[11px] sm:text-sm font-bold transition-all duration-200 text-center select-none cursor-pointer",
            tab === "track"
              ? "bg-white dark:bg-slate-700 text-[#0D9488] shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          )}
        >
          🔍 Track by Ticket ID
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === "report" ? (
          <motion.form
            key="report-form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleStartReport}
            className="space-y-4"
          >
            {/* Category Select Pills */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                Select Infrastructure Category:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {QUICK_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                      className={cn(
                        "flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all select-none cursor-pointer",
                        isSelected
                          ? "bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-[#0D9488] shadow-xs ring-1 ring-teal-500"
                          : "bg-white dark:bg-slate-800 border-border text-slate-700 dark:text-slate-300 hover:border-slate-300"
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0" style={{ color: cat.color }} />
                      <span className="truncate">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location Input with GPS button */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Location or Street Name:
              </label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-3.5 w-4 h-4 text-muted pointer-events-none" />
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="e.g. Near GEC Circle, O.R. Nizam Road"
                  className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                />
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                  className="absolute right-1.5 px-2.5 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-[#0D9488] text-xs font-semibold hover:bg-teal-100 transition-colors inline-flex items-center gap-1"
                >
                  {isLocating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Navigation className="w-3.5 h-3.5" />
                  )}
                  <span>GPS</span>
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full h-12 text-sm sm:text-base font-bold shadow-md shadow-teal-500/20"
            >
              Continue to Attach Photo Evidence
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </motion.form>
        ) : (
          <motion.form
            key="track-form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSearchTicket}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Enter Issue Tracking ID:
              </label>
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-muted pointer-events-none" />
                <input
                  type="text"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="e.g. CP-1042 or CP-2026-8841"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSearching}
              className="w-full h-11 text-sm font-bold"
            >
              Track Live Incident Status
            </Button>

            {/* Instant Status Preview Modal Card */}
            {searchedTicket && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 rounded-2xl bg-teal-50/70 dark:bg-slate-800/80 border border-teal-200 dark:border-teal-800"
              >
                <div className="flex items-center justify-between pb-3 border-b border-teal-200/60 dark:border-slate-700">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#0D9488]">
                      {searchedTicket.id}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {searchedTicket.title}
                    </h4>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    {searchedTicket.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 mt-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted block">
                      Assigned Crew
                    </span>
                    <span>{searchedTicket.assignedTo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted block">
                      Est. Completion
                    </span>
                    <span>{searchedTicket.estimatedCompletion}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 flex items-center justify-between text-xs text-[#0D9488] font-bold">
                  <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488]" />
                    Verified Municipal Ticket
                  </span>
                  <Link
                    href={`/issues/${searchedTicket.id}`}
                    className="hover:underline inline-flex items-center gap-1"
                  >
                    View Full Audit Trail <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default QuickActionWidget;
