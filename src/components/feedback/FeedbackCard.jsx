"use client";

import React from "react";
import { motion } from "motion/react";
import { Star, User, CheckCircle2, MessageSquareQuote } from "lucide-react";

/**
 * FeedbackCard (Motion Brew MotionCard)
 * Verified citizen post-resolution rating review card
 */
export function FeedbackCard({ feedback, className = "" }) {
  if (!feedback) return null;

  const rating = feedback.rating || 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`p-6 rounded-3xl bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 shadow-sm space-y-3 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Star row */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`size-4 ${
                  star <= rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-slate-300 dark:text-slate-700"
                }`}
              />
            ))}
          </div>

          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
            {rating}.0 out of 5
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="size-3 text-emerald-600" />
            <span>Verified Citizen Review</span>
          </span>
        </div>

        <span className="text-[11px] text-muted">
          Reviewed {new Date(feedback.createdAt).toLocaleDateString()}
        </span>
      </div>

      {feedback.comment ? (
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium italic">
          "{feedback.comment}"
        </p>
      ) : (
        <p className="text-xs text-muted italic">Citizen submitted a {rating}-star rating with no written remarks.</p>
      )}

      {feedback.citizen && (
        <div className="pt-2 flex items-center gap-2 text-xs text-muted border-t border-amber-100 dark:border-slate-800/80">
          <div className="size-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px] overflow-hidden">
            {feedback.citizen.image ? (
              <img src={feedback.citizen.image} alt={feedback.citizen.name} className="size-full object-cover" />
            ) : (
              feedback.citizen.name?.charAt(0) || <User className="size-3" />
            )}
          </div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {feedback.citizen.name || "Reporting Citizen"}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default FeedbackCard;
