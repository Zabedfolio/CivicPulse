"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, AlertOctagon } from "lucide-react";
import { IssueReportForm } from "./IssueReportForm";

/**
 * ReportIssueModal
 * Animated spring dialog built with Motion Brew spring physics.
 */
export function ReportIssueModal({ isOpen, onClose, onSuccess }) {
  // Prevent body scrolling when modal is active
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

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Spring Dialog Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-report-title"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 32,
              mass: 0.9,
            }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-[28px] border border-slate-200/90 dark:border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] z-10 max-h-[92dvh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-4 bg-slate-50/60 dark:bg-slate-900/60 shrink-0">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950/80 text-[#0D9488] border border-teal-200 dark:border-teal-800/80 mb-2">
                  <Sparkles className="w-3 h-3" />
                  Instant Dispatch Modal
                </div>
                <h2
                  id="modal-report-title"
                  className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight"
                >
                  Report Public Infrastructure Issue
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Log road damage, streetlight outages, or sanitation issues directly to municipal engineers.
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1">
              <IssueReportForm
                onSuccess={(issue) => {
                  if (onSuccess) onSuccess(issue);
                }}
                onClose={onClose}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ReportIssueModal;
