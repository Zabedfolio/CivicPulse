"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { IssueCard } from "@/components/issues/IssueCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import {
  FileText,
  Search,
  Filter,
  Plus,
  Sparkles,
  Loader2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = [
  { id: "all", label: "All Reports" },
  { id: "Submitted", label: "Submitted" },
  { id: "Under Review", label: "Under Review" },
  { id: "Assigned", label: "Assigned" },
  { id: "In Progress", label: "In Progress" },
  { id: "Resolved", label: "Resolved" },
];

export default function MyReportsPage() {
  const router = useRouter();
  const { data: session, isPending: authPending } = useSession();

  const [activeStatus, setActiveStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const user = session?.user;

  // Fetch reports when user is available or status changes
  useEffect(() => {
    if (!authPending && !user) {
      setIsLoading(false);
      return;
    }

    if (!user) return;

    let isMounted = true;
    const fetchMyIssues = async () => {
      setIsLoading(true);
      setFetchError("");

      try {
        const queryParams = new URLSearchParams();
        if (activeStatus !== "all") {
          queryParams.set("status", activeStatus);
        }

        const res = await fetch(
          `http://localhost:5000/api/v1/issues/mine?${queryParams.toString()}`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to load your reported issues.");
        }

        const json = await res.json();
        if (isMounted) {
          setIssues(json.data?.issues || []);
        }
      } catch (err) {
        if (isMounted) {
          setFetchError(err.message || "Failed to connect to municipal dispatch server.");
          // Fallback mock issues for graceful demonstration when local db is empty
          setIssues([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMyIssues();

    return () => {
      isMounted = false;
    };
  }, [user, authPending, activeStatus]);

  // Client-side search filtering by title, address, or category
  const filteredIssues = useMemo(() => {
    if (!searchQuery.trim()) return issues;
    const q = searchQuery.toLowerCase();
    return issues.filter(
      (iss) =>
        iss.title?.toLowerCase().includes(q) ||
        iss.address?.toLowerCase().includes(q) ||
        iss.category?.toLowerCase().includes(q)
    );
  }, [issues, searchQuery]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/80 text-[#0D9488] border border-teal-200 dark:border-teal-800/80 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Citizen Public Works Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Public Works Reports
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            Track real-time progress, engineering inspection logs, and photographic repair proof for your submitted issues.
          </p>
        </div>

        <MagneticButton
          variant="primary"
          size="md"
          href="/issues/new"
          className="text-xs font-bold shadow-md shadow-teal-500/10 shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Report New Issue
        </MagneticButton>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Motion Brew FilterPillsGroup */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {STATUS_FILTERS.map((filter) => {
            const isActive = activeStatus === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveStatus(filter.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 border",
                  isActive
                    ? "bg-[#0D9488] text-white border-teal-600 shadow-sm shadow-teal-500/20"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700"
                )}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports or ward..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>
      </div>

      {/* Reports Grid or States */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-36 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 animate-pulse flex gap-4"
            >
              <div className="w-24 h-24 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="flex-1 space-y-2.5">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : !user ? (
        /* Unauthenticated Callout */
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950 text-[#0D9488] mx-auto flex items-center justify-center mb-4">
            <FileText className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Please Sign In to View Your Reports
          </h2>
          <p className="mt-1 text-xs text-muted max-w-sm mx-auto">
            Log in with your citizen credentials to monitor your submitted public works tickets and receive repair milestone alerts.
          </p>
          <div className="mt-5">
            <MagneticButton
              variant="primary"
              size="md"
              href="/login?redirect=/my-reports"
              className="text-xs font-bold"
            >
              Sign In to CivicPulse
            </MagneticButton>
          </div>
        </div>
      ) : filteredIssues.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mx-auto flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {searchQuery
              ? `No reports matching "${searchQuery}"`
              : activeStatus !== "all"
              ? `No reports currently in "${activeStatus}" status`
              : "No Public Issues Reported Yet"}
          </h2>
          <p className="mt-1 text-xs text-muted max-w-sm mx-auto">
            {searchQuery
              ? "Try adjusting your search query or switching the status filter tab above."
              : "Spot a broken streetlight, pothole, or drainage issue in Chattogram? Report it now and receive live photo resolution proofs."}
          </p>
          <div className="mt-6">
            <MagneticButton
              variant="primary"
              size="md"
              href="/issues/new"
              className="text-xs font-bold shadow-md shadow-teal-500/10"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Report Your First Issue
            </MagneticButton>
          </div>
        </div>
      ) : (
        /* Issues Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIssues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}
