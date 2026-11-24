"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PrioritySelector } from "./PrioritySelector";
import { DepartmentDropdown } from "./DepartmentDropdown";
import { DuplicateAlertBanner } from "./DuplicateAlertBanner";
import { DuplicateComparisonModal } from "./DuplicateComparisonModal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MagneticButton } from "@/components/ui/MagneticButton";
import {
  X,
  ShieldCheck,
  MapPin,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ImageIcon,
} from "lucide-react";

/**
 * VerifyIssueModal (Motion Brew DialogSpring)
 * Frontline triage modal for inspecting evidence, setting severity, and re-routing
 */
export function VerifyIssueModal({
  isOpen,
  issue,
  departments = [],
  onClose,
  onSuccess,
}) {
  const [priority, setPriority] = useState("medium");
  const [targetDepartmentId, setTargetDepartmentId] = useState("");
  const [markVerified, setMarkVerified] = useState(true);
  const [triageNote, setTriageNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [comparisonCandidates, setComparisonCandidates] = useState([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Sync state whenever active issue changes
  useEffect(() => {
    if (issue) {
      setPriority(issue.priority?.toLowerCase() || "medium");
      setTargetDepartmentId("");
      setMarkVerified(issue.status === "Submitted");
      setTriageNote("");
      setServerError("");
    }
  }, [issue]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !issue) return null;

  const ticketId = `CP-2026-${(issue._id || "").toString().slice(-4).toUpperCase()}`;

  const handleSubmitTriage = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError("");

    try {
      let latestIssue = issue;

      // 1. Verify status (if checked and currently Submitted)
      if (markVerified && issue.status === "Submitted") {
        const res = await fetch(`http://localhost:5000/api/v1/issues/${issue._id}/verify`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            priority,
            note: triageNote || "Inspected and verified by municipal manager",
          }),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Failed to verify issue.");
        latestIssue = json.data?.issue || latestIssue;
      } else if (priority !== issue.priority?.toLowerCase()) {
        // 2. Priority update only
        const res = await fetch(`http://localhost:5000/api/v1/issues/${issue._id}/priority`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            priority,
            note: triageNote,
          }),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Failed to update priority.");
        latestIssue = json.data?.issue || latestIssue;
      }

      // 3. Re-route department if a new department is selected
      if (targetDepartmentId && targetDepartmentId !== issue.department?._id) {
        const res = await fetch(`http://localhost:5000/api/v1/issues/${issue._id}/reroute`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            departmentId: targetDepartmentId,
            note: triageNote || "Re-routed to target division",
          }),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Failed to re-route department.");
        latestIssue = json.data?.issue || latestIssue;
      }

      if (onSuccess) onSuccess(latestIssue);
      onClose();
    } catch (err) {
      setServerError(err.message || "Triage operation encountered an error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/65 backdrop-blur-md cursor-pointer"
          aria-hidden="true"
        />

        {/* Modal Dialog Card */}
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 32,
            mass: 0.9,
          }}
          className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/90 dark:border-slate-800 shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/70 dark:bg-slate-900/60 shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs font-extrabold text-[#0D9488]">
                  #{ticketId}
                </span>
                <StatusBadge status={issue.status} />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {issue.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 text-slate-400" />
                  <span>{issue.address}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <User className="size-3 text-slate-400" />
                  <span>Reported by {issue.reporter?.name || "Citizen"}</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close triage dialog"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Server Error Alert */}
            {serverError && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2.5">
                <AlertCircle className="size-4 shrink-0 text-rose-600" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Proximity Duplicate Warning Banner (MGT-04) */}
            <DuplicateAlertBanner
              issue={issue}
              onOpenComparison={(candidates) => {
                setComparisonCandidates(candidates);
                setIsComparisonOpen(true);
              }}
            />

            {/* Citizen Evidence & Description */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              {/* Photo preview */}
              <div className="md:col-span-1">
                {issue.image?.url ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-36 bg-slate-100 dark:bg-slate-800">
                    <img
                      src={issue.image.url}
                      alt="Citizen evidence"
                      className="size-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-36 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 gap-1 bg-white dark:bg-slate-900">
                    <ImageIcon className="size-6 text-slate-300 dark:text-slate-600" />
                    <span className="text-[11px]">No Photo Attached</span>
                  </div>
                )}
              </div>

              {/* Text Description */}
              <div className="md:col-span-2 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  Citizen Incident Narrative
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  {issue.description}
                </p>
                <div className="text-[11px] text-muted">
                  Category: <span className="font-semibold text-slate-800 dark:text-slate-200">{issue.category}</span>
                </div>
              </div>
            </div>

            {/* Triage Decision Form */}
            <form onSubmit={handleSubmitTriage} className="space-y-5">
              {/* 1. Status Verification */}
              {issue.status === "Submitted" && (
                <div className="p-4 rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/50 dark:bg-teal-950/20 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShieldCheck className="size-4 text-[#0D9488]" />
                      <span>Formally Verify Incident Report</span>
                    </div>
                    <p className="text-[11px] text-muted">
                      Confirms inspection legitimacy and transitions ticket status to <strong>Under Review</strong>.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={markVerified}
                    onChange={(e) => setMarkVerified(e.target.checked)}
                    className="size-5 rounded text-teal-600 focus:ring-teal-500 cursor-pointer accent-[#0D9488]"
                  />
                </div>
              )}

              {/* 2. Severity Priority Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Calibrate Urgency &amp; Severity Priority
                </label>
                <PrioritySelector value={priority} onChange={(p) => setPriority(p)} />
              </div>

              {/* 3. Re-route Department (Optional) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Re-Route Municipal Department (If Miscategorized)
                </label>
                <DepartmentDropdown
                  departments={departments}
                  currentDepartmentId={issue.department?._id}
                  selectedDepartmentId={targetDepartmentId}
                  onChange={(d) => setTargetDepartmentId(d)}
                />
              </div>

              {/* 4. Manager Triage Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Triage Remarks / Inspection Notes
                </label>
                <textarea
                  rows={2}
                  value={triageNote}
                  onChange={(e) => setTriageNote(e.target.value)}
                  placeholder="e.g. Field inspection confirmed 50cm crater hazard; dispatched to emergency patch crew..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors shadow-xs"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-semibold text-muted hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>

                <MagneticButton
                  variant="primary"
                  size="md"
                  type="submit"
                  disabled={isSubmitting}
                  className="font-bold min-w-[160px] shadow-md shadow-teal-500/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-3.5 mr-2 animate-spin" />
                      Saving Triage...
                    </>
                  ) : (
                    <>
                      <span>Confirm Triage &amp; Save</span>
                      <ArrowRight className="size-3.5 ml-1.5" />
                    </>
                  )}
                </MagneticButton>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Proximity Duplicate Comparison Dialog (MGT-04) */}
      <DuplicateComparisonModal
        isOpen={isComparisonOpen}
        currentIssue={issue}
        candidateDuplicates={comparisonCandidates}
        onClose={() => setIsComparisonOpen(false)}
        onDuplicateMarked={(updatedChild) => {
          onSuccess?.(updatedChild);
          onClose();
        }}
      />
    </AnimatePresence>
  );
}

export default VerifyIssueModal;
