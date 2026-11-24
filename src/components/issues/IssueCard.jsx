"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Clock,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  Droplets,
  Footprints,
  Trash2,
  Building2,
  ShieldCheck,
  Star,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS = {
  "Road Damage": AlertTriangle,
  Streetlight: Lightbulb,
  Drainage: Droplets,
  Footpath: Footprints,
  "Waste Management": Trash2,
  "Public Infrastructure": Building2,
};

const PRIORITY_BADGES = {
  low: { label: "Low", bg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  medium: { label: "Medium", bg: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  high: { label: "High", bg: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  critical: { label: "Critical", bg: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse" },
};

function formatRelativeTime(dateString) {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function IssueCard({ issue }) {
  if (!issue) return null;

  const CategoryIcon = CATEGORY_ICONS[issue.category] || Building2;
  const priorityInfo = PRIORITY_BADGES[issue.priority] || PRIORITY_BADGES.medium;
  const imageUrl = issue.image?.url;
  const ticketId = `CP-${issue._id ? issue._id.toString().slice(-4).toUpperCase() : "2026"}`;

  return (
    <Link
      href={`/issues/${issue._id}`}
      className="group relative block rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-sm hover:shadow-xl hover:border-teal-400/50 dark:hover:border-teal-500/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Ambient hover glow */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -z-10" />

      {/* Top Header: Ticket ID & Status */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-muted uppercase">
            #{ticketId}
          </span>
          <span
            className={cn(
              "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700",
              priorityInfo.bg
            )}
          >
            {priorityInfo.label} Priority
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {issue.feedback ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {issue.feedback.rating || 5}.0
            </span>
          ) : (issue.status === "Resolved" || issue.status === "Closed") ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              <Star className="w-3 h-3 text-teal-600" />
              Rate Fix
            </span>
          ) : null}
          <StatusBadge status={issue.status} size="sm" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex gap-4">
        {/* Thumbnail Preview */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/60 dark:border-slate-700">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={issue.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted p-2 text-center">
              <CategoryIcon className="w-7 h-7 text-[#0D9488] mb-1" />
              <span className="text-[10px] font-semibold">{issue.category}</span>
            </div>
          )}
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0D9488] mb-1">
              <CategoryIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{issue.category}</span>
            </div>

            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-[#0D9488] transition-colors line-clamp-1">
              {issue.title}
            </h3>

            <p className="mt-1 text-xs text-muted line-clamp-2 leading-relaxed">
              {issue.description}
            </p>
          </div>

          {/* Location & Time Footer */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-[11px] text-muted">
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />
              <span className="truncate">{issue.address}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0 font-medium">
              <Clock className="w-3 h-3" />
              <span>{formatRelativeTime(issue.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
