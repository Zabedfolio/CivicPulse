"use client";


import { API_BASE_URL } from "@/lib/api";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MagneticButton } from "@/components/ui/MagneticButton";
import {
  X,
  Copy,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
  User,
  ArrowRight,
  Loader2,
  ImageIcon,
  ShieldAlert,
} from "lucide-react";

/**
 * DuplicateComparisonModal (Motion Brew DialogSpring)
 * Side-by-side photographic and metadata comparison for proximity duplicates
 */
export function DuplicateComparisonModal({
  isOpen,
  currentIssue,
  candidateDuplicates = [],
  onClose,
  onDuplicateMarked,
}) {
  const [selectedParentId, setSelectedParentId] = useState("");
  const [duplicateNote, setDuplicateNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (candidateDuplicates.length > 0) {
      setSelectedParentId(candidateDuplicates[0]._id);
    }
    setDuplicateNote("");
    setError("");
  }, [candidateDuplicates, isOpen]);

  // Lock body scroll
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

  if (!isOpen || !currentIssue) return null;

  const selectedCandidate =
    candidateDuplicates.find((c) => c._id === selectedParentId) || candidateDuplicates[0];

  const handleMarkDuplicate = async () => {
    if (!selectedParentId) {
      setError("Please select the parent issue to merge with.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/issues/${currentIssue._id}/mark-duplicate`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            parentIssueId: selectedParentId,
            note:
              duplicateNote.trim() ||
              `Marked as duplicate of ticket "${selectedCandidate?.title || "Parent"}"`,
          }),
        }
      );

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to mark issue as duplicate.");
      }

      onDuplicateMarked?.(json.data?.issue, selectedCandidate);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to link duplicate issue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentTicketId = `CP-2026-${(currentIssue._id || "").toString().slice(-4).toUpperCase()}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md cursor-pointer"
          aria-hidden="true"
        />

        {/* Modal Dialog */}
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
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/90 dark:border-slate-800 shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-amber-50/40 dark:bg-amber-950/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 flex items-center justify-center shrink-0">
                <Copy className="size-5 text-amber-700 dark:text-amber-300" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Proximity Duplicate Inspection
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Side-by-side photographic comparison for reports within 50m radius.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close dialog"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                <ShieldAlert className="size-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Candidate Selector Tabs (if multiple duplicates found) */}
            {candidateDuplicates.length > 1 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Select Suspected Primary Ticket ({candidateDuplicates.length} found)
                </label>
                <div className="flex flex-wrap gap-2">
                  {candidateDuplicates.map((cand, idx) => {
                    const isSelected = cand._id === selectedParentId;
                    const cTicketId = `CP-2026-${(cand._id || "").toString().slice(-4).toUpperCase()}`;
                    return (
                      <button
                        key={cand._id}
                        type="button"
                        onClick={() => setSelectedParentId(cand._id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-100 border-amber-400 text-amber-950 dark:bg-amber-900/60 dark:border-amber-600 dark:text-amber-100 ring-2 ring-amber-400/30"
                            : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        #{cTicketId} • {cand.distanceMeters ?? "?"}m away ({cand.status})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Side-by-side comparison grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Current Incoming Report */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                      Current Report (To Merge)
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-500">
                      #{currentTicketId}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {currentIssue.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <StatusBadge status={currentIssue.status} />
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {currentIssue.category}
                    </span>
                  </div>

                  {/* Photo Thumbnail */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 mb-3 flex items-center justify-center">
                    {currentIssue.image?.url ? (
                      <img
                        src={currentIssue.image.url}
                        alt="Current report proof"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-slate-400">
                        <ImageIcon className="size-6" />
                        <span className="text-[11px]">No photo provided</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mb-3">
                    {currentIssue.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/80 text-[11px] text-muted space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-3 text-slate-400" />
                    <span className="truncate">{currentIssue.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="size-3 text-slate-400" />
                    <span>Reported by {currentIssue.reporter?.name || "Citizen"}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Suspected Primary Candidate */}
              {selectedCandidate ? (
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-700/80 flex flex-col justify-between relative shadow-sm">
                  {/* Proximity badge */}
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500 text-white shadow-xs">
                    📍 {selectedCandidate.distanceMeters ?? "0"}m away
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                        Primary Active Ticket
                      </span>
                      <span className="font-mono text-xs font-bold text-amber-900 dark:text-amber-200">
                        #CP-2026-{(selectedCandidate._id || "").toString().slice(-4).toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                      {selectedCandidate.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <StatusBadge status={selectedCandidate.status} />
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                        {selectedCandidate.category}
                      </span>
                    </div>

                    {/* Photo Thumbnail */}
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 border border-amber-200 dark:border-amber-800 mb-3 flex items-center justify-center">
                      {selectedCandidate.image?.url ? (
                        <img
                          src={selectedCandidate.image.url}
                          alt="Candidate report proof"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-slate-400">
                          <ImageIcon className="size-6" />
                          <span className="text-[11px]">No photo provided</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mb-3">
                      {selectedCandidate.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-amber-200/80 dark:border-amber-800/80 text-[11px] text-muted space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-3 text-slate-400" />
                      <span className="truncate">{selectedCandidate.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="size-3 text-slate-400" />
                      <span>Reported by {selectedCandidate.reporter?.name || "Citizen"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center p-8 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-400">
                  No candidate selected
                </div>
              )}
            </div>

            {/* Manager Merge Reasoning */}
            <div>
              <label
                htmlFor="duplicate-note"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Triage Note (Recorded in Audit Trail &amp; Citizen Notification)
              </label>
              <textarea
                id="duplicate-note"
                rows={2}
                value={duplicateNote}
                onChange={(e) => setDuplicateNote(e.target.value)}
                placeholder="e.g. Verified identical street corner pothole; merging into work order."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-900/60 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Keep Separate (Not a Duplicate)
            </button>

            <MagneticButton
              variant="primary"
              size="sm"
              onClick={handleMarkDuplicate}
              disabled={isSubmitting || !selectedParentId}
              className="!bg-amber-600 hover:!bg-amber-700 text-white text-xs font-bold flex items-center gap-2 px-5 py-2.5 shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Merging Duplicate...</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Confirm Duplicate &amp; Close Ticket</span>
                </>
              )}
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default DuplicateComparisonModal;
