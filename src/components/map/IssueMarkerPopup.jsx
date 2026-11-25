"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  ExternalLink,
  AlertTriangle,
  Building2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";

const CATEGORY_COLORS = {
  "Road Damage": "#EF4444",
  Streetlight: "#EAB308",
  Drainage: "#3B82F6",
  Footpath: "#A855F7",
  "Waste Management": "#10B981",
  "Public Infrastructure": "#64748B",
};

/**
 * IssueMarkerPopup (Motion Brew MotionCard)
 * Interactive card popup for incident markers on the city GIS map
 */
export function IssueMarkerPopup({ issue }) {
  if (!issue) return null;

  const categoryColor = CATEGORY_COLORS[issue.category] || "#0D9488";
  const ticketId = `CP-2026-${issue._id ? issue._id.toString().slice(-4).toUpperCase() : "MAP"}`;

  return (
    <div className="w-[min(260px,calc(100vw-4.5rem))] sm:w-72 p-1 text-slate-900 dark:text-white font-sans">
      {/* Thumbnail */}
      <div className="relative w-full h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 mb-2.5">
        {issue.image?.url ? (
          <img
            src={issue.image.url}
            alt={issue.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted p-2 text-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <Building2 className="size-6 text-[#0D9488] mb-1 opacity-70" />
            <span className="text-[10px] font-semibold">{issue.category}</span>
          </div>
        )}

        {/* Priority & Ticket Tag */}
        <div className="absolute top-2 left-2 flex items-center gap-1">
          <span className="font-mono text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-950/80 text-white backdrop-blur-xs">
            #{ticketId}
          </span>
        </div>

        <div className="absolute top-2 right-2">
          <StatusBadge status={issue.status} size="sm" />
        </div>
      </div>

      {/* Category & Title */}
      <div className="space-y-1 mb-2">
        <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: categoryColor }}
          />
          <span style={{ color: categoryColor }}>{issue.category}</span>
          {issue.department?.code && (
            <span className="text-muted font-mono">· {issue.department.code}</span>
          )}
        </div>

        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1 leading-snug">
          {issue.title}
        </h4>
      </div>

      {/* Location address */}
      <div className="flex items-start gap-1.5 text-[11px] text-muted mb-3 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
        <MapPin className="size-3 text-[#0D9488] shrink-0 mt-0.5" />
        <span className="line-clamp-1 font-medium">{issue.address || "Chattogram, Bangladesh"}</span>
      </div>

      {/* Action link */}
      <Link
        href={`/issues/${issue._id}`}
        style={{ color: "#ffffff" }}
        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-extrabold bg-[#0D9488] !text-white hover:bg-teal-700 transition-colors shadow-sm cursor-pointer"
      >
        <span style={{ color: "#ffffff" }} className="!text-white font-bold">Inspect Incident Ticket</span>
        <ArrowRight className="size-3.5 !text-white shrink-0" style={{ color: "#ffffff" }} />
      </Link>
    </div>
  );
}

export default IssueMarkerPopup;
