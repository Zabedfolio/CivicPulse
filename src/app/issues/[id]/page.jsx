"use client";


import { API_BASE_URL } from "@/lib/api";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Building2,
  User,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Droplets,
  Footprints,
  Trash2,
  ExternalLink,
  Sparkles,
  Share2,
  CheckCircle2,
  FileCheck,
  Star,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatusTimeline } from "@/components/issues/StatusTimeline";
import { IssueReportPDF } from "@/components/issues/IssueReportPDF";
import { DownloadPdfButton } from "@/components/ui/DownloadPdfButton";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FeedbackCard } from "@/components/feedback/FeedbackCard";
import { FeedbackPromptModal } from "@/components/feedback/FeedbackPromptModal";
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
  low: { label: "Low Priority", bg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  medium: { label: "Medium Priority", bg: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  high: { label: "High Priority", bg: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  critical: { label: "Critical Priority", bg: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse" },
};

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = params?.id;
  const { data: session } = useSession();
  const user = session?.user;

  const [issue, setIssue] = useState(null);
  const [history, setHistory] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!issueId) return;

    let isMounted = true;
    const fetchIssueDetails = async () => {
      setIsLoading(true);
      setFetchError("");

      try {
        const res = await fetch(`${API_BASE_URL}/issues/${issueId}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Unable to load public issue details or issue does not exist.");
        }

        const json = await res.json();
        if (isMounted) {
          const loadedIssue = json.data?.issue || null;
          setIssue(loadedIssue);
          setHistory(json.data?.history || []);
          if (loadedIssue?.feedback) {
            setFeedback(loadedIssue.feedback);
          } else if (loadedIssue?._id) {
            try {
              const fbRes = await fetch(
                `${API_BASE_URL}/issues/${loadedIssue._id}/feedback`,
                { credentials: "include" }
              );
              if (fbRes.ok) {
                const fbJson = await fbRes.json();
                if (isMounted && fbJson.data?.feedback) {
                  setFeedback(fbJson.data.feedback);
                }
              }
            } catch {
              // ignore
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          setFetchError(err.message || "Failed to connect to municipal server.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchIssueDetails();

    return () => {
      isMounted = false;
    };
  }, [issueId]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-full w-32 animate-pulse mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4 animate-pulse" />
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          </div>
          <div className="lg:col-span-5">
            <div className="h-96 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (fetchError || !issue) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
        <div className="p-8 sm:p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 mx-auto flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Issue Report Not Found
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            {fetchError || "The requested public works ticket could not be located in the municipal database."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <MagneticButton variant="primary" size="sm" href="/my-reports" className="text-xs font-bold">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Return to My Reports
            </MagneticButton>
          </div>
        </div>
      </div>
    );
  }

  const CategoryIcon = CATEGORY_ICONS[issue.category] || Building2;
  const priorityInfo = PRIORITY_BADGES[issue.priority] || PRIORITY_BADGES.medium;
  const ticketId = `CP-2026-${issue._id ? issue._id.toString().slice(-4).toUpperCase() : "AUDIT"}`;
  const coordinates = issue.location?.coordinates || [91.8317, 22.3384]; // [lng, lat]

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 bg-slate-50/70 dark:bg-slate-950 relative overflow-hidden print:min-h-0 print:pt-0 print:pb-0 print:px-0 print:bg-white">
      {/* Ambient background glow */}
      <div className="absolute left-1/2 -top-40 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-teal-400/15 via-emerald-400/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10 print:hidden" />

      <div className="max-w-6xl mx-auto print:hidden">
        {/* Navigation Breadcrumbs */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/my-reports"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-[#0D9488] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to My Reports
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono font-bold text-[#0D9488]">
              Ticket #{ticketId}
            </span>
            <DownloadPdfButton ticketId={ticketId} />
          </div>
        </div>

        {/* Top Header Bar */}
        <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950 text-[#0D9488] border border-teal-200 dark:border-teal-800">
                <CategoryIcon className="w-3.5 h-3.5" />
                {issue.category}
              </span>
              <span
                className={cn(
                  "text-xs font-bold uppercase px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700",
                  priorityInfo.bg
                )}
              >
                {priorityInfo.label}
              </span>
            </div>
            <StatusBadge status={issue.status} size="md" showIcon={true} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {issue.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>
                Reported on{" "}
                {new Date(issue.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            {issue.reporter?.name && (
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span>Reporter: {issue.reporter.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Media, Description & Geocoding Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Photo Evidence Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                <span>Photographic Evidence</span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">
                  Cloudinary Verified
                </span>
              </div>

              <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                {issue.image?.url ? (
                  <img
                    src={issue.image.url}
                    alt={issue.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted">
                    <CategoryIcon className="w-12 h-12 text-[#0D9488] mb-2 opacity-60" />
                    <span className="text-xs font-semibold">No direct photo attached</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description & Narrative */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Citizen Incident Description
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {issue.description}
              </p>
            </div>

            {/* Location & GPS Information Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Incident Location &amp; Coordinates
              </h3>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 mb-3">
                <MapPin className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {issue.address}
                  </p>
                  <p className="text-[11px] font-mono text-muted mt-0.5">
                    GPS: {coordinates[1].toFixed(6)}° N, {coordinates[0].toFixed(6)}° E
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Chattogram City Corporation Municipal GIS</span>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${coordinates[1]}&mlon=${coordinates[0]}#map=17/${coordinates[1]}/${coordinates[0]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-[#0D9488] hover:underline"
                >
                  View on OpenStreetMap
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Department Routing Information */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950 text-[#0D9488] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-muted font-bold uppercase">
                    Assigned Municipal Department
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {issue.department?.name || "Municipal Urban Development Division"}
                  </div>
                </div>
              </div>
              {issue.department?.code && (
                <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-border">
                  {issue.department.code}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Status Lifecycle Timeline & Feedback (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Citizen Resolution Review Section */}
            {feedback ? (
              <FeedbackCard feedback={feedback} />
            ) : (issue.status === "Resolved" || issue.status === "Closed") && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-50 via-white to-emerald-50/60 dark:from-slate-900 dark:via-slate-900/90 dark:to-teal-950/20 border border-teal-200/80 dark:border-teal-900/60 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
                  <Sparkles className="size-4 text-teal-600" />
                  <span className="text-xs font-extrabold uppercase tracking-wider">Citizen Satisfaction</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  How was the repair quality?
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  This issue was officially resolved. Your feedback helps municipal supervisors evaluate crew performance and ensure accountability.
                </p>
                {user && (user._id === issue.reporter?._id || user.id === issue.reporter?._id) ? (
                  <MagneticButton
                    variant="primary"
                    size="sm"
                    onClick={() => setIsFeedbackModalOpen(true)}
                    className="w-full text-xs font-bold justify-center shadow-sm cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5 mr-1.5 fill-current" />
                    Rate Resolution Quality
                  </MagneticButton>
                ) : (
                  <div className="text-[11px] font-medium text-muted bg-slate-100 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center">
                    Awaiting feedback from the reporting citizen ({issue.reporter?.name || "Reporter"}).
                  </div>
                )}
              </div>
            )}

            <StatusTimeline currentStatus={issue.status} history={history} />
          </div>
        </div>

        {/* Post-Resolution Feedback Modal */}
        <FeedbackPromptModal
          isOpen={isFeedbackModalOpen}
          issue={issue}
          onClose={() => setIsFeedbackModalOpen(false)}
          onFeedbackSubmitted={(newFb) => {
            setFeedback(newFb);
          }}
        />
      </div>

      {/* Printable Official A4 Municipal Dossier */}
      <IssueReportPDF
        issue={issue}
        history={history}
        feedback={feedback}
        ticketId={ticketId}
      />
    </div>
  );
}
