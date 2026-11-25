"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { PaginationControl } from "@/components/ui/PaginationControl";
import { DebouncedSearchInput } from "@/components/management/DebouncedSearchInput";
import {
  ScrollText,
  RefreshCw,
  AlertCircle,
  FileText,
  Wrench,
  Building2,
  UserCheck,
  Shield,
  Clock,
  Activity,
} from "lucide-react";

const ENTITY_META = {
  Issue: {
    icon: FileText,
    badgeClass:
      "bg-teal-50 dark:bg-teal-950/60 text-[#0D9488] border-teal-200/70 dark:border-teal-800/70",
  },
  Task: {
    icon: Wrench,
    badgeClass:
      "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200/70 dark:border-purple-800/70",
  },
  Department: {
    icon: Building2,
    badgeClass:
      "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200/70 dark:border-blue-800/70",
  },
  User: {
    icon: UserCheck,
    badgeClass:
      "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200/70 dark:border-amber-800/70",
  },
  System: {
    icon: Shield,
    badgeClass:
      "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  },
};

const ROLE_BADGES = {
  admin: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300",
  manager: "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300",
  staff: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300",
  citizen: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
};

function formatRelativeTime(isoDate) {
  if (!isoDate) return "just now";
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(isoDate).toLocaleDateString();
}

function formatActionLabel(action = "") {
  return action
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

/**
 * ActivityLogList
 * Chronological system-wide audit stream for CivicPulse administrators.
 */
export function ActivityLogList() {
  const [logs, setLogs] = useState([]);
  const [entityTypes, setEntityTypes] = useState([]);
  const [stats, setStats] = useState({ totalEvents: 0, last24hEvents: 0, activeActors: 0 });

  const [entityTypeFilter, setEntityTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchActivityLogs = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
        entityType: entityTypeFilter,
      });
      if (search.trim()) params.append("search", search.trim());

      const [logsRes, statsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/v1/activity?${params.toString()}`, {
          credentials: "include",
        }),
        fetch("http://localhost:5000/api/v1/activity/stats", {
          credentials: "include",
        }),
      ]);

      if (!logsRes.ok) {
        throw new Error("Failed to load system activity audit stream.");
      }

      const logsJson = await logsRes.json();
      setLogs(logsJson.data?.logs || []);
      setEntityTypes(logsJson.data?.entityTypes || []);
      setTotalItems(logsJson.data?.pagination?.total || 0);
      setTotalPages(logsJson.data?.pagination?.totalPages || 1);

      if (statsRes.ok) {
        const statsJson = await statsRes.json();
        if (statsJson.data?.stats) {
          setStats(statsJson.data.stats);
        }
      }
    } catch (err) {
      setError(err.message || "Unable to retrieve activity logs.");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, entityTypeFilter, search]);

  useEffect(() => {
    fetchActivityLogs();
  }, [fetchActivityLogs]);

  return (
    <div className="space-y-6">
      {/* Quick Audit Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-muted uppercase tracking-wider">
            Total Audit Events
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats.totalEvents.toLocaleString()}
          </div>
          <p className="text-[10px] text-muted mt-0.5">Immutable municipal trail</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-[#0D9488] uppercase tracking-wider">
            Last 24 Hours
          </div>
          <div className="text-2xl font-extrabold text-[#0D9488] mt-1">
            {stats.last24hEvents.toLocaleString()}
          </div>
          <p className="text-[10px] text-muted mt-0.5">Recent system mutations</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
            Active Actors
          </div>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">
            {stats.activeActors.toLocaleString()}
          </div>
          <p className="text-[10px] text-muted mt-0.5">Distinct authenticated accounts</p>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ScrollText className="size-4 text-[#0D9488]" aria-hidden="true" />
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              System-Wide Operational Audit Stream
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <DebouncedSearchInput
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
              placeholder="Search by actor, email, or action..."
            />

            <button
              type="button"
              onClick={fetchActivityLogs}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
            >
              <RefreshCw
                className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Entity Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider mr-1">
            Entity:
          </span>
          {["all", ...entityTypes].map((et) => (
            <button
              key={et}
              type="button"
              onClick={() => {
                setEntityTypeFilter(et);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                entityTypeFilter === et
                  ? "bg-[#0D9488] text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {et === "all" ? "All Events" : et}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Chronological Timeline List */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/60 animate-pulse"
              />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Activity className="size-8 text-muted mx-auto opacity-50" aria-hidden="true" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              No matching audit records found
            </p>
            <p className="text-xs text-muted">
              Try clearing your search query or switching the entity type filter.
            </p>
          </div>
        ) : (
          <ol className="relative border-l border-slate-200 dark:border-slate-800 ml-3 space-y-5">
            {logs.map((log, idx) => {
              const meta = ENTITY_META[log.entityType] || ENTITY_META.System;
              const EntityIcon = meta.icon;
              const actor = log.user || {};
              const roleBadge =
                ROLE_BADGES[actor.role] || ROLE_BADGES.citizen;

              const detailEntries =
                log.details && typeof log.details === "object"
                  ? Object.entries(log.details).filter(
                      ([, val]) => val !== null && val !== undefined && val !== ""
                    )
                  : [];

              return (
                <motion.li
                  key={log._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
                  className="pl-6 relative"
                >
                  {/* Timeline Node */}
                  <span
                    className={`absolute -left-3.5 top-1 size-7 rounded-xl border flex items-center justify-center shadow-xs ${meta.badgeClass}`}
                  >
                    <EntityIcon className="size-3.5" aria-hidden="true" />
                  </span>

                  <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                          {actor.name || "System Process"}
                        </span>
                        {actor.role && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${roleBadge}`}
                          >
                            {actor.role}
                          </span>
                        )}
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          performed
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-[11px] font-mono font-bold text-[#0D9488]">
                          {formatActionLabel(log.action)}
                        </span>
                        <span className="text-[11px] font-bold text-muted">
                          on {log.entityType}
                        </span>
                      </div>

                      <time
                        dateTime={log.createdAt}
                        title={new Date(log.createdAt).toLocaleString()}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted shrink-0"
                      >
                        <Clock className="size-3" aria-hidden="true" />
                        {formatRelativeTime(log.createdAt)}
                      </time>
                    </div>

                    {detailEntries.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {detailEntries.slice(0, 5).map(([key, val]) => (
                          <span
                            key={key}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-300"
                          >
                            <span className="font-bold text-muted">{key}:</span>
                            <span className="font-mono font-semibold truncate max-w-[220px]">
                              {typeof val === "object" ? JSON.stringify(val) : String(val)}
                            </span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ol>
        )}
      </div>

      {/* Pagination */}
      <PaginationControl
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(sz) => {
          setPageSize(sz);
          setPage(1);
        }}
      />
    </div>
  );
}

export default ActivityLogList;
