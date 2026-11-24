"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";

const SENTIMENTS = {
  1: { label: "Poor / Incomplete Repair", color: "text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900" },
  2: { label: "Subpar Quality", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900" },
  3: { label: "Satisfactory Fix", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900" },
  4: { label: "Great Craftsmanship", color: "text-teal-600 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-900" },
  5: { label: "Exceptional Municipal Service!", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900" },
};

/**
 * StarRatingInput (Motion Brew StarRatingInteractive)
 * Interactive 1-5 star selector with spring physics and sentiment labels
 */
export function StarRatingInput({
  value = 5,
  onChange,
  disabled = false,
  className = "",
}) {
  const [hoverValue, setHoverValue] = useState(0);

  const activeValue = hoverValue || value;
  const sentiment = SENTIMENTS[activeValue] || SENTIMENTS[5];

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* 5 Stars row */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= activeValue;
          return (
            <motion.button
              key={star}
              type="button"
              disabled={disabled}
              onClick={() => onChange?.(star)}
              onMouseEnter={() => setHoverValue(star)}
              onMouseLeave={() => setHoverValue(0)}
              whileHover={{ scale: 1.25, rotate: [0, -6, 6, 0] }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className="p-1 rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              <Star
                className={`size-8 transition-colors ${
                  isFilled
                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)]"
                    : "fill-transparent text-slate-300 dark:text-slate-700 hover:text-slate-400"
                }`}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Dynamic Sentiment Badge */}
      <motion.div
        key={activeValue}
        initial={{ opacity: 0, y: 4, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.15 }}
        className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${sentiment.color}`}
      >
        <span>{sentiment.label}</span>
      </motion.div>
    </div>
  );
}

export default StarRatingInput;
