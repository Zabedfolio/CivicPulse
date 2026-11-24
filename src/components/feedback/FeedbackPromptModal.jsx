"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StarRatingInput } from "./StarRatingInput";
import { MagneticButton } from "@/components/ui/MagneticButton";
import {
  X,
  Star,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  MessageSquare,
} from "lucide-react";

/**
 * FeedbackPromptModal (Motion Brew DialogSpring)
 * Post-resolution satisfaction survey for citizens with interactive star rating
 */
export function FeedbackPromptModal({
  isOpen,
  issue,
  onClose,
  onFeedbackSubmitted,
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setRating(5);
    setComment("");
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

  if (!isOpen || !issue) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/issues/${issue._id}/feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            rating,
            comment: comment.trim(),
          }),
        }
      );

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to submit feedback.");
      }

      onFeedbackSubmitted?.(json.data?.feedback);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/90 dark:border-slate-800 shadow-2xl z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-amber-50/40 dark:bg-amber-950/20">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0">
                <Star className="size-5 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Rate Repair Quality
                </h2>
                <p className="text-xs text-muted mt-0.5 line-clamp-1">
                  {issue.title}
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
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Star Rating Picker */}
            <div className="py-2">
              <StarRatingInput value={rating} onChange={setRating} disabled={isSubmitting} />
            </div>

            {/* Comment Area */}
            <div>
              <label
                htmlFor="citizen-feedback-comment"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5"
              >
                <MessageSquare className="size-3.5 text-slate-400" />
                <span>Your Citizen Feedback (Optional)</span>
              </label>
              <textarea
                id="citizen-feedback-comment"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on the craftsmanship, speed, or quality of this municipal fix..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-muted hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Skip / Later
              </button>

              <MagneticButton
                variant="primary"
                size="sm"
                type="submit"
                disabled={isSubmitting}
                className="!bg-amber-600 hover:!bg-amber-700 text-white text-xs font-bold flex items-center gap-2 px-5 py-2.5 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3.5" />
                    <span>Submit Review</span>
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

export default FeedbackPromptModal;
