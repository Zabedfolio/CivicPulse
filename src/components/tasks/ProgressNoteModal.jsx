"use client";


import { API_BASE_URL } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import {
  X,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

/**
 * ProgressNoteModal (Motion Brew DialogSpring)
 * Quick modal for field technicians to append on-site engineering progress logs
 */
export function ProgressNoteModal({
  isOpen,
  task,
  onClose,
  onNoteAdded,
}) {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setNote("");
    setError("");
  }, [isOpen]);

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

  if (!isOpen || !task) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim() || note.trim().length < 3) {
      setError("Please provide a note with at least 3 characters.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${task._id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ note: note.trim() }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to record progress note.");
      }

      onNoteAdded?.(json.data?.progressReports);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to record progress note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md cursor-pointer"
          aria-hidden="true"
        />

        {/* Modal Card */}
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
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-[28px] border border-slate-200/90 dark:border-slate-800 shadow-2xl z-10 max-h-[92dvh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/60 dark:bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-teal-50 dark:bg-teal-950 text-[#0D9488] flex items-center justify-center shrink-0 border border-teal-200 dark:border-teal-800">
                <FileText className="size-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Add On-Site Progress Update
                </h2>
                <p className="text-xs text-muted mt-0.5 line-clamp-1">
                  {task.title}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="progress-note-input"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2"
              >
                Engineering Progress Log (Visible to Managers &amp; Citizen)
              </label>
              <textarea
                id="progress-note-input"
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Safety cones deployed. Subsurface asphalt excavated; applying primer coats..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Existing progress reports if any */}
            {task.progressReports && task.progressReports.length > 0 && (
              <div className="pt-2">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Previous Updates ({task.progressReports.length})
                </span>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {task.progressReports.slice().reverse().map((r, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
                    >
                      <p className="text-slate-800 dark:text-slate-200 font-medium">
                        {r.note}
                      </p>
                      <span className="block mt-1 text-[10px] text-slate-400">
                        {new Date(r.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-muted hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>

              <MagneticButton
                variant="primary"
                size="sm"
                type="submit"
                disabled={isSubmitting || !note.trim()}
                className="!bg-[#0D9488] hover:!bg-[#0f766e] text-white text-xs font-bold flex items-center gap-2 px-5 py-2.5 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Saving Update...</span>
                  </>
                ) : (
                  <>
                    <span>Record Progress</span>
                    <ArrowRight className="size-3" />
                  </>
                )}
              </MagneticButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ProgressNoteModal;
